import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const handleLikePost = async (currentUserId: string, postId: string) => {
  const notifID = nanoid(4);
  const response = await fetch(`${apiURL}/post/postInteract`, {
    method: "post",
    body: JSON.stringify({ currentUserId, postId, notifID }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  if (!response.ok) {
    return result;
  }
  return result;
};
