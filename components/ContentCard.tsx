"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import usePost from "./contexts/PostContext";
import { useRouter } from "next/navigation";

type ContentCardProps = {
  randomHeight: string;
  postId: number;
  contentCardTitle: string;
  thumbnail: string;
  likes: number;
  userId: number;
  location: string;
  username: string;
  createdOn: string;
};

const ContentCard = ({
  randomHeight,
  postId,
  contentCardTitle,
  thumbnail,
  likes,
  userId,
  location,
  username,
  createdOn,
}: ContentCardProps) => {
  const { setPost } = usePost();
  const router = useRouter();

  const handleCardClick = () => {
    setPost({
      postId,
      contentCardTitle,
      likes,
      userId,
      location,
      createdOn,
      username,
      imageUrl: thumbnail,
    });
    router.push("/post-detail");
  };

  return (
    <a onClick={handleCardClick} className="hover:cursor-pointer">
      <Card
        className="rounded-xl border-solid border-2 border-gray-100"
        sx={{ maxWidth: 350 }}
      >
        {randomHeight == "true" && (
          <CardHeader
            avatar={
              <Avatar aria-label="recipe">
                {username.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={username}
            subheader={
              <div className="text-xs text-gray-300">
                <span>{location}</span>
              </div>
            }
          />
        )}

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
            <div className="text-xs">
              <FavoriteBorderIcon />
              <span className="text-xs">{likes}</span>
            </div>
            <div className="text-xs text-right pt-1">
              <span>{createdOn}</span>
            </div>
          </div>
        </CardActions>
      </Card>
    </a>
  );
};

export default ContentCard;
