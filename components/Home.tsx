import { HOME_CONTENT_CARD } from "@/constants";
import ContentCard from "./ContentCard";

const Home = () => {
  return (
    <>
      <div className="flex">
        <div className="home-container">
          {HOME_CONTENT_CARD.map((contentCard, index) => (
            <div className="content-card-container">
              <ContentCard
                key={index}
                randomHeight = "true"
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
