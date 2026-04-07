import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User, Business } from '../types';
import { businessService } from '../services/businessService';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  business: Business | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        try {
          const businessData = await businessService.getBusiness(firebaseUser.uid);
          if (businessData) {
            setBusiness(businessData);
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              businessId: firebaseUser.uid,
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error('Error loading business:', error);
          setFirebaseUser(null);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setBusiness(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await auth.signOut();
    setFirebaseUser(null);
    setUser(null);
    setBusiness(null);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, user, business, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
