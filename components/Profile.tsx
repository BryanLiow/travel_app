"use client";
import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import usePost from "./contexts/PostContext";
import { useRouter } from "next/navigation"; // Updated import path

type ContentCardProps = {
  randomHeight: string;
  postId: number;
  contentCardTitle: string;
  thumbnail: string;
  likes: number;
  user: string;
  location: string;
  createdOn: string;
};

const ContentCard = ({
  randomHeight,
  postId,
  contentCardTitle,
  thumbnail,
  likes,
  user,
  location,
  createdOn,
}: ContentCardProps) => {
  const { setPost } = usePost();
  const router = useRouter();

  const handleCardClick = () => {
    setPost({
      postId,
      contentCardTitle,
      likes,
      user,
      location,
      createdOn,
    });    router.push("/post-detail");
  };

  return (
    <a onClick={handleCardClick} className="hover:cursor-pointer">
      <Card
        className="rounded-xl border-solid border-1 border-gray-900"
        sx={{ maxWidth: 350 }}
      >
        <CardMedia
          className={
            randomHeight === "true"
              ? `card-content-media-height-${Math.floor(Math.random() * 4) + 1}`
              : "card-content-media-height-2"
          }
          component="img"
          image={thumbnail}
          alt=""
        />
        <CardContent>
          <Typography>{contentCardTitle}</Typography>
        </CardContent>
        <CardActions>
          <div className="grid grid-cols-2 w-full">
            <div>
              <FavoriteIcon />
              <span className="text-xs">{likes}</span>
            </div>
            <div className="text-xs text-right">
              <LocationOnIcon />
              <span>{location}</span>
            </div>
            <div className="text-xs text-gray-500">
              <span>@{user}</span>
            </div>
            <div className="text-xs text-gray-500 text-right">
              <span>{createdOn}</span>
            </div>
          </div>
        </CardActions>
      </Card>
    </a>
  );
};

export default ContentCard;
