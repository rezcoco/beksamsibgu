import React from "react";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const SignUpPage = ({
  searchParams: { redirect_url, theme = "dark" },
}: {
  searchParams: { [key: string]: string };
}) => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#34d399",
          },
          baseTheme: theme === "dark" ? dark : undefined,
        }}
        fallbackRedirectUrl={redirect_url}
        signInUrl="/auth/sign-in"
      />
    </div>
  );
};

export default SignUpPage;
