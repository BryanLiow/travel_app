"use client"
import React, { createContext, useState, useContext } from "react";

type PostData = {
  postId: number; 
  contentCardTitle: string;
  likes: number;
  user: string;
  location: string;
  createdOn: string;
  imageUrl?: string; // imageUrl is now optional
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
  const [post, setPost] = useState<PostData | null>(null);

  return (
    <PostContext.Provider value={{ post, setPost }}>
      {children}
    </PostContext.Provider>
  );
};

export default usePost;
