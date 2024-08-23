"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import React from "react";

const SignUpPage = () => {
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#34d399",
          },
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
        fallbackRedirectUrl={redirectUrl}
        signInUrl="/auth/sign-in"
      />
    </div>
  );
};

export default SignUpPage;
