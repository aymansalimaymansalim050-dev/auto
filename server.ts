import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { db } from './src/db/index.ts';
import {
  users,
  cars,
  carPromotions,
  favorites,
  savedSearches,
  conversations,
  messages,
  affiliateAssignments,
} from './src/db/schema.ts';
import { eq, and, or, gte, lte, ilike, desc, asc, sql } from 'drizzle-orm';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client server-side only
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --------------------------------------------------------------------------
// CARS API
// --------------------------------------------------------------------------

// GET /api/cars (Advanced filters, sorting, search)
app.get('/api/cars', async (req, res) => {
  try {
    const {
      search,
      brand,
      model,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minMileage,
      maxMileage,
      fuelType,
      country,
      city,
      transmission,
      bodyType,
      saleType,
      promotionOnly,
      sellerId,
      sortBy,
    } = req.query;

    const conditions = [];

    if (search && typeof search === 'string') {
      const s = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(cars.title, s),
          ilike(cars.brand, s),
          ilike(cars.model, s),
          ilike(cars.city, s),
          ilike(cars.country, s)
        )
      );
    }

    if (brand && typeof brand === 'string' && brand !== 'all') {
      conditions.push(eq(cars.brand, brand));
    }

    if (model && typeof model === 'string' && model !== 'all') {
      conditions.push(ilike(cars.model, `%${model}%`));
    }

    if (minPrice) {
      conditions.push(gte(cars.price, Number(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(cars.price, Number(maxPrice)));
    }

    if (minYear) {
      conditions.push(gte(cars.year, Number(minYear)));
    }

    if (maxYear) {
      conditions.push(lte(cars.year, Number(maxYear)));
    }

    if (minMileage) {
      conditions.push(gte(cars.mileage, Number(minMileage)));
    }

    if (maxMileage) {
      conditions.push(lte(cars.mileage, Number(maxMileage)));
    }

    if (fuelType && typeof fuelType === 'string' && fuelType !== 'all') {
      conditions.push(eq(cars.fuelType, fuelType));
    }

    if (country && typeof country === 'string' && country !== 'all') {
      conditions.push(eq(cars.country, country));
    }

    if (city && typeof city === 'string' && city !== 'all') {
      conditions.push(ilike(cars.city, `%${city}%`));
    }

    if (transmission && typeof transmission === 'string' && transmission !== 'all') {
      conditions.push(eq(cars.transmission, transmission));
    }

    if (bodyType && typeof bodyType === 'string' && bodyType !== 'all') {
      conditions.push(eq(cars.bodyType, bodyType));
    }

    if (saleType && typeof saleType === 'string' && saleType !== 'all') {
      conditions.push(eq(cars.saleType, saleType));
    }

    if (promotionOnly === 'true') {
      conditions.push(or(eq(cars.promotionLevel, 'highlighted'), eq(cars.promotionLevel, 'top_europe'), eq(cars.promotionLevel, 'inspected')));
    }

    if (sellerId) {
      conditions.push(eq(cars.sellerId, Number(sellerId)));
    }

    let orderByClause = desc(cars.createdAt);
    if (sortBy === 'price_asc') orderByClause = asc(cars.price);
    else if (sortBy === 'price_desc') orderByClause = desc(cars.price);
    else if (sortBy === 'year_desc') orderByClause = desc(cars.year);
    else if (sortBy === 'mileage_asc') orderByClause = asc(cars.mileage);
    else if (sortBy === 'views_desc') orderByClause = desc(cars.viewsCount);

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const carList = await db.query.cars.findMany({
      where: whereClause,
      orderBy: [
        // promoted cars first
        sql`CASE 
          WHEN ${cars.promotionLevel} = 'top_europe' THEN 1 
          WHEN ${cars.promotionLevel} = 'inspected' THEN 2 
          WHEN ${cars.promotionLevel} = 'highlighted' THEN 3 
          ELSE 4 END`,
        orderByClause,
      ],
      with: {
        seller: true,
        affiliate: true,
      },
    });

    const parsedCars = carList.map((c) => ({
      ...c,
      features: JSON.parse(c.features || '[]'),
      images: JSON.parse(c.images || '[]'),
    }));

    res.json(parsedCars);
  } catch (error: any) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Error al consultar el catálogo de coches' });
  }
});

