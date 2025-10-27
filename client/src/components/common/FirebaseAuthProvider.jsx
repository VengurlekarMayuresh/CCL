import { useEffect } from "react";
import { onAuthStateChanged, auth, signInWithPopup, provider, signOut } from "@/lib/firebase";

export function FirebaseAuthProvider({ children }) {
  useEffect(() => {
    // Keep Firebase session alive; actual app user is set after server login
    const unsub = onAuthStateChanged(auth, async () => {});
    return () => unsub();
  }, []);
  return children;
}

export const firebaseAuthUI = {
  signInWithGoogle: () => signInWithPopup(auth, provider),
  signOut: () => signOut(auth),
};
