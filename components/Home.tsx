"use client";
import React, { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import ContentCard from "./ContentCard";
import { formatDistanceToNow } from "date-fns";
import { usePathname } from "next/navigation";

interface Post {
  id: number;
  user_id: number;
  title: string;
  caption: string;
  likesCount: number;
  country: string | null;
  created_at: string;
  image: string | null;
  username: string;
  createdOn: string;
  isLiked: boolean;
}

// Define a common interface for Axios configuration
interface AxiosConfig {
  headers?: { Authorization: string };
  params?: { exclude: number[] };
}

const Home = () => {
  const [contentCards, setContentCards] = useState<Post[]>([]);
  const [loadedPostIds, setLoadedPostIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const pathname = usePathname();

  const fetchPosts = async () => {
    if (isLoading || allDataLoaded) return;

    setIsLoading(true);
    const tokenData = localStorage.getItem("token");
    let url = "https://bryanliow2.com/api/homepostswithouttoken";
    let axiosConfig: AxiosConfig = { params: { exclude: loadedPostIds } };

    if (tokenData) {
      let parsedTokenData;
      try {
        parsedTokenData = JSON.parse(tokenData);
      } catch (error) {
        console.error("Error parsing token data:", error);
        return;
      }

      const { token, expiry } = parsedTokenData;
      if (expiry && Date.now() > expiry) {
        console.error("Token expired");
        // Redirect to login or refresh token
        return;
      }

      url = "https://bryanliow2.com/api/homeposts";
      axiosConfig.headers = { Authorization: `Bearer ${token}` };
    }

    try {
      const response = await Axios.post(url, {}, axiosConfig);
      const newPosts = response.data.map((post: Post) => ({
        ...post,
        createdOn: formatDistanceToNow(new Date(post.created_at), {
          addSuffix: true,
        }),
      }));
      if (newPosts.length === 0) {
        setAllDataLoaded(true);
      } else {
        setContentCards((prevCards) => [...prevCards, ...newPosts]);
        setLoadedPostIds((prevIds) => [
          ...prevIds,
          ...newPosts.map((post: Post) => post.id),
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
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="bg-gradient-to-r from-black from-30% via-green-950 via-50% to-black to-90% text-gray-800 min-h-screen">
      <div className="my-4 p-3">
        <div className="bg-opacity-0 rounded-t-lg">
          <div className="flex">
            <div className="home-container">
              {contentCards.map((contentCard, index) => (
                <div className="content-card-container" key={index}>
                  <ContentCard
                    randomHeight="true"
                    postId={contentCard.id}
                    contentCardTitle={contentCard.title}
                    thumbnail={contentCard.image}
                    likesCount={contentCard.likesCount}
                    userId={contentCard.user_id}
                    location={contentCard.country}
                    username={contentCard.username}
                    createdOn={contentCard.createdOn}
                    isLiked={contentCard.isLiked}
                    pathname={pathname}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
