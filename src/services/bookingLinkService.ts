import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { PublicBookingLink } from '../types';
import { v4 as uuidv4 } from 'crypto';

const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const bookingLinkService = {
  async getOrCreateLink(businessId: string): Promise<PublicBookingLink> {
    try {
      const q = query(collection(db, 'bookingLinks'), where('businessId', '==', businessId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { ...doc.data(), id: doc.id } as PublicBookingLink;
      }

      const token = generateToken();
      const linkData: PublicBookingLink = {
        id: token,
        businessId,
        token,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'bookingLinks', token), linkData);
      return linkData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getLinkByToken(token: string): Promise<PublicBookingLink | null> {
    try {
      const docSnap = await getDoc(doc(db, 'bookingLinks', token));
      if (docSnap.exists()) {
        return docSnap.data() as PublicBookingLink;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async toggleLink(token: string, isActive: boolean) {
    try {
      await updateDoc(doc(db, 'bookingLinks', token), {
        isActive,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
