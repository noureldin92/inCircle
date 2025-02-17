"use server";
import { z } from "zod";
import { calculateAge } from "./countAge";
import bcrypt from "bcryptjs";
import { user } from "@/globalTypes/globalTypes";
import { nanoid } from "nanoid";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const signupSchema = z
  .object({
    username: z.string().min(3, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 character(s)"),
    repeatedPassword: z.string().min(8),
    age: z
      .number()
      .min(18, "You must be at least 18")
      .max(90, "using our web services is not recommended for you"),
    imgPath: z.string().optional(),
  })
  .refine((data) => data.password === data.repeatedPassword, {
    message: "Passwords must match",
    path: ["repeatedPassword"],
  });

export const signup = async (_prvState: any, formData: FormData) => {
  const enteredDate = formData.get("age")?.toString();
  const age = calculateAge(enteredDate!);
  const userData = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    repeatedPassword: formData.get("repeatedPassword") as string,
    age: (age as number) || 17,
    imgPath: formData.get("imgPath") as string,
    gender: formData.get("gender") as string,
    status: formData.get("status") as string,
  };
  try {
    const validationResult = signupSchema.safeParse(userData);
    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.errors,
      };
    }
    const microID = nanoid(6);
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const newUser: user = {
      _id: microID,
      username: userData.username,
      email: userData.email,
      passwordHash: hashedPassword,
      profile: {
        bio: "",
        avatar:
          userData.imgPath ||
          "https://firebasestorage.googleapis.com/v0/b/incircle-f2a58.appspot.com/o/defaultProfileImage.png?alt=media&token=ca08e50d-ac0e-4d49-99a3-c0b61e5c0404",
      },
      following: [],
      followers: [],
      createdAt: new Date(),
      age: userData.age || 18,
      verified: false,
      status: userData.status,
      gender: userData.gender,
    };
    const response = await fetch(`${apiURL}/users/signup`, {
      method: "post",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responsed = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: responsed?.message,
      };
    }
    return {
      success: true,
      data: responsed,
    };
  } catch (error) {
    return {
      success: false,
      message: "network error, check your connection",
    };
  }
};
