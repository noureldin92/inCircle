"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getConversationsSuggetions from "./functions/getConversationsSuggetions";
import { usersuggestion } from "@/globalTypes/globalTypes";
import NewCoversationSuggetion from "./NewCoversationSuggetion";
import { FormEvent, useRef, useState } from "react";
import StartNewConversation from "../StartNewConversation/StartNewConversation";

const NewCoversationSuggetions = () => {
  const [users, setUsers] = useState<string[]>();
  const session = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const { data, isSuccess } = useQuery({
    queryKey: ["suggetions"],
    queryFn: () => getConversationsSuggetions(session.data?.user._id!),
    enabled: session.data?.user !== undefined,
  });
  const handleNewChat = (e: FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const selectedUsers = formData.getAll("usersData") as string[];
      if (selectedUsers.length !== 0 && session.data) {
        setUsers([...selectedUsers, session.data?.user._id!]);
        const time = setTimeout(() => {
          formRef.current?.reset();
          clearTimeout(time);
        }, 500);
      } else {
        console.log("empty");
      }
    }
  };
  return (
    <aside className="mt-10 w-full">
      <header>
        <h2 className="text-redColor text-center font-bold">Start New Chat</h2>
        <p className="text-black/50 text-sm text-center">Select one or more</p>
      </header>
      <form
        ref={formRef}
        onSubmit={handleNewChat}
        className="w-full flex flex-col items-center">
        {isSuccess && (
          <ul className="space-y-2 w-full">
            {data.success &&
              data.users.map((user: usersuggestion) => {
                return (
                  <li key={user._id}>
                    <NewCoversationSuggetion user={user} />
                  </li>
                );
              })}
          </ul>
        )}
        <button
          className="w-fit mx-auto mt-3 bg-black text-white dark:text-black dark:bg-offWhite px-3 py-1 font-descripFont text-sm"
          type="submit">
          Start Chat
        </button>
      </form>
      <>
        <StartNewConversation participantsIDs={users!} key={users?.length} />
      </>
    </aside>
  );
};
export default NewCoversationSuggetions;