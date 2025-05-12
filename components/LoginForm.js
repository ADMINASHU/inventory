"use client";
import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { doLogin, doGoogleSignIn } from "@/app/action";
import SignIn from "./SignIn";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await doLogin({ email, password });
    // console.log("from login form ####################"+JSON.stringify(response));
    if (!response.success) {
      Swal.fire({
        title: "Error!",
        text: response.error,
        icon: "error",
        confirmButtonText: "OK",
      });
    } //else {
    //   Swal.fire({
    //     title: "Success!",
    //     text: response.message,
    //     icon: "success",
    //     confirmButtonText: "OK",
    //   }).then(() => {
    //     router.push("/");
    //   });
    // }
  }


  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <Image
          src="/logo.jpg"
          alt="Company logo"
          // loading="eager" // {lazy} | {eager}
          priority
          width={180}
          height={101}
          className={styles.logo}
        />
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>

        <SignIn />

        <p>
          <Link href="/forgot-password" className={styles.forgotPasswordLink}>
            Forgot Password?
          </Link>
        </p>
        <p>
          Don&apos;t have an account?
          <Link href="/register" className={styles.signupLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
