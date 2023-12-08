"use client";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import usePost from "./contexts/PostContext";
import { IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { formatDistanceToNow } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
interface PostData {
  postId: number;
  contentCardTitle: string;
  likesCount: number;
  userId: number;
  location: string;
  createdOn: string;
  username: string;
  imageUrl?: string;
  isLiked?: boolean;
  isFollowing?: boolean;
  pathname: string;
}
interface Comment {
  id: number;
  username: string;
  userId: number;
  postId: number;
  comment: string;
  created: string;
}

const PostDetail: React.FC = () => {
  const { post } = usePost();
  const router = useRouter();
  const [localPost, setLocalPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [imagePaths, setImagePaths] = useState<string[]>([]); // State to store image paths

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    customPaging: function (i: number) {
      return (
        <a>
          <div className="dot" data-index={i}></div>
        </a>
      );
    },

    dotsClass: "slick-dots custom-dots",
  };

  const fetchPostDetails = async (postId: number) => {
    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) throw new Error("Authentication token not found");

      const { token, expiry } = JSON.parse(tokenData);
      if (!token || (expiry && Date.now() > expiry))
        throw new Error("Token is invalid or expired");

      const response = await Axios.post(
        "http://127.0.0.1:8000/api/postdetail",
        { post_id: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLocalPost((prev) => ({
        ...prev,
        ...response.data,
      }));
      setImagePaths(response.data.imagePaths); // Set the image paths from the response
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to load post details");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedPost =
      post || JSON.parse(sessionStorage.getItem("currentPost") || "{}");
    setLocalPost(savedPost);
    if (savedPost.postId) fetchPostDetails(savedPost.postId);
  }, [post]);

  const handleCommentClick = async () => {
    const tokenData = localStorage.getItem("token");

    if (!tokenData) {
      console.error("Authentication token not found");
      return;
    }

    try {
      const parsedTokenData: { token: string; expiry: number } =
        JSON.parse(tokenData);
      const { token, expiry } = parsedTokenData;

      if (!token || (expiry && Date.now() > expiry)) {
        console.error("Token is invalid or expired");
        return;
      }

      try {
        const response = await Axios.post(
          "http://127.0.0.1:8000/api/comment",
          { post_id: localPost?.postId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(response.data.comments);
        setOpenDialog(true);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }

      // Open the dialog
      setOpenDialog(true);
    } catch (error) {
      console.error("Error handling comment", error);
    }
  };

  const handlePostComment = async () => {
    const tokenData = localStorage.getItem("token");

    if (!tokenData) {
      console.error("Authentication token not found");
      return;
    }

    try {
      const parsedTokenData: { token: string; expiry: number } =
        JSON.parse(tokenData);
      const { token, expiry } = parsedTokenData;

      if (!token || (expiry && Date.now() > expiry)) {
        console.error("Token is invalid or expired");
        return;
      }
      try {
        await Axios.post(
          "http://127.0.0.1:8000/api/writecomment",
          { post_id: localPost?.postId, comment: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Optionally, fetch comments again to update the list
        handleCommentClick();
        setNewComment(""); // Clear the comment input field
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    } catch (error) {
      console.error("Error handling write comment", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleBack = () => {
    router.push(pathname);
  };

  const handleFollow = async (isCurrentlyFollowing: boolean) => {
    const tokenData = localStorage.getItem("token");

    if (!tokenData) {
      console.error("Authentication token not found");
      return;
    }

    try {
      const parsedTokenData: { token: string; expiry: number } =
        JSON.parse(tokenData);
      const { token, expiry } = parsedTokenData;

      if (!token || (expiry && Date.now() > expiry)) {
        console.error("Token is invalid or expired");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const data = { following_user_id: userId };

      if (localPost && localPost.isFollowing) {
        // User is currently following, so make a request to unfollow
        await Axios.delete("http://127.0.0.1:8000/api/unfollow", {
          headers,
          data,
        });
        setLocalPost((prevPost) =>
          prevPost ? { ...prevPost, isFollowing: false } : null
        );
      } else {
        // User is not following, so make a request to follow
        await Axios.post("http://127.0.0.1:8000/api/following", data, {
          headers,
        });
        setLocalPost((prevPost) =>
          prevPost ? { ...prevPost, isFollowing: true } : null
        );
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  const handleToggleLike = async () => {
    const tokenData = localStorage.getItem("token");

    if (!tokenData) {
      console.error("Authentication token not found");
      return;
    }

    try {
      const parsedTokenData: { token: string; expiry: number } =
        JSON.parse(tokenData);
      const { token, expiry } = parsedTokenData;

      if (!token || (expiry && Date.now() > expiry)) {
        console.error("Token is invalid or expired");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const data = { post_id: localPost?.postId };

      if (localPost?.isLiked) {
        // User has liked the post, so make a request to unlike
        await Axios.delete("http://127.0.0.1:8000/api/unlikepost", {
          headers,
          data,
        });
        setLocalPost((prevPost) =>
          prevPost
            ? { ...prevPost, isLiked: false, likes: prevPost.likesCount - 1 }
            : null
        );
      } else {
        // User hasn't liked the post, so make a request to like
        await Axios.post("http://127.0.0.1:8000/api/likepost", data, {
          headers,
        });
        setLocalPost((prevPost) =>
          prevPost
            ? { ...prevPost, isLiked: true, likes: prevPost.likesCount + 1 }
            : null
        );
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  if (isLoading) return <div className="loading-indicator"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!localPost) return <div>No post data available.</div>;

  const {
    postId,
    contentCardTitle,
    likesCount,
    userId,
    location,
    createdOn,
    username,
    imageUrl,
    isLiked,
    isFollowing,
    pathname,
  } = localPost;

  return (
    <div className="bg-gradient-to-r from-black from-30% via-green-950 via-50% to-black to-90% text-gray-800 min-h-screen py-4">
      <div className="bg-white rounded-lg max-w-lg mx-auto my-4 overflow-hidden shadow-lg">
        <div className="post-header flex items-center justify-between p-4 border-b">
          <div onClick={() => handleBack()} className="hover:cursor-pointer">
            <ArrowBackIcon />
          </div>
          {/* <Avatar
          src="/path/to/user/profile_pic.jpg"
          alt="User Profile"
          className="mr-2"
        /> */}
          <div className="avatar-placeholder ml-2 mr-3 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
            <span className="text-lg font-medium text-gray-600">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-grow">
            <h2 className="font-semibold">{contentCardTitle}</h2>
            <span className="text-sm text-gray-500">{location}</span>
          </div>
          <button
            className="btn_login !py-2 !px-5 flexCenter gap-8 rounded-full border hover:cursor-pointer"
            onClick={() => handleFollow(localPost?.isFollowing ?? false)}
          >
            {localPost?.isFollowing ? (
              <span>
                Following <DoneIcon sx={{ fontSize: 20 }} />
              </span>
            ) : (
              "Follow"
            )}
          </button>
        </div>

        {imagePaths.length > 0 &&
          (imagePaths.length === 1 ? (
            <img src={imagePaths[0]} alt="Post" className="post-image w-full" />
          ) : (
            <Slider {...sliderSettings}>
              {imagePaths.map((path, index) => (
                <div key={index}>
                  <img
                    src={path}
                    alt={`Post Image ${index}`}
                    className="post-image w-full"
                  />
                </div>
              ))}
            </Slider>
          ))}

        <div className="post-interactions flex justify-between items-center p-4 pt-9">
          <div className="left-interactions flex items-center">
            <IconButton onClick={handleToggleLike} className="like-button">
              {localPost.isLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
            <span className="likes-count text-sm">{likesCount}</span>
            <IconButton onClick={handleCommentClick} className="comment-button">
              <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </div>
          {/* <IconButton className="save-button">
          <BookmarkBorder Icon sx={{ fontSize: 20 }}  />
        </IconButton> */}
        </div>

        <div className="post-footer p-4">
          <span className="post-date text-xs text-gray-500">{createdOn}</span>
        </div>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="comment-dialog-title"
        >
          <DialogTitle id="comment-dialog-title">Comments</DialogTitle>
          <DialogContent>
            <div className="post-comments mt-4 bg-gray-100 p-4">
              <div className="new-comment mb-4 flex flex-col sm:flex-row items-center">
                {/* Profile picture placeholder */}
                <div className="profile-pic mb-3 sm:mb-0 sm:mr-3 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
                  {/* Replace with actual profile picture if available */}
                  <span className="text-lg font-medium text-gray-600">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="w-full sm:w-auto flex-grow border border-gray-300 rounded-lg p-2 text-sm text-gray-700 mb-3 sm:mb-0 sm:mr-3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="w-full sm:w-auto btn_login !py-2 !px-5 flexCenter gap-8 rounded-full border hover:cursor-pointer"
                  onClick={handlePostComment}
                >
                  Comment
                </button>
              </div>
              <h3 className="comments-title text-lg font-semibold mb-4 text-gray-900">
                Comments
              </h3>
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="comment mb-3 p-4 rounded-lg shadow-sm bg-white border-t border-gray-200"
                >
                  <div className="comment-header flex items-center mb-2">
                    <div className="avatar mr-3 w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
                      <span className="text-lg font-medium text-gray-600">
                        {comment.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="comment-body flex-grow">
                      <span className="comment-author font-medium text-sm text-gray-900">
                        {comment.username}
                      </span>
                      <span className="comment-text block text-xs text-gray-500 mt-1">
                        {comment.comment}
                      </span>
                    </div>
                  </div>
                  <div className="comment-timestamp text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PostDetail;
