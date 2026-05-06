import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// =====================
// REGISTER
// =====================
export const registerUser = async (email, password, name) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    uid: userCred.user.uid,
    email,
    name,
    role: "team",
    createdAt: new Date()
  });

  return userCred.user;
};

// =====================
// LOGIN (ВАЖЛИВО — З РОЛЛЮ)
// =====================
export const loginUser = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);

  const userSnap = await getDoc(doc(db, "users", userCred.user.uid));

  if (!userSnap.exists()) {
    throw new Error("User not found in Firestore");
  }

  return {
    ...userCred.user,
    role: userSnap.data().role
  };
};

// =====================
// LOGOUT
// =====================
export const logoutUser = async () => {
  await signOut(auth);
};