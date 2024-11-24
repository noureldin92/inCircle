"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import FormContainer from "../FormContainer";
import GoogleSigninButton from "./GoogleSigninButton";
import LoginInput from "./LoginInput";
import LoginSubmitButton from "./LoginSubmitButton";
import { handleSignIn } from "../functions/login";
import { useRouter } from "next/navigation";
const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>();
  const [loading, seIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const passwordlHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const formHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    seIsLoading(true);
    const response = await handleSignIn(email!, password!);
    seIsLoading(false);
    if (!response?.success) {
      setError(response?.error);
    } else {
      router.push("/");
    }
  };
  const session = useSession();
  const tInputs = useTranslations("auth");
  const tPlaceholders = useTranslations("authPlaceholders");
  const t_inputs = useTranslations("auth");

  return (
    <FormContainer>
      {!session.data ? (
        <form
          onSubmit={formHandler}
          className="flex flex-col w-1/2 mx-auto py-8 gap-y-4">
          <label className="text-6xl md:text-7xl text-center font-bold font-headerFont mb-4 text-redColor ">
            {t_inputs("formHeaderSignIn")}
          </label>
          <LoginInput
            type="email"
            onChange={emailHandler}
            placeholder={tPlaceholders("emailPlaceholder")}>
            {tInputs("emailInput")}
          </LoginInput>
          <LoginInput
            type="password"
            onChange={passwordlHandler}
            placeholder={tPlaceholders("passwordPlaceholder")}>
            {tInputs("passwordInput")}
          </LoginInput>
          <div className="h-1 -mt-3">
            <p className="text-xs">{error}</p>
          </div>
          <section className="space-y-3 mt-2">
            <LoginSubmitButton loading={loading} />
            <GoogleSigninButton />
          </section>
        </form>
      ) : (
        <></>
      )}
    </FormContainer>
  );
};

export default LoginForm;
