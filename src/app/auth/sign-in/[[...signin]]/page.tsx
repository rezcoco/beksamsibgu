"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import React from "react";

const SignInPage = () => {
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#34d399",
          },
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
        fallbackRedirectUrl={redirectUrl}
        signUpUrl="/auth/sign-up"
      />
    </div>
  );
};

export default SignInPage;
