"use client";
import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import usePost from "./contexts/PostContext";
import { useRouter } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Axios from "axios";

type ContentCardProps = {
  randomHeight: string;
  postId: number;
  contentCardTitle: string;
  thumbnail: string | null;
  likesCount: number;
  userId: number;
  location: string | null;
  username: string;
  createdOn: string;
  isLiked: boolean;
  pathname: string;
};

const ContentCard = ({
  randomHeight,
  postId,
  contentCardTitle,
  thumbnail,
  likesCount,
  userId,
  location,
  username,
  createdOn,
  isLiked,
  pathname,
}: ContentCardProps) => {
  const { setPost } = usePost();
  const router = useRouter();
  const handleCardClick = () => {
    setPost({
      postId,
      contentCardTitle,
      likesCount,
      userId,
      location,
      createdOn,
      username,
      imageUrl: thumbnail,
      pathname,
    });
    router.push("/post-detail");
  };

  const handleUserProfile = () => {
    const userProfileUrl = `/profile?userId=${userId}`;
    router.push(userProfileUrl);
  };
  

  return (
    <a className="hover:cursor-pointer">
      <Card
        className="rounded-xl border-solid border-2 border-gray-100"
        sx={{ maxWidth: 350, borderRadius: "16px" }}
      >
        {randomHeight == "true" && (
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" onClick={handleUserProfile}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
            }
            titleTypographyProps={{ fontWeight: "bold" }}
            title={<span onClick={handleUserProfile}>{username}</span>}
            // ... other props ...
          />
        )}

        <CardMedia
          className={
            randomHeight === "true"
              ? `card-content-media-height-${Math.floor(Math.random() * 4) + 1}`
              : "card-content-media-height-2"
          }
          component="img"
          image={thumbnail || ""}
          alt="post"
          onClick={handleCardClick}
        />
        <CardContent>
          <Typography sx={{ fontWeight: "bold" }}>
            {contentCardTitle}
          </Typography>
        </CardContent>
        <CardActions>
          <div className="flex flex-col w-full">
            <div className="grid grid-cols-2">
              <div className="text-xs">
                {isLiked ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                )}
                <span className="text-xs text-gray-500">{likesCount}</span>
              </div>
              <div className="text-xs text-right pt-1">
                <span>{createdOn}</span>
              </div>
            </div>
            <div className="text-xs text-gray-300">
              <span>{location}</span>
            </div>
          </div>
        </CardActions>
      </Card>
    </a>
  );
};

export default ContentCard;
