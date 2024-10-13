"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const router = useRouter();

  const session = useSession();
  console.log("its session bro ", session);
  if (session?.data?.user) {
    redirect("/");
  }

  const handleLogin = async () => {
    await signIn("google");
    router.push("/register");
  };
  // Redirect if no session (user not authenticated)
  useEffect(() => {
    if (!session) {
      router.push("/"); // Redirect to home page
    }
  }, [session]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-300">
      <div className="w-96 rounded-md bg-white p-4 text-center">
        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center rounded border-2 bg-gray-300 p-2 font-bold text-black hover:border-black"
        >
          <FcGoogle className="mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
}
