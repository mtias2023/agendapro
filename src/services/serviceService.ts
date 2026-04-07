import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Service } from '../types';

export const serviceService = {
  async getServices(businessId: string): Promise<Service[]> {
    try {
      const q = query(
        collection(db, 'services'),
        where('businessId', '==', businessId),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Service[];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async createService(businessId: string, serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...serviceData,
        businessId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateService(serviceId: string, data: Partial<Service>) {
    try {
      await updateDoc(doc(db, 'services', serviceId), {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async deleteService(serviceId: string) {
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async softDeleteService(serviceId: string) {
    try {
      await updateDoc(doc(db, 'services', serviceId), {
        isActive: false,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
