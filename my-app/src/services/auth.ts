import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// REGISTER
export const registerUser = async (email, password, name) => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    console.log("AUTH OK:", userCred.user.uid);

    await setDoc(doc(db, "users", userCred.user.uid), {
      uid: userCred.user.uid,
      email,
      name,
      role: "team",
      createdAt: new Date()
    });

    console.log("FIRESTORE OK");

    return userCred.user;

  } catch (authError: any) {
    console.error("AUTH ERROR:", authError.code);

    if (authError.code === "auth/email-already-in-use") {
      throw new Error("Цей email вже зареєстрований");
    }

    if (authError.code === "auth/invalid-email") {
      throw new Error("Невірний email");
    }

    if (authError.code === "auth/weak-password") {
      throw new Error("Пароль занадто слабкий");
    }

    throw authError;
  }
};

// LOGIN ⭐ ДОБАВИЛИ ЦЕ
export const loginUser = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};