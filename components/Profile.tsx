"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Card from "@mui/material/Card";
import ContentCard from "./ContentCard";
import LanguageIcon from "@mui/icons-material/Language";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import GridOnIcon from "@mui/icons-material/GridOn";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import Axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface UserData {
  id: number;
  name: string;
  email: string;
  username: string;
  headline: string;
  gender: string;
  country: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const [activeTab, setActiveTab] = useState("work");
  const [linePosition, setLinePosition] = useState({ left: 0, width: 0 });
  const [userData, setUserData] = useState<UserData | null>(null);
  const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const tabs = {
    work: <GridOnIcon sx={{ fontSize: 20 }} />,
    // other tabs...
  };

  const loadProfile = async (userId?: string) => {
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      console.error("Authentication token not found");
      return;
    }

    const parsedTokenData = JSON.parse(tokenData);
    const { token, expiry } = parsedTokenData;
    if (!token || (expiry && Date.now() > expiry)) {
      console.error("Token is invalid or expired");
      return;
    }

    try {
      if (userId) {
        // Use POST for /userProfile API
        const response = await Axios.post(
          "https://bryanliow2.com/api/userprofile",
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(response.data.user); // Accessing user object from response
      } else {
        // Use GET for /user API
        const response = await Axios.get("https://bryanliow2.com/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data); // Directly setting user data from response
      }
    } catch (error) {
      console.error("There was an error loading the user profile!", error);
    }
  };

  useEffect(() => {
    const fetchPostsIfNeeded = async () => {
      if (activeTab === "work") {
        const posts = await fetchUserPosts();
        setUserPosts(posts);
      }
    };

    const loadUserData = async () => {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        console.error("Authentication token not found");
        return;
      }

      const parsedTokenData = JSON.parse(tokenData);
      const { token, expiry } = parsedTokenData;
      if (!token || (expiry && Date.now() > expiry)) {
        console.error("Token expired");
        return;
      }

      try {
        const response = await Axios.get("https://bryanliow2.com/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        sessionStorage.setItem("userData", JSON.stringify(response.data));
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    const query = new URLSearchParams(window.location.search);
    const userIdFromUrl = query.get("userId");

    if (userIdFromUrl) {
      loadProfile(userIdFromUrl);
      fetchPostsIfNeeded();
    } else {
      loadUserData().then(fetchPostsIfNeeded);
    }

    const updateLinePosition = () => {
      const tab = tabsRef.current[activeTab];
      if (tab) {
        setLinePosition({
          left: tab.offsetLeft,
          width: tab.offsetWidth,
        });
      }
    };

    updateLinePosition();
  }, [activeTab, searchParams]);

  const fetchUserPosts = async () => {
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      console.error("Authentication token not found");
      return;
    }

    try {
      const parsedTokenData = JSON.parse(tokenData);
      const { token, expiry } = parsedTokenData;
      if (!token || (expiry && Date.now() > expiry)) {
        console.error("Token is invalid or expired");
        return;
      }

      const query = new URLSearchParams(window.location.search);
      const userIdFromUrl = query.get("userId");

      let apiUrl = "https://bryanliow2.com/api/post";
      let requestData = {};

      if (userIdFromUrl) {
        apiUrl = "https://bryanliow2.com/api/userpost";
        requestData = { userId: userIdFromUrl };
      }

      const response = await Axios.post(apiUrl, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming the response data structure matches your API
      return response.data;
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case "work":
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-1 lg:grid-cols-5">
              <Card
                className="rounded-xl border-solid border-1 border-gray-900 flex justify-center items-center shadow-full hover:cursor-pointer"
                sx={{ maxWidth: 345, borderRadius: "16px" }}
                onClick={() => router.push("/create-post")}
              >
                <AddCircleOutlineIcon
                  fontSize="large"
                  className="text-gray-400"
                />
              </Card>
              {userPosts.map((contentCard, index) => (
                <div key={index}>
                  <ContentCard
                    randomHeight="false"
                    postId={contentCard.id}
                    contentCardTitle={contentCard.title}
                    thumbnail={contentCard.image}
                    likesCount={contentCard.likesCount}
                    userId={contentCard.user_id}
                    location={contentCard.country}
                    username={contentCard.username}
                    pathname={pathname}
                    createdOn={formatDistanceToNow(
                      new Date(contentCard.createdOn),
                      {
                        addSuffix: true,
                      }
                    )}
                    isLiked={contentCard.isLiked}
                  />
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-950 via-black to-gray-50 text-gray-800 min-h-screen">
      {/* Top Section with Background Image */}
      <div
        className="relative bg-cover bg-center p-4 h-80"
        // style={{ backgroundImage: "url('/path-to-timeline-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-90 to-green-950 opacity-80"></div>
        <div className="flex items-center space-x-4 pl-4 h-full">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="Profile"
            className="z-10 w-24 h-24 lg:w-44 lg:h-44 rounded-full border-4 border-white shadow-sm"
          />
          {/* Wrapper with a background to ensure text color is white regardless of parent opacity */}
          <div className="z-10 bg-transparent flex items-center">
            <div>
              <h2 className="text-xl font-semibold text-white lg:text-3xl">
                {userData?.name}
              </h2>
              <p className="text-xs text-white lg:text-sm">
                @{userData?.username}
              </p>
            </div>
            {!userIdFromUrl && (
              <Link href="/edit-profile" legacyBehavior>
                <a className="flex justify-center items-center text-white px-3 py-1 ml-2">
                  <SettingsIcon sx={{ fontSize: 20 }} />
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="mx-2 my-4">
        <div className="bg-white rounded-t-lg">
          <div className="p-1 lg:p-4">
            {/* <div className="flex justify-around py-3 text-sm bg-white">
              <span>
                <span className="font-bold">5 </span>likes
              </span>
              <span>
                <span className="font-bold">3 </span>friends
              </span>
              <span>
                <span className="font-bold">35 </span>followers
              </span>
              <span>
                <span className="font-bold">25 </span>following
              </span>
            </div> */}
            <div className="p-1 bg-white lg:p-4">
              <div className="mb-2 font-sans font-bold italic">
                <span>{userData?.headline}</span>
              </div>
              <div className="flex text-sm mb-2">
                {userData?.gender != "" && (
                  <span className="bg-gray-600 text-white py-1 px-2 rounded-lg mr-2">
                    {userData?.gender == "male" && (
                      <MaleIcon
                        sx={{ fontSize: 20 }}
                        className="text-blue-400"
                      />
                    )}
                    {userData?.gender == "female" && (
                      <FemaleIcon
                        sx={{ fontSize: 20 }}
                        className="text-red-400"
                      />
                    )}
                    {userData?.gender == "other" && (
                      <TransgenderIcon
                        sx={{ fontSize: 20 }}
                        className="text-white"
                      />
                    )}
                  </span>
                )}
                {userData?.country != "" && (
                  <span className="bg-gray-600 text-white py-1 px-2 rounded-lg mr-2">
                    <LanguageIcon sx={{ fontSize: 20 }} /> {userData?.country}
                  </span>
                )}
              </div>

              {/* Tabs */}
              <div className="relative mt-4 bg-white">
                <div className="flex justify-around">
                  {Object.entries(tabs).map(([tab, Icon]) => (
                    <button
                      key={tab}
                      ref={(el) => (tabsRef.current[tab] = el)}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-t-lg capitalize ${
                        activeTab === tab
                          ? "text-gray-800"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {Icon}
                    </button>
                  ))}
                </div>

                {/* Animated Line */}
                <div
                  className="absolute bottom-0 left-0 bg-orange-500"
                  style={{
                    height: "2px",
                    width: `${linePosition.width}px`,
                    transform: `translateX(${linePosition.left}px)`,
                    transition: "transform 0.3s ease-out",
                  }}
                ></div>
              </div>

              {/* Tab Content */}
              <div className="bg-white mt-0.5  border-t-2 border-gray-5 py-10">
                <TabContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
