import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./contentCard.css";

type ContentCardProps = {
  contentCardTitle: string;
  thumbnail: string;
  likes: number;
  user: string;
  location: string;
  createdOn: string;
};

const ContentCard = ({
  contentCardTitle,
  thumbnail,
  likes,
  user,
  location,
  createdOn,
}: ContentCardProps) => {
  return (
    <div className="content-card-containter">
      <Card className="content-card" sx={{ maxWidth: 350 }}>
        <CardMedia
          className={`card-content-media-height-${
            Math.floor(Math.random() * 4) + 1
          }`}
          component="img"
          image={thumbnail}
          alt=""
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {contentCardTitle}
          </Typography>
        </CardContent>
        <CardActions>
          <div className="content-cards-action" style={{ width: "100%" }}>
            <div>
              <FavoriteIcon />
              <span>{likes}</span>
            </div>
            <div className="content-cards-action-secondary content-cards-action-secondary-text-right">
              <LocationOnIcon />
              <span>{location}</span>
            </div>
            <div className="content-cards-action-secondary">
              <span>@{user}</span>
            </div>
            <div className="content-cards-action-secondary content-cards-action-secondary-text-right">
              <span>{createdOn}</span>
            </div>
          </div>
        </CardActions>
      </Card>
    </div>
  );
};

export default ContentCard;
