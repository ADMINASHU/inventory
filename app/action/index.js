"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaClient";
import { SignInSchema, RegisterSchema } from "@/lib/zod";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";


export async function doLogout() {
  await signOut({ redirect: true, redirectTo: "/login" });
}

export async function doLogin({ email, password }) {
  try {
    const result = SignInSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    await signIn("credentials", {
      ...result.data,
      // redirect: true,
      redirectTo:"/",
    });

    // return { success: true, message: "Signin successful" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export const signUp = async ({ data }) => {
  const result = RegisterSchema.safeParse({
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    const { email, password } = result.data;

    const existingUserEmail = await prisma.users.findUnique({ where: { email } });
    if ( existingUserEmail) {
      return { error: "User already exists" };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await prisma.users.create({
      data: {
    
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    });

    return { message: "User registered successfully" };
  } catch (error) {
    return { error: error.message };
  }
  
};

export async function doGoogleSignIn() {
  try {
    await signIn("google", {
      redirectTo: "/",
    });
  } catch (error) {
    return { error: error.message };
  }
}