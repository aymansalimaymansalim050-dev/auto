import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  switchUserRole: (role: UserRole) => Promise<void>;
  switchDemoUser: (role: UserRole) => Promise<void>;
  switchUserById: (id: number) => void;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  currency: 'EUR' | 'GBP' | 'CHF';
  setCurrency: (c: 'EUR' | 'GBP' | 'CHF') => void;
  formatPrice: (eur: number) => string;
  language: 'ES' | 'EN' | 'DE' | 'FR' | 'IT';
  setLanguage: (l: 'ES' | 'EN' | 'DE' | 'FR' | 'IT') => void;
}

// Default demo users for immediate exploration of all European roles
const defaultUsers: User[] = [
  {
    id: 5,
    uid: 'buyer_demo_01',
    email: 'aymansalimaymansalim050@gmail.com',
    name: 'Ayman Salim (Comprador)',
    role: 'buyer',
    country: 'España',
    city: 'Barcelona',
    verified: true,
  },
  {
    id: 3,
    uid: 'dealer_madrid_01',
    email: 'ventas@premiummotors.es',
    name: 'Premium Motors Madrid (Concesionario)',
    role: 'seller_dealer',
    country: 'España',
    city: 'Madrid',
    companyName: 'Premium Motors S.L.',
    verified: true,
  },
  {
    id: 4,
    uid: 'seller_fr_01',
    email: 'jl.dupont@gmail.com',
    name: 'Jean-Luc Dupont (Particular)',
    role: 'seller_private',
    country: 'Francia',
    city: 'Lyon',
    verified: true,
  },
  {
    id: 2,
    uid: 'affiliate_eu_01',
    email: 'hans.becker@autoeuropa-agents.de',
    name: 'Hans Becker (Agente Afiliado)',
    role: 'affiliate',
    country: 'Alemania',
    city: 'Múnich',
    companyName: 'Bavaria SafeCar Inspections & Export',
    verified: true,
    affiliateCode: 'EU-DE-994',
  },
  {
    id: 1,
    uid: 'admin_auto_eu',
    email: 'admin@autoeuropa.com',
    name: 'Carlos Mendoza (Admin)',
    role: 'admin',
    country: 'España',
    city: 'Madrid',
    companyName: 'AutoEuropa Central S.L.',
    verified: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUsers[0]);
  const [availableUsers, setAvailableUsers] = useState<User[]>(defaultUsers);
  const [currency, setCurrency] = useState<'EUR' | 'GBP' | 'CHF'>('EUR');
  const [language, setLanguage] = useState<'ES' | 'EN' | 'DE' | 'FR' | 'IT'>('ES');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load registered users from database
  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAvailableUsers(data);
          const found = data.find((u) => u.id === currentUser.id) || data[0];
          setCurrentUser(found);
        }
      })
      .catch((err) => console.log('Using default users:', err));
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await fetch('/api/users/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
              avatarUrl: firebaseUser.photoURL,
              role: 'buyer',
            }),
          });
          const userObj = await res.json();
          if (userObj.id) {
            setCurrentUser(userObj);
            setAvailableUsers((prev) => {
              const filtered = prev.filter((u) => u.uid !== userObj.uid);
              return [userObj, ...filtered];
            });
          }
        } catch (e) {
          console.error('Error syncing firebase user:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const switchUserRole = async (role: UserRole) => {
    // Find an existing user with that role or update current user's role
    const matched = availableUsers.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    } else {
      try {
        await fetch(`/api/users/${currentUser.id}/role`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
        setCurrentUser({ ...currentUser, role });
      } catch (err) {
        console.error('Error changing role:', err);
      }
    }
  };

  const switchUserById = (id: number) => {
    const found = availableUsers.find((u) => u.id === id);
    if (found) setCurrentUser(found);
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error('Firebase Google Sign-In error:', err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(defaultUsers[0]);
  };

  const formatPrice = (eur: number) => {
    let rate = 1;
    let symbol = '€';
    if (currency === 'GBP') {
      rate = 0.85;
      symbol = '£';
    } else if (currency === 'CHF') {
      rate = 0.95;
      symbol = 'CHF';
    }
    const val = Math.round(eur * rate);
    return `${val.toLocaleString()} ${symbol}`;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        switchUserRole,
        switchDemoUser: switchUserRole,
        switchUserById,
        signInWithGoogle,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        currency,
        setCurrency,
        formatPrice,
        language,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
