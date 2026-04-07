import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Business, User } from '../types';

export const authService = {
  async registerBusiness(
    email: string,
    password: string,
    businessName: string,
    businessType: Business['type']
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const businessData: Business = {
        id: userId,
        name: businessName,
        type: businessType,
        ownerId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'businesses', userId), businessData);

      const userData: User = {
        id: userId,
        email,
        businessId: userId,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', userId), userData);

      return { user: userCredential.user, businessId: userId };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data() as User;

      return { user: userCredential.user, businessId: userData.businessId };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },
};
