"use client";
import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import ContentCard from "./ContentCard";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: number;
  user_id: number;
  title: string;
  caption: string;
  likes: number;
  country: string | null;
  created_at: string;
  image: string | null;
  username: string;
  createdOn: string;
}

const Home = () => {
  const [contentCards, setContentCards] = useState<any[]>([]);
  const [loadedPostIds, setLoadedPostIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const fetchPosts = async () => {
    if (isLoading || allDataLoaded) return;
    setIsLoading(true);

    try {
      const response = await Axios.get("http://127.0.0.1:8000/api/homeposts", {
        params: { exclude: loadedPostIds },
      });
      const newPosts = response.data.map((post: Post) => ({
        ...post,
        createdOn: formatDistanceToNow(new Date(post.createdOn), {
          addSuffix: true,
        }),
      }));
      if (newPosts.length === 0) {
        setAllDataLoaded(true);
      } else {
        setContentCards((prevCards) => [...prevCards, ...newPosts]);
        setLoadedPostIds((prevIds) => [
          ...prevIds,
          ...newPosts.map((post: any) => post.id),
        ]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop <
        document.documentElement.offsetHeight - 100 ||
      isLoading ||
      allDataLoaded
    )
      return;

    fetchPosts();
  }, [isLoading, allDataLoaded]);

  useEffect(() => {
    fetchPosts();

    const debouncedHandleScroll = debounce(handleScroll, 100);
    window.addEventListener("scroll", debouncedHandleScroll);

    return () => window.removeEventListener("scroll", debouncedHandleScroll);
  }, [handleScroll]);

  const debounce = (
    func: (...args: any[]) => void,
    delay: number
  ): (() => void) => {
    let timer: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
  return (
    <div className="bg-black text-gray-800 min-h-screen">
      <div className="my-4 p-3">
        <div className="bg-white rounded-t-lg">
          <div className="flex">
            <div className="home-container">
              {contentCards.map((contentCard, index) => (
                <div className="content-card-container" key={index}>
                  <ContentCard
                    randomHeight="true"
                    postId={contentCard.id}
                    contentCardTitle={contentCard.title}
                    thumbnail={contentCard.image}
                    likes={contentCard.likes}
                    userId={contentCard.user_id}
                    location={contentCard.country}
                    username={contentCard.username}
                    createdOn={contentCard.createdOn}
                  />
                </div>
              ))}
              {isLoading && <p>Loading more posts...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
