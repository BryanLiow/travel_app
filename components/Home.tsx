import { HOME_CONTENT_CARD } from "@/constants";
import ContentCard from "./ContentCard";

const Home = () => {
  return (
    <>
      <div className="bg-black text-gray-800 min-h-screen">
        <div className="my-4 p-3">
          <div className="bg-white rounded-t-lg">
            <div className="flex">
              <div className="home-container">
                {HOME_CONTENT_CARD.map((contentCard, index) => (
                  <div className="content-card-container">
                    <ContentCard
                      key={index}
                      randomHeight="true"
                      postId={contentCard.postId}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
