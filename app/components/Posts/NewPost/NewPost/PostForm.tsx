"use client";
import React, { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { newPost } from "../functions/newPost";
import PostTextContentInput from "./PostTextContentInput";
import DefaultValueInputs from "./DefaultValueInputs";
import PostOptionsAndSubmit from "./PostOptionsAndSubmit";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { newPostActions } from "@/store/slices/newPostSlice/slice";

const PostForm = () => {
  const [formState, formAction] = useFormState(newPost, null);
  const dispatch = useAppDispatch();
  const errorMSG = useAppSelector((state) => state.newPost.posetErrorMessage);

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    formState?.success
      ? formRef.current?.reset()
      : dispatch(newPostActions.enableErrorMsg());
  }, [dispatch, formState]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col justify-center items-center w-4/5 sm:w-3/5 md:w-2/5 mx-auto">
      <label className=" hidden font-descripFont font-extrabold dark:text-white">
        new post
      </label>
      <PostTextContentInput />
      <PostOptionsAndSubmit />
      {errorMSG && !formState?.success && (
        <p className="text-redColor text-xs">{formState?.message}</p>
      )}
      <DefaultValueInputs />
    </form>
  );
};

export default PostForm;
