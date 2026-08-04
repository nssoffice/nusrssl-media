import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Member, SavingsAccount, LoanAccount, DPSAccount, Transaction, Notice, SocietyInfo } from '../types';

export const syncFirestoreMembers = async (): Promise<Member[] | null> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'members'));
    if (querySnapshot.empty) return null;
    const items: Member[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push(docSnap.data() as Member);
    });
    return items;
  } catch (err) {
    console.warn('Firestore fetch members offline/fallback:', err);
    return null;
  }
};

export const saveFirestoreMember = async (member: Member) => {
  try {
    await setDoc(doc(db, 'members', member.id), member);
  } catch (err) {
    console.warn('Firestore save member error:', err);
  }
};

export const deleteFirestoreMember = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (err) {
    console.warn('Firestore delete member error:', err);
  }
};

export const saveFirestoreSavings = async (savings: SavingsAccount) => {
  try {
    await setDoc(doc(db, 'savings', savings.accountNo), savings);
  } catch (err) {
    console.warn('Firestore save savings error:', err);
  }
};

export const saveFirestoreLoan = async (loan: LoanAccount) => {
  try {
    await setDoc(doc(db, 'loans', loan.loanNo), loan);
  } catch (err) {
    console.warn('Firestore save loan error:', err);
  }
};

export const saveFirestoreDPS = async (dps: DPSAccount) => {
  try {
    await setDoc(doc(db, 'dps', dps.dpsNo), dps);
  } catch (err) {
    console.warn('Firestore save dps error:', err);
  }
};

export const saveFirestoreTransaction = async (txn: Transaction) => {
  try {
    await setDoc(doc(db, 'transactions', txn.id), txn);
  } catch (err) {
    console.warn('Firestore save transaction error:', err);
  }
};

export const saveFirestoreNotice = async (notice: Notice) => {
  try {
    await setDoc(doc(db, 'notices', notice.id), notice);
  } catch (err) {
    console.warn('Firestore save notice error:', err);
  }
};

export const saveFirestoreSocietyInfo = async (info: SocietyInfo) => {
  try {
    await setDoc(doc(db, 'society_info', 'main'), info);
  } catch (err) {
    console.warn('Firestore save society info error:', err);
  }
};
