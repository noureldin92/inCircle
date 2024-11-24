import PostForm from "@/app/components/Posts/NewPost/NewPost/PostForm";
import PostImagesPreviewer from "@/app/components/Posts/NewPost/NewPost/PostImagesPreviewer";
import Post from "@/app/components/Posts/PostContainer/Post";
import React from "react";

const page = async () => {
  return (
    <div className="container mx-auto space-y-2">
      <div className="space-y-2">
        <PostForm />
        <PostImagesPreviewer />
      </div>
      <Post />
    </div>
  );
};

export default page;
