import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCar } from '../context/CarContext.tsx';
import { Conversation, Message } from '../types.ts';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Tag,
  Check,
  X,
  Car as CarIcon,
  Store,
  Briefcase,
  User,
  ArrowLeft,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { currentUser, formatPrice } = useAuth();
  const { chatCar, setChatCar, setSelectedCar, setActiveView } = useCar();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [isOfferMode, setIsOfferMode] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Load conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/conversations?userId=${currentUser.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);
        if (data.length > 0 && !activeConvo) {
          setActiveConvo(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUser.id]);

  // If chatCar is provided, initiate or select that car's conversation
  useEffect(() => {
    if (chatCar) {
      const initChat = async () => {
        try {
          const res = await fetch('/api/conversations/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              carId: chatCar.id,
              buyerId: currentUser.id,
              initialMessage: `¡Hola! Me interesa este ${chatCar.brand} ${chatCar.model}. ¿Está disponible?`,
            }),
          });
          const convo = await res.json();
          await fetchConversations();
          setActiveConvo(convo);
          setChatCar(null);
        } catch (e) {
          console.error(e);
        }
      };
      initChat();
    }
  }, [chatCar]);

  // Load messages for active conversation
  const fetchMessages = async (convoId: number) => {
    try {
      const res = await fetch(`/api/conversations/${convoId}/messages`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeConvo) {
      fetchMessages(activeConvo.id);
      if (activeConvo.car?.price) {
        setOfferAmount(activeConvo.car.price);
      }
    }
  }, [activeConvo?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvo) return;
    if (!inputMsg.trim() && !isOfferMode) return;

    const payload = {
      senderId: currentUser.id,
      message: isOfferMode
        ? `Oferta formal de compra por ${formatPrice(offerAmount)}. ${inputMsg.trim()}`
        : inputMsg.trim(),
      isOffer: isOfferMode,
      offerAmount: isOfferMode ? offerAmount : null,
    };

    try {
      const res = await fetch(`/api/conversations/${activeConvo.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setInputMsg('');
      setIsOfferMode(false);
      fetchConversations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRespondOffer = async (msgId: number, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/messages/${msgId}/respond-offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, offerStatus: status } : m)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <span>Mensajería y Negociación de Ofertas</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Chat seguro tripartito entre comprador, vendedor y agente afiliado AutoEuropa con soporte de ofertas vinculantes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden min-h-[650px] shadow-2xl">
        {/* Left: Conversation List */}
        <div className="border-r border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Conversaciones ({conversations.length})
            </div>

            {loading ? (
              <div className="text-center py-10 text-xs text-slate-500">Cargando chats...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12 px-4 text-xs text-slate-400">
                No tienes mensajes activos. Pulsa "Contactar" en cualquier coche del catálogo para iniciar un chat.
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((c) => {
                  const isSelected = activeConvo?.id === c.id;
                  const car = c.car;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveConvo(c)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500/40 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {car?.images && car.images.length > 0 ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                            <img
                              src={car.images[0]}
                              alt={car.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                            <CarIcon className="w-6 h-6 text-slate-500" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-xs truncate text-white">
                              {car ? `${car.brand} ${car.model}` : 'Conversación de coche'}
                            </h4>
                            {c.car?.price && (
                              <span className="text-[11px] font-bold text-blue-400 shrink-0">
                                {formatPrice(c.car.price)}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {c.lastMessage || 'Sin mensajes'}
                          </p>
                          {c.affiliateId && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 mt-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> Con Agente Afiliado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div className="lg:col-span-2 flex flex-col justify-between h-[650px] bg-slate-950/40">
          {activeConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeConvo.car && (
                    <div
                      onClick={() => {
                        setSelectedCar(activeConvo.car!);
                        setActiveView('detail');
                      }}
                      className="cursor-pointer group flex items-center gap-2.5"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={activeConvo.car.images?.[0] || ''}
                          alt={activeConvo.car.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                          {activeConvo.car.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {formatPrice(activeConvo.car.price)} • {activeConvo.car.city}, {activeConvo.car.country}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {activeConvo.affiliateId && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Agente Hans Becker asignado</span>
                  </div>
                )}
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  const isAgent = m.senderId === 2; // Hans Becker demo id
                  const isSeller = m.senderId === 3 || m.senderId === 4;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender label */}
                      <div className="text-[10px] text-slate-400 mb-1 px-1 flex items-center gap-1">
                        {isMe && <span>Tú</span>}
                        {!isMe && isAgent && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Hans Becker (Agente Afiliado UE)
                          </span>
                        )}
                        {!isMe && isSeller && (
                          <span className="text-blue-400 font-bold">Vendedor</span>
                        )}
                        {!isMe && !isAgent && !isSeller && (
                          <span className="text-slate-300">Comprador</span>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          m.isOffer
                            ? 'bg-gradient-to-r from-amber-950/80 to-slate-900 border-2 border-amber-500/60 text-white shadow-lg'
                            : isMe
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : isAgent
                            ? 'bg-emerald-950/80 text-emerald-100 border border-emerald-500/30 rounded-bl-xs'
                            : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {m.isOffer && (
                          <div className="mb-2 pb-2 border-b border-amber-500/30 flex items-center justify-between">
                            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5" /> Oferta Oficial de Compra
                            </span>
                            <span className="text-sm font-black text-white">
                              {formatPrice(m.offerAmount || 0)}
                            </span>
                          </div>
                        )}

                        <p className="whitespace-pre-line">{m.message}</p>

                        {/* If it's an offer, show resolution buttons */}
                        {m.isOffer && (
                          <div className="mt-3 pt-2 border-t border-amber-500/30 flex items-center justify-between">
                            <div className="text-[11px] font-semibold">
                              Estado:{' '}
                              <span
                                className={
                                  m.offerStatus === 'accepted'
                                    ? 'text-emerald-400'
                                    : m.offerStatus === 'rejected'
                                    ? 'text-rose-400'
                                    : 'text-amber-300'
                                }
                              >
                                {m.offerStatus === 'accepted' && '✓ Oferta Aceptada'}
                                {m.offerStatus === 'rejected' && '✗ Oferta Rechazada'}
                                {(!m.offerStatus || m.offerStatus === 'pending') && '⏳ Pendiente de respuesta'}
                              </span>
                            </div>

                            {(!m.offerStatus || m.offerStatus === 'pending') && !isMe && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleRespondOffer(m.id, 'rejected')}
                                  className="p-1 px-2 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-300 hover:bg-rose-900 text-[10px] font-bold"
                                >
                                  Rechazar
                                </button>
                                <button
                                  onClick={() => handleRespondOffer(m.id, 'accepted')}
                                  className="p-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-md shadow-emerald-600/30"
                                >
                                  Aceptar
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/60">
                {isOfferMode && (
                  <div className="mb-3 p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-amber-200">Hacer una Oferta de Compra (€):</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(Number(e.target.value))}
                        className="w-32 bg-slate-950 border border-amber-500/60 rounded-lg p-1.5 text-xs text-white font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setIsOfferMode(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOfferMode(!isOfferMode)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isOfferMode
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                        : 'bg-slate-800 hover:bg-slate-750 text-amber-300 border-amber-500/30'
                    }`}
                    title="Hacer oferta de precio"
                  >
                    <Tag className="w-4 h-4" />
                    <span className="hidden sm:inline">Oferta</span>
                  </button>

                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder={
                      isOfferMode
                        ? 'Añade un mensaje junto a tu oferta de precio...'
                        : 'Escribe un mensaje al vendedor o al agente...'
                    }
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />

                  <button
                    type="submit"
                    className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs p-8">
              <MessageSquare className="w-12 h-12 text-slate-600 mb-3" />
              <p>Selecciona una conversación a la izquierda para ver los mensajes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
