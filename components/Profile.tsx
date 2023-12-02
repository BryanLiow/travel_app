"use client";
import React, { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import { HOME_CONTENT_CARD } from "@/constants";
import ContentCard from "./ContentCard";
import LanguageIcon from "@mui/icons-material/Language";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import GridOnIcon from "@mui/icons-material/GridOn";
import GradeIcon from "@mui/icons-material/Grade";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import Axios from "axios";

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
  const [activeTab, setActiveTab] = useState("work");
  const [linePosition, setLinePosition] = useState({ left: 0, width: 0 });
  const [userData, setUserData] = useState<UserData | null>(null);
  const tabsRef = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const tabs = {
    work: <GridOnIcon />,
    favourite: <GradeIcon />, // Assuming you want an icon for "favourite" too
  };

  useEffect(() => {
    // Retrieve the token data from localStorage
    const tokenData = localStorage.getItem("token");

    if (tokenData) {
      let parsedTokenData;
      try {
        // Parse the token data from JSON
        parsedTokenData = JSON.parse(tokenData);
      } catch (error) {
        console.error("Error parsing token data:", error);
        return;
      }

      const { token, expiry } = parsedTokenData;

      // Check if the token has expired
      if (expiry && Date.now() > expiry) {
        console.error("Token expired");
        // Handle expired token (e.g., redirect to login)
        return;
      }

      // Use the token in the API call
      Axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          // Handle success
          setUserData(response.data); // Set the user data in the state
        })
        .catch((error) => {
          // Handle error
          console.error("There was an error!", error);
        });
    }

    const tab = tabsRef.current[activeTab];
    if (tab) {
      setLinePosition({
        left: tab.offsetLeft,
        width: tab.offsetWidth,
      });
    }
  }, [activeTab]);

  const TabContent = () => {
    switch (activeTab) {
      case "work":
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-1 lg:grid-cols-5">
              <Card
                className="rounded-xl border-solid border-1 border-gray-900 flex justify-center items-center shadow-full hover:cursor-pointer"
                sx={{ maxWidth: 345 }}
              >
                <AddCircleOutlineIcon
                  fontSize="large"
                  className="text-gray-400"
                />
              </Card>
              {HOME_CONTENT_CARD.map((contentCard, index) => (
                <div>
                  <ContentCard
                    key={index}
                    randomHeight="false"
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
        );
      case "favourite":
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-1 lg:grid-cols-5">
              {HOME_CONTENT_CARD.map((contentCard, index) => (
                <div>
                  <ContentCard
                    key={index}
                    randomHeight="false"
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
        );
    }
  };

  return (
    <div className="bg-black text-gray-800 min-h-screen">
      {/* Top Section with Background Image */}
      <div
        className="relative bg-cover bg-center p-4 h-80"
        style={{ backgroundImage: "url('/path-to-timeline-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-90 to-black opacity-80"></div>
        <div className="flex items-center space-x-4 pl-4 h-full">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="Profile"
            className="z-10 w-32 h-32 lg:w-44 lg:h-44 rounded-full border-4 border-white shadow-sm"
          />
          {/* Wrapper with a background to ensure text color is white regardless of parent opacity */}
          <div className="z-10 bg-transparent flex items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white">
                {userData?.name}
              </h2>
              <p className="text-sm text-white">@{userData?.username}</p>
            </div>
            <Link href="/editProfile" legacyBehavior>
              <a className="flex justify-center items-center text-white px-3 py-1 ml-2">
                <SettingsIcon />
              </a>
            </Link>
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
              <div className="mb-2 font-sans">
                <span>{userData?.headline}</span>
              </div>
              <div className="flex text-sm mb-2">
                <span className="bg-gray-600 text-white py-1 px-2 rounded-lg mr-2">
                  <MaleIcon className="text-blue-400" /> Man
                </span>
                <span className="bg-gray-600 text-white py-1 px-2 rounded-lg mr-2">
                  <LanguageIcon /> {userData?.country}
                </span>
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