// GET /api/cars/:id
app.get('/api/cars/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const car = await db.query.cars.findFirst({
      where: eq(cars.id, id),
      with: {
        seller: true,
        affiliate: true,
      },
    });

    if (!car) {
      return res.status(404).json({ error: 'Coche no encontrado' });
    }

    // Increment view count asynchronously
    await db.update(cars).set({ viewsCount: car.viewsCount + 1 }).where(eq(cars.id, id));

    res.json({
      ...car,
      viewsCount: car.viewsCount + 1,
      features: JSON.parse(car.features || '[]'),
      images: JSON.parse(car.images || '[]'),
    });
  } catch (error: any) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: 'Error al consultar el coche' });
  }
});

// POST /api/cars (Create new listing)
app.post('/api/cars', async (req, res) => {
  try {
    const {
      sellerId = 3, // default demo seller if not logged in
      title,
      brand,
      model,
      version,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      bodyType,
      powerHp = 150,
      engineSize = '2.0 L',
      doors = 5,
      seats = 5,
      color = 'Blanco',
      co2Emissions = 120,
      consumption = '5.0 l/100km',
      country = 'España',
      city,
      postalCode,
      description,
      features = [],
      images = [],
      saleType = 'direct',
      affiliateId,
      affiliateFee = 450,
      promotionLevel = 'standard',
    } = req.body;

    if (!title || !brand || !model || !year || !price || !mileage || !fuelType || !transmission || !bodyType || !city || !description) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para publicar el coche' });
    }

    // Assign default affiliate (e.g. Hans Becker) if secure_affiliate selected and no affiliateId provided
    let assignedAffiliateId = affiliateId ? Number(affiliateId) : null;
    if (saleType === 'secure_affiliate' && !assignedAffiliateId) {
      const defaultAffiliate = await db.query.users.findFirst({
        where: eq(users.role, 'affiliate'),
      });
      if (defaultAffiliate) {
        assignedAffiliateId = defaultAffiliate.id;
      }
    }

    const newCar = await db.insert(cars).values({
      sellerId: Number(sellerId),
      title,
      brand,
      model,
      version: version || null,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      fuelType,
      transmission,
      bodyType,
      powerHp: Number(powerHp),
      engineSize: engineSize || null,
      doors: Number(doors),
      seats: Number(seats),
      color: color || null,
      co2Emissions: Number(co2Emissions),
      consumption: consumption || null,
      country,
      city,
      postalCode: postalCode || null,
      description,
      features: JSON.stringify(features),
      images: JSON.stringify(images.length > 0 ? images : ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80']),
      saleType,
      affiliateId: assignedAffiliateId,
      affiliateFee: Number(affiliateFee),
      promotionLevel,
    }).returning();

    // If secure affiliate sale, create affiliate assignment record
    if (saleType === 'secure_affiliate' && assignedAffiliateId) {
      await db.insert(affiliateAssignments).values({
        affiliateId: assignedAffiliateId,
        carId: newCar[0].id,
        sellerId: Number(sellerId),
        status: 'assigned',
        commissionAmount: Number(affiliateFee),
        commissionPaid: false,
        notes: 'Vehículo registrado para venta segura con verificación europea.',
      });
    }

    res.json({
      ...newCar[0],
      features: JSON.parse(newCar[0].features),
      images: JSON.parse(newCar[0].images),
    });
  } catch (error: any) {
    console.error('Error creating car listing:', error);
    res.status(500).json({ error: 'Error al publicar el coche' });
  }
});

