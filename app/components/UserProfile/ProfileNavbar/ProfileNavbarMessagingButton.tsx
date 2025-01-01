import { usersuggestion } from "@/globalTypes/globalTypes";
import { MessagingSliceActions } from "@/store/slices/MessagingSlice/MessagingSlice";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getUserFollowers } from "../UserFollowers/functions/getUserFollowers";
import { useAppDispatch } from "@/store/reduxHooks";
import { useSession } from "next-auth/react";

const ProfileNavbarMessagingButton: React.FC<{ userID: string }> = ({
  userID,
}) => {
  const [enableMessaing, setEnableMessaging] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const session = useSession();
  const handleOpenChat = () => {
    dispatch(MessagingSliceActions.openProfileChat());
  };

  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["userFollowersMessagingStatus"],
    queryFn: () => getUserFollowers(userID),
    enabled: session.status === "authenticated",
  });

  useEffect(() => {
    if (isSuccess && data.success) {
      const user = data.followers.find((follower: usersuggestion) => {
        return follower._id === session.data?.user._id;
      });
      if (user) {
        setEnableMessaging(true);
      } else {
        setEnableMessaging(false);
      }
    }
  }, [data, isSuccess, isPending]);

  return (
    <div className="group">
      <button
        disabled={!enableMessaing}
        className={`absolute right-0 top-full sm:static px-2 text-white bg-redColor rounded-md mt-2 sm:mt-0 text-sm disabled:bg-black/30 `}
        onClick={handleOpenChat}>
        Send message
      </button>
      <p
        className={` hidden absolute text-xs w-60  top-full mt-2 right-1/2 translate-x-[50%] sm:right-16 sm:mt-0 ${
          !enableMessaing && "group-hover:block"
        }`}>
        follow to enable sending messages
      </p>
    </div>
  );
};

export default ProfileNavbarMessagingButton;