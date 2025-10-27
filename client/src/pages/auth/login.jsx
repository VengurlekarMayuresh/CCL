import CommonForm from "@/components/common/form";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { loginUser, setUser } from "@/store/auth-slice";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import { firebaseAuthUI } from "@/components/common/FirebaseAuthProvider";
import { Button } from "@/components/ui/button";

export default function AuthLogin() {
  const initialState = {
    email: "",
    password: "",
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onGoogleSignIn() {
    try {
      await firebaseAuthUI.signInWithGoogle();
      // tell server to create Mongo user + set JWT cookie
      const resp = await (await import("@/lib/api")).default.post("/api/auth/firebase/login");
      if (resp?.data?.success) {
        // Save Mongo user in Redux so user.id is a Mongo ObjectId for cart/orders
        const user = resp.data.user;
        dispatch(setUser(user));
        toast.success("Signed in with Google");
        navigate("/shop/home");
      } else {
        toast.error(resp?.data?.message || "Server login failed");
      }
    } catch (e) {
      toast.error(e?.message || "Google sign-in failed");
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/shop/home");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }
  const [formData, setFormData] = useState(initialState);
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground ">
          Sign in to your Account
        </h1>
        <p>Don't have an account</p>
        <Link
          className="font-medium  text-primary hover:underline"
          to="/auth/register"
        >
          Register
        </Link>
      </div>
      <div className="space-y-4">
        <CommonForm
          formControls={loginFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText="Sign In"
          onSubmit={onSubmit}
        />
        <div className="flex items-center gap-2">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={onGoogleSignIn}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
