import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Notification } from '../types';

export const notificationService = {
  async createNotification(
    businessId: string,
    appointmentId: string,
    clientId: string,
    type: Notification['type'],
    method: Notification['method']
  ) {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        businessId,
        appointmentId,
        clientId,
        type,
        method,
        sent: false,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async getNotifications(
    businessId: string,
    filters?: {
      appointmentId?: string;
      clientId?: string;
      sent?: boolean;
      type?: Notification['type'];
    }
  ): Promise<Notification[]> {
    try {
      let q = query(
        collection(db, 'notifications'),
        where('businessId', '==', businessId)
      );

      if (filters?.appointmentId) {
        q = query(q, where('appointmentId', '==', filters.appointmentId));
      }

      if (filters?.clientId) {
        q = query(q, where('clientId', '==', filters.clientId));
      }

      const querySnapshot = await getDocs(q);

      let notifications = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Notification[];

      if (filters?.sent !== undefined) {
        notifications = notifications.filter((n) => n.sent === filters.sent);
      }

      if (filters?.type) {
        notifications = notifications.filter((n) => n.type === filters.type);
      }

      return notifications;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async markAsSent(notificationId: string) {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        sent: true,
        sentAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async sendReminderNotifications(businessId: string) {
    try {
      const notifications = await this.getNotifications(businessId, {
        type: 'reminder',
        sent: false,
      });

      let sent = 0;

      for (const notification of notifications) {
        await this.markAsSent(notification.id);
        sent++;
      }

      return { sent, total: notifications.length };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};