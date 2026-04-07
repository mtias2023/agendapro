import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Client } from '../types';

export const clientService = {
  async getClients(businessId: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, 'clients'),
        where('businessId', '==', businessId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Client[];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async createClient(
    businessId: string,
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'totalAppointments'>
  ) {
    try {
      const docRef = await addDoc(collection(db, 'clients'), {
        ...clientData,
        businessId,
        totalAppointments: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateClient(clientId: string, data: Partial<Client>) {
    try {
      await updateDoc(doc(db, 'clients', clientId), {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async deleteClient(clientId: string) {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
