import React from "react";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const SignInPage = ({
  searchParams: { redirect_url, theme = "dark" },
}: {
  searchParams: { [key: string]: string };
}) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#34d399",
          },
          baseTheme: theme === "dark" ? dark : undefined,
        }}
        fallbackRedirectUrl={redirect_url}
        signUpUrl="/auth/sign-up"
      />
    </div>
  );
};

export default SignInPage;
