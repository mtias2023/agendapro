import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Business, BusinessSettings, Schedule } from '../types';

export const businessService = {
  async getBusiness(businessId: string): Promise<Business | null> {
    try {
      const docSnap = await getDoc(doc(db, 'businesses', businessId));
      if (docSnap.exists()) {
        return docSnap.data() as Business;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateBusiness(businessId: string, data: Partial<Business>) {
    try {
      await updateDoc(doc(db, 'businesses', businessId), {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getBusinessSettings(businessId: string): Promise<BusinessSettings | null> {
    try {
      const docSnap = await getDoc(doc(db, 'businessSettings', businessId));
      if (docSnap.exists()) {
        return docSnap.data() as BusinessSettings;
      }
      return null;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateBusinessSettings(businessId: string, data: Partial<BusinessSettings>) {
    try {
      const settingsRef = doc(db, 'businessSettings', businessId);
      const existing = await getDoc(settingsRef);

      const defaultSchedule: Schedule[] = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        startTime: '09:00',
        endTime: i === 6 ? '14:00' : '18:00',
        isOpen: i < 6,
      }));

      const settingsData: BusinessSettings = {
        businessId,
        schedule: defaultSchedule,
        currency: 'USD',
        timezone: 'America/New_York',
        appointmentDuration: 60,
        bookingNotifications: true,
        reminderTime: 24,
        ...data,
        updatedAt: new Date(),
      };

      if (existing.exists()) {
        await updateDoc(settingsRef, settingsData);
      } else {
        await setDoc(settingsRef, settingsData);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