// PUT /api/cars/:id/promote
app.post('/api/cars/:id/promote', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { tier, pricePaid, userId = 3 } = req.body;

    if (!['highlighted', 'top_europe', 'inspected'].includes(tier)) {
      return res.status(400).json({ error: 'Nivel de promoción no válido' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.update(cars).set({
      promotionLevel: tier,
      promotionExpiresAt: expiresAt,
    }).where(eq(cars.id, id));

    await db.insert(carPromotions).values({
      carId: id,
      userId: Number(userId),
      tier,
      pricePaid: Number(pricePaid || 29),
      durationDays: 30,
      status: 'active',
    });

    res.json({ success: true, message: `Anuncio promocionado a ${tier}` });
  } catch (error: any) {
    console.error('Error promoting car:', error);
    res.status(500).json({ error: 'Error al procesar la promoción del coche' });
  }
});

// --------------------------------------------------------------------------
// AI GEMINI 3.8 FLASH: SMART LISTING GENERATOR
// --------------------------------------------------------------------------

app.post('/api/ai/generate-listing', async (req, res) => {
  try {
    const {
      brand,
      model,
      version,
      year,
      mileage,
      fuelType,
      transmission,
      bodyType,
      powerHp,
      country,
      city,
      rawNotes,
      photoDescriptions,
    } = req.body;

    const promptText = `
Eres el especialista automotriz inteligente de la plataforma europea "AutoEuropa".
Tu misión es generar un título publicitario profesional, una descripción comercial estructurada, una lista de equipamiento relevante y un rango de precio estimado de mercado en la Unión Europea.

REGLAS ESTRICTAS DE VERACIDAD:
1. NO inventes características mecánicas, extras o datos que no hayan sido proporcionados explícitamente o inferidos directamente de los datos técnicos reales del modelo base.
2. Si un dato no se conoce (por ejemplo, estado de frenos o libro de revisiones), redacta invitando cordialmente a que el comprador consulte dicho detalle con el vendedor.
3. El idioma debe ser español europeo impecable, profesional y vendedor.
4. Genera una estructura clara:
   - Título comercial optimizado (Marca + Modelo + Versión + Potencia/Cambio + Año)
   - Resumen y atractivo del vehículo
   - Aspectos técnicos destacados
   - Equipamiento y confort
   - Garantía y facilidades de venta en Europa (venta directa o segura)

Datos del vehículo:
- Marca: ${brand || 'No especificada'}
- Modelo: ${model || 'No especificado'}
- Versión / Acabado: ${version || 'Estándar'}
- Año de matriculación: ${year || 'Reciente'}
- Kilometraje: ${mileage ? `${mileage} km` : 'No especificado'}
- Combustible: ${fuelType || 'Gasolina'}
- Transmisión: ${transmission || 'Automático'}
- Tipo de carrocería: ${bodyType || 'Sedán'}
- Potencia: ${powerHp ? `${powerHp} CV` : 'Potencia estándar'}
- Ubicación: ${city || 'Madrid'}, ${country || 'España'}
- Notas del vendedor: ${rawNotes || 'Vehículo en excelente estado de conservación.'}
${photoDescriptions ? `- Observaciones de las fotos: ${photoDescriptions}` : ''}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Título optimizado del anuncio para compradores europeos',
            },
            description: {
              type: Type.STRING,
              description: 'Descripción completa, atractiva y estructurada del vehículo sin inventar datos',
            },
            suggestedFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de extras y características equipadas en el vehículo',
            },
            estimatedPriceMin: {
              type: Type.INTEGER,
              description: 'Precio mínimo estimado de mercado europeo en EUR',
            },
            estimatedPriceMax: {
              type: Type.INTEGER,
              description: 'Precio máximo estimado de mercado europeo en EUR',
            },
            sellingTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Consejos para vender rápido y seguro este modelo en la UE',
            },
          },
          required: ['title', 'description', 'suggestedFeatures', 'estimatedPriceMin', 'estimatedPriceMax'],
        },
      },
    });

    const output = JSON.parse(response.text?.trim() || '{}');
    res.json(output);
  } catch (error: any) {
    console.error('Error generating AI listing:', error);
    res.status(500).json({ error: 'Error al generar el anuncio con IA: ' + (error.message || 'Error del servidor') });
  }
});

// --------------------------------------------------------------------------
// USERS & ROLES API
// --------------------------------------------------------------------------

// GET /api/users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await db.query.users.findMany();
    res.json(allUsers);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error al consultar usuarios' });
  }
});

// POST /api/users/sync (sync Firebase or Demo user)
app.post('/api/users/sync', async (req, res) => {
  try {
    const { uid, email, name, role = 'buyer', country = 'España', city = 'Madrid' } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID y Email requeridos' });
    }

    const existing = await db.query.users.findFirst({
      where: eq(users.uid, uid),
    });

    if (existing) {
      return res.json(existing);
    }

    const inserted = await db.insert(users).values({
      uid,
      email,
      name: name || email.split('@')[0],
      role,
      country,
      city,
      verified: true,
    }).returning();

    res.json(inserted[0]);
  } catch (error: any) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Error al sincronizar usuario' });
  }
});

// POST /api/users/:id/role
app.post('/api/users/:id/role', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;
    await db.update(users).set({ role }).where(eq(users.id, id));
    res.json({ success: true, role });
  } catch (error: any) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
});

// --------------------------------------------------------------------------
// FAVORITES & SAVED SEARCHES
// --------------------------------------------------------------------------

app.get('/api/favorites', async (req, res) => {
  try {
    const userId = Number(req.query.userId || 5);
    const favs = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      with: {
        // car
      },
    });

    const carIds = favs.map((f) => f.carId);
    if (carIds.length === 0) {
      return res.json([]);
    }

    const favoriteCars = await db.query.cars.findMany({
      where: inArrayHelper(cars.id, carIds),
      with: {
        seller: true,
        affiliate: true,
      },
    });

    res.json(
      favoriteCars.map((c) => ({
        ...c,
        features: JSON.parse(c.features || '[]'),
        images: JSON.parse(c.images || '[]'),
      }))
    );
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Error al consultar favoritos' });
  }
});

function inArrayHelper(column: any, values: number[]) {
  if (values.length === 0) return sql`1=0`;
  return sql`${column} IN (${sql.join(values, sql`, `)})`;
}

app.post('/api/favorites/toggle', async (req, res) => {
  try {
    const { userId = 5, carId } = req.body;
    const existing = await db.query.favorites.findFirst({
      where: and(eq(favorites.userId, Number(userId)), eq(favorites.carId, Number(carId))),
    });

    if (existing) {
      await db.delete(favorites).where(eq(favorites.id, existing.id));
      await db.update(cars).set({ favoritesCount: sql`GREATEST(${cars.favoritesCount} - 1, 0)` }).where(eq(cars.id, Number(carId)));
      return res.json({ favorited: false });
    } else {
      await db.insert(favorites).values({ userId: Number(userId), carId: Number(carId) });
      await db.update(cars).set({ favoritesCount: sql`${cars.favoritesCount} + 1` }).where(eq(cars.id, Number(carId)));
      return res.json({ favorited: true });
    }
  } catch (error: any) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Error al actualizar favoritos' });
  }
});

// Saved Searches
app.get('/api/saved-searches', async (req, res) => {
  try {
    const userId = Number(req.query.userId || 5);
    const searches = await db.query.savedSearches.findMany({
      where: eq(savedSearches.userId, userId),
      orderBy: [desc(savedSearches.createdAt)],
    });
    res.json(searches.map((s) => ({ ...s, filters: JSON.parse(s.filters) })));
  } catch (error: any) {
    console.error('Error fetching saved searches:', error);
    res.status(500).json({ error: 'Error al consultar búsquedas guardadas' });
  }
});

app.post('/api/saved-searches', async (req, res) => {
  try {
    const { userId = 5, name, filters } = req.body;
    const inserted = await db.insert(savedSearches).values({
      userId: Number(userId),
      name,
      filters: JSON.stringify(filters),
    }).returning();
    res.json({ ...inserted[0], filters: JSON.parse(inserted[0].filters) });
  } catch (error: any) {
    console.error('Error saving search:', error);
    res.status(500).json({ error: 'Error al guardar búsqueda' });
  }
});

// --------------------------------------------------------------------------
// CHAT & OFFERS API (Buyer, Seller, Affiliate)
// --------------------------------------------------------------------------

app.get('/api/conversations', async (req, res) => {
  try {
    const userId = Number(req.query.userId || 5);
    const convos = await db.query.conversations.findMany({
      where: or(
        eq(conversations.buyerId, userId),
        eq(conversations.sellerId, userId),
        eq(conversations.affiliateId, userId)
      ),
      orderBy: [desc(conversations.lastMessageAt)],
      with: {
        car: true,
        buyer: true,
        seller: true,
        affiliate: true,
      },
    });

    const parsed = convos.map((c) => ({
      ...c,
      car: c.car ? {
        ...c.car,
        images: JSON.parse(c.car.images || '[]'),
      } : null,
    }));

    res.json(parsed);
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Error al consultar conversaciones' });
  }
});

app.post('/api/conversations/start', async (req, res) => {
  try {
    const { carId, buyerId = 5, initialMessage = '¡Hola! Estoy interesado en este coche.' } = req.body;

    const car = await db.query.cars.findFirst({
      where: eq(cars.id, Number(carId)),
    });

    if (!car) {
      return res.status(404).json({ error: 'Coche no encontrado' });
    }

    // Check if conversation already exists between buyer and seller for this car
    let convo = await db.query.conversations.findFirst({
      where: and(
        eq(conversations.carId, Number(carId)),
        eq(conversations.buyerId, Number(buyerId)),
        eq(conversations.sellerId, car.sellerId)
      ),
    });

    if (!convo) {
      const inserted = await db.insert(conversations).values({
        carId: Number(carId),
        buyerId: Number(buyerId),
        sellerId: car.sellerId,
        affiliateId: car.affiliateId,
        lastMessage: initialMessage,
      }).returning();
      convo = inserted[0];
    }

    // Insert first message
    await db.insert(messages).values({
      conversationId: convo.id,
      senderId: Number(buyerId),
      message: initialMessage,
    });

    res.json(convo);
  } catch (error: any) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Error al iniciar conversación' });
  }
});

app.get('/api/conversations/:id/messages', async (req, res) => {
  try {
    const conversationId = Number(req.params.id);
    const msgList = await db.query.messages.findMany({
      where: eq(messages.conversationId, conversationId),
      orderBy: [asc(messages.createdAt)],
      with: {
        sender: true,
      },
    });
    res.json(msgList);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error al consultar mensajes' });
  }
});

app.post('/api/conversations/:id/messages', async (req, res) => {
  try {
    const conversationId = Number(req.params.id);
    const { senderId, message: msgText, isOffer = false, offerAmount } = req.body;

    const newMsg = await db.insert(messages).values({
      conversationId,
      senderId: Number(senderId),
      message: msgText,
      isOffer: Boolean(isOffer),
      offerAmount: offerAmount ? Number(offerAmount) : null,
      offerStatus: isOffer ? 'pending' : null,
    }).returning();

    await db.update(conversations).set({
      lastMessage: msgText,
      lastMessageAt: new Date(),
    }).where(eq(conversations.id, conversationId));

    res.json(newMsg[0]);
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

app.post('/api/messages/:id/respond-offer', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body; // 'accepted' or 'rejected'

    const updated = await db.update(messages).set({
      offerStatus: status,
    }).where(eq(messages.id, id)).returning();

    res.json(updated[0]);
  } catch (error: any) {
    console.error('Error responding to offer:', error);
    res.status(500).json({ error: 'Error al responder a la oferta' });
  }
});

// --------------------------------------------------------------------------
// AFFILIATE AGENT DASHBOARD API
// --------------------------------------------------------------------------

app.get('/api/affiliate/assignments', async (req, res) => {
  try {
    const affiliateId = Number(req.query.affiliateId || 2);
    const assignments = await db.query.affiliateAssignments.findMany({
      where: eq(affiliateAssignments.affiliateId, affiliateId),
      orderBy: [desc(affiliateAssignments.createdAt)],
      with: {
        car: true,
        seller: true,
        buyer: true,
      },
    });

    const parsed = assignments.map((a: any) => ({
      ...a,
      car: a.car ? {
        ...a.car,
        images: JSON.parse(a.car.images || '[]'),
      } : null,
    }));

    res.json(parsed);
  } catch (error: any) {
    console.error('Error fetching affiliate assignments:', error);
    res.status(500).json({ error: 'Error al consultar asignaciones de afiliado' });
  }
});

app.put('/api/affiliate/assignments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, inspectionReport, notes, commissionPaid } = req.body;

    const updated = await db.update(affiliateAssignments).set({
      ...(status && { status }),
      ...(inspectionReport !== undefined && { inspectionReport }),
      ...(notes !== undefined && { notes }),
      ...(commissionPaid !== undefined && { commissionPaid: Boolean(commissionPaid) }),
    }).where(eq(affiliateAssignments.id, id)).returning();

    res.json(updated[0]);
  } catch (error: any) {
    console.error('Error updating affiliate assignment:', error);
    res.status(500).json({ error: 'Error al actualizar asignación' });
  }
});

// --------------------------------------------------------------------------
// ADMIN DASHBOARD API
// --------------------------------------------------------------------------

app.get('/api/admin/overview', async (req, res) => {
  try {
    const allUsers = await db.query.users.findMany({ orderBy: [desc(users.createdAt)] });
    const allCars = await db.query.cars.findMany({
      orderBy: [desc(cars.createdAt)],
      with: { seller: true, affiliate: true },
    });
    const allAssignments = await db.query.affiliateAssignments.findMany({
      with: { car: true, seller: true, affiliate: true },
    });
    const allPromotions = await db.query.carPromotions.findMany({
      with: { user: true, car: true },
    });

    const totalRevenuePromotions = allPromotions.reduce((acc, p) => acc + p.pricePaid, 0);
    const totalAffiliateCommissions = allAssignments.reduce((acc, a) => acc + a.commissionAmount, 0);

    res.json({
      stats: {
        totalUsers: allUsers.length,
        totalCars: allCars.length,
        activeCars: allCars.filter((c) => c.status === 'active').length,
        secureSales: allCars.filter((c) => c.saleType === 'secure_affiliate').length,
        affiliateCount: allUsers.filter((u) => u.role === 'affiliate').length,
        dealersCount: allUsers.filter((u) => u.role === 'seller_dealer').length,
        totalRevenuePromotions,
        totalAffiliateCommissions,
      },
      users: allUsers,
      cars: allCars.map((c) => ({ ...c, images: JSON.parse(c.images || '[]') })),
      assignments: allAssignments,
      promotions: allPromotions,
    });
  } catch (error: any) {
    console.error('Error fetching admin overview:', error);
    res.status(500).json({ error: 'Error al consultar panel de administración' });
  }
});

// Admin toggle user verification
app.post('/api/admin/users/:id/verify', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { verified } = req.body;
    await db.update(users).set({ verified: Boolean(verified) }).where(eq(users.id, id));
    res.json({ success: true, verified });
  } catch (error: any) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Error al verificar usuario' });
  }
});

// Admin change car status
app.post('/api/admin/cars/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    await db.update(cars).set({ status }).where(eq(cars.id, id));
    res.json({ success: true, status });
  } catch (error: any) {
    console.error('Error updating car status:', error);
    res.status(500).json({ error: 'Error al actualizar estado del coche' });
  }
});

// --------------------------------------------------------------------------
// VITE MIDDLEWARE & SPA FALLBACK
// --------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoEuropa Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
