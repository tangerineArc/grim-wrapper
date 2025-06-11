"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm">Hello, {session.user?.name}</span>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => signIn("github")}
        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
      >
        Sign in with Google
      </button>
    </div>
  );
}
