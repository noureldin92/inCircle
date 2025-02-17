"use client";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { MessagingSliceActions } from "@/store/slices/MessagingSlice/MessagingSlice";
import { useSession } from "next-auth/react";
import getConversationsUsersData from "./functions/getConversationsUsersData";
import { useEffect, useState } from "react";
import checkConversationExist from "./functions/checkConversationExist";
import { nanoid } from "nanoid";
import MessagingModal from "../MessagingModal/MessagingModal";
import { AnimatePresence } from "framer-motion";
const StartNewConversation: React.FC<{
  participantsIDs: string[];
}> = ({ participantsIDs }) => {
  const [conversationID, setConversationID] = useState<string>();
  const dispatch = useAppDispatch();
  const session = useSession();
  const chatState = useAppSelector((state) => state.MessagingSlice.chatState);
  useEffect(() => {
    const conversationExist = async () => {
      const result = await checkConversationExist(participantsIDs);
      if (result.success) {
        setConversationID(result.conversationID._id);
      }
      if (!result.success) {
        const newConversationID = nanoid(5);
        setConversationID(newConversationID);
      }
    };
    participantsIDs && conversationExist();
  }, [participantsIDs]);
  useEffect(() => {
    const handleStartNewConversation = async () => {
      if (conversationID) {
        const usersData = await getConversationsUsersData(
          participantsIDs,
          session.data?.user._id!
        );
        dispatch(MessagingSliceActions.setConversationId(conversationID));
        dispatch(MessagingSliceActions.setRecipientIDs(participantsIDs));
        dispatch(MessagingSliceActions.setParticipantsData(usersData));
        dispatch(MessagingSliceActions.openChat());
        setConversationID("");
      }
    };
    handleStartNewConversation();
  }, [conversationID]);
  return <MessagingModal />;
};
export default StartNewConversation;
