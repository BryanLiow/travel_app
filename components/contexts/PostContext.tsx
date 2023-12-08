"use client"
import React, { createContext, useState, useContext, useCallback } from "react";

type PostData = {
  postId: number;
  contentCardTitle: string;
  likesCount: number;
  userId: number;
  location: string | null;
  createdOn: string;
  username: string;
  imageUrl?: string | null;
  isLiked?: boolean;
};

// Define the context type
type PostContextType = {
  post: PostData | null;
  setPost: (post: PostData) => void;
};

// Create a default value for the context
const defaultPostContext: PostContextType = {
  post: null,
  setPost: () => {},
};

// Create the context
const PostContext = createContext<PostContextType>(defaultPostContext);

// Export the custom hook for using this context
const usePost = () => useContext(PostContext);

// Define the provider component
type PostProviderProps = {
  children: React.ReactNode;
};

export const PostProvider = ({ children }: PostProviderProps) => {
  const [post, setPostInternal] = useState<PostData | null>(null);

  // Define a callback for setting the post and saving it to session storage
  const setPost = useCallback((newPost: PostData) => {
    setPostInternal(newPost);
    sessionStorage.setItem("currentPost", JSON.stringify(newPost));
  }, []);

  return (
    <PostContext.Provider value={{ post, setPost }}>
      {children}
    </PostContext.Provider>
  );
};

export default usePost;
