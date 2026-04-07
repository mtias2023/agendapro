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
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Appointment } from '../types';

export const appointmentService = {
  async getAppointments(
    businessId: string,
    filters?: {
      clientId?: string;
      serviceId?: string;
      status?: Appointment['status'];
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Appointment[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('businessId', '==', businessId),
        orderBy('startTime', 'asc'),
      ];

      if (filters?.clientId) {
        constraints.push(where('clientId', '==', filters.clientId));
      }
      if (filters?.serviceId) {
        constraints.push(where('serviceId', '==', filters.serviceId));
      }
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      const q = query(collection(db, 'appointments'), ...constraints);
      const querySnapshot = await getDocs(q);

      let appointments = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startTime: data.startTime?.toDate?.() || new Date(data.startTime),
          endTime: data.endTime?.toDate?.() || new Date(data.endTime),
        };
      }) as Appointment[];

      if (filters?.startDate || filters?.endDate) {
        appointments = appointments.filter((apt) => {
          if (filters.startDate && apt.startTime < filters.startDate) return false;
          if (filters.endDate && apt.startTime > filters.endDate) return false;
          return true;
        });
      }

      return appointments;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async createAppointment(
    businessId: string,
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'reminderSent'>
  ) {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        businessId,
        reminderSent: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async updateAppointment(appointmentId: string, data: Partial<Appointment>) {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async deleteAppointment(appointmentId: string) {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async cancelAppointment(appointmentId: string) {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'cancelled',
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
