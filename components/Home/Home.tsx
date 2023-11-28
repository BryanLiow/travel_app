import { HOME_CONTENT_CARD } from "@/constants";
import ContentCard from "../ContentCard/ContentCard";
import "./home.css";

type ButtonProps = {
  type: "button" | "submit";
  title: string;
  icon?: string;
  variant: "btn_dark_green";
};

const Home = () => {
  return (
    <>
      <div className="flexCenter">
        <div className="home-container">
          {HOME_CONTENT_CARD.map((contentCard, index) => (
            <div className="content-card-container">
              <ContentCard
                key={index}
                contentCardTitle={contentCard.contentCardTitle}
                thumbnail={contentCard.thumbnail}
                likes={contentCard.likes}
                user={contentCard.user}
                location={contentCard.location}
                createdOn={contentCard.createdOn}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};


export default Home;
