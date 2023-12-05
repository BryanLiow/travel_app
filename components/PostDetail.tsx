"use client";
import React, { useState, useEffect } from "react";
import usePost from "./contexts/PostContext";
import { Button, IconButton, Avatar } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { format } from "date-fns";

interface PostData {
  postId: number;
  contentCardTitle: string;
  likes: number;
  location: string;
  createdOn: string;
  imageUrl?: string;
  isLiked?: boolean;
}

interface Comment {
  id: number;
  user: string;
  text: string;
  likes: number;
  timestamp: string;
}

// Example mock comments
const mockComments: Comment[] = [
  {
    id: 1,
    user: "user1",
    likes: 100,
    text: "Great post!",
    timestamp: "2023-03-01T12:00:00",
  },
  {
    id: 2,
    user: "user2",
    likes: 200,
    text: "Really enjoyed this.",
    timestamp: "2023-03-01T13:00:00",
  },
  // ... more comments
];

const PostDetail: React.FC = () => {
  const { post } = usePost();
  const [localPost, setLocalPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check if post data is available in PostContext
      if (post) {
        setLocalPost(post);
        sessionStorage.setItem("currentPost", JSON.stringify(post));
      } else {
        // Attempt to retrieve data from sessionStorage
        const savedPost = sessionStorage.getItem("currentPost");
        if (savedPost) {
          setLocalPost(JSON.parse(savedPost));
        }
      }
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load post data");
      setIsLoading(false);
    }
  }, [post]);
  

  if (isLoading) {
    return (
      <div className="loading-indicator">{/* <CircularProgress /> */}</div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!localPost) {
    return <div>No post data available.</div>;
  }

  const {
    postId,
    contentCardTitle,
    likes,
    location,
    createdOn,
    imageUrl,
    isLiked,
  } = localPost;

  const toggleLike = () => {
    // Handle the like toggle functionality
    // This could be expanded to update likes count and persist the state
  };

  return (
    <div className="post-detail bg-white rounded-lg max-w-lg mx-auto my-4 overflow-hidden shadow-lg">
      <div className="post-header flex items-center justify-between p-4 border-b">
        <Avatar
          src="/path/to/user/profile_pic.jpg"
          alt="User Profile"
          className="mr-2"
        />
        <div className="flex-grow">
          <h2 className="font-semibold">{contentCardTitle}</h2>
          <span className="text-sm text-gray-500">{location}</span>
        </div>
        <button className="btn_login !py-2 !px-5 flexCenter gap-8 rounded-full border hover:cursor-pointer">
          Follow
        </button>
      </div>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Post by ${contentCardTitle}`}
          className="post-image w-full rounded-t-lg"
        />
      )}

      <div className="post-interactions flex justify-between items-center p-4">
        <div className="left-interactions flex items-center">
          <IconButton onClick={toggleLike} className="like-button">
            {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
          <span className="likes-count text-sm">{likes}</span>
        </div>
        <IconButton className="save-button">
          <BookmarkBorderIcon />
        </IconButton>
      </div>

      <div className="post-footer p-4">
        <span className="post-date text-xs text-gray-500">{createdOn}</span>
      </div>

      <div className="post-comments mt-4 bg-gray-100 p-4">
        <div className="new-comment mb-4 flex items-center">
          {/* Profile picture placeholder */}
          <div className="profile-pic mr-3 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
            {/* Replace with actual profile picture if available */}
            <span className="text-lg font-medium text-gray-600">A</span>
          </div>
          {/* Input field for new comment */}
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-grow border border-gray-300 rounded-lg p-2 text-sm text-gray-700 mr-3"
          />
          {/* Post button */}
          <button className="btn_login !py-2 !px-5 flexCenter gap-8 rounded-full border hover:cursor-pointer">
            Post
          </button>
        </div>
        <h3 className="comments-title text-lg font-semibold mb-4 text-gray-900">
          Comments
        </h3>
        {mockComments.map((comment) => (
          <div
            key={comment.id}
            className="comment mb-3 p-4 rounded-lg shadow-sm bg-white border-t border-gray-200"
          >
            <div className="comment-header flex items-center mb-2">
              {/* Placeholder for user's profile picture */}
              <div className="avatar-placeholder mr-3 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
                <span className="text-lg font-medium text-gray-600">
                  {comment.user[0].toUpperCase()}
                </span>
              </div>
              <div className="comment-body flex-grow">
                <span className="comment-author font-medium text-gray-900">
                  {comment.user}
                </span>
                <span className="comment-text block text-sm text-gray-700 mt-1">
                  {comment.text}
                </span>
              </div>
              <div className="comment-footer flex items-center">
                {/* Placeholder for like icon */}
                <div className="like-icon-placeholder w-6 h-6 bg-gray-300 rounded-full flex justify-center items-center mr-2">
                  <span className="text-base text-gray-600">♡</span>
                </div>
                <span className="comment-likes text-sm text-gray-600">
                  {comment.likes || "0"} likes
                </span>
              </div>
            </div>
            <div className="comment-timestamp text-xs text-gray-500">
              {format(new Date(comment.timestamp), "PPPp")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;
