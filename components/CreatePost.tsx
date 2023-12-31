"use client";
import React, { useState, useRef, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import Slider from "react-slick";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import "react-image-crop/dist/ReactCrop.css";
import { PixelCrop, Crop as BaseCrop } from "react-image-crop";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Snackbar, IconButton } from "@mui/material";
import Axios from "axios";
import { countries } from "countries-list";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

interface Country {
  label: string;
  value: string;
}

const CreatePost: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const sliderRef = useRef<Slider>(null);
  const [key, setKey] = useState(0);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postDescription, setPostDescription] = useState<string>("");
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [location, setLocation] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [mentions, setMentions] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [titleError, setTitleError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [captionError, setCaptionError] = useState("");
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    const countryData: Country[] = Object.values(countries).map((country) => ({
      label: country.name,
      value: country.continent,
    }));
    setCountriesList(countryData);
  }, []); // Runs only once on component mount

  useEffect(() => {
    setKey((prevKey) => prevKey + 1); // Change key to force re-render
  }, [imagePreviews]); // Dependency on imagePreviews

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      files.forEach((file) => processFile(file));
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      createCroppedImage(src);
    };
    reader.readAsDataURL(file);
  };

  const createCroppedImage = async (src: string) => {
    const image = new Image();
    image.src = src;
    image.onload = async () => {
      const crop = getCropForCenterSquare(image);
      const croppedUrl = await getCroppedImageUrl(src, crop);
      setImagePreviews((prev) => [...prev, croppedUrl]);
    };
  };

  const getCropForCenterSquare = (image: HTMLImageElement): PixelCrop => {
    const size = Math.min(image.width, image.height);
    return {
      unit: "px", // Explicitly set unit to 'px'
      width: size,
      height: size,
      x: (image.width - size) / 2,
      y: (image.height - size) / 2,
    };
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newImagePreviews);
  };

  const handleCountryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: Country | null
  ) => {
    setCountry(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsPosting(true); // Set isPosting to true to disable the button and show loading indicator

    // Reset error messages
    setTitleError("");
    setPhotoError("");
    setCaptionError("");

    // Validation checks
    let isValid = true;
    if (!postTitle.trim()) {
      setTitleError("Please enter a title for the post.");
      isValid = false;
    }

    if (imagePreviews.length === 0) {
      setPhotoError("Please upload at least one photo.");
      isValid = false;
    }

    if (!postDescription.trim()) {
      setCaptionError("Please write a caption for the post.");
      isValid = false;
    }

    if (!isValid) {
      setIsPosting(false); // Reset isPosting if the form is not valid
      return;
    }

    if (!isValid) return;

    // Retrieve token data from local storage
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      console.error("No token found");
      // Handle the absence of token (e.g., redirect to login)
      return;
    }

    let parsedTokenData;
    try {
      parsedTokenData = JSON.parse(tokenData);
    } catch (error) {
      console.error("Error parsing token data:", error);
      return;
    }

    const { token, expiry } = parsedTokenData;
    if (!token || (expiry && Date.now() > expiry)) {
      console.error("Token is invalid or expired");
      // Handle expired or invalid token (e.g., redirect to login)
      return;
    }

    // Create FormData instance to handle file uploads
    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("caption", postDescription); // Changed from 'description' to 'caption'
    formData.append("country", country?.label || "");
    // Append other necessary fields if they are part of the API
    // formData.append("tags", tags.join(',')); // Assuming tags is an array of strings
    // formData.append("mentions", mentions.join(',')); // Assuming mentions is an array of strings
    // formData.append("isPrivate", isPrivate.toString());

    // Convert Blob URLs to File objects and append them to FormData
    for (const preview of imagePreviews) {
      try {
        const response = await fetch(preview);
        const blob = await response.blob();
        const filename = preview.split("/").pop() ?? "image.jpg";
        const file = new File([blob], filename, { type: "image/jpeg" });
        formData.append("postPhoto[]", file); // Changed from 'images[]' to 'postPhoto[]' to match server expectations
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    Axios.post("https://bryanliow2.com/api/createnewpost", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setSnackbarOpen(true);
        router.push("/profile");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      })
      .finally(() => {
        setIsPosting(false); // Reset isPosting after the post request completes
      });
  };

  const getCroppedImageUrl = (
    imageSrc: string,
    crop: PixelCrop
  ): Promise<string> => {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    customPaging: function (i: number) {
      return (
        <a>
          <div className="dot" data-index={i}></div>
        </a>
      );
    },

    dotsClass: "slick-dots custom-dots",
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Posted!"
        action={action}
      />
      <div className="flex flex-row justify-center h-44 mb-4">
        {imagePreviews.length === 0 ? (
          // Render this when there are 0 photos in preview
          <div
            className="w-44 h-44 rounded border-dashed border-2 border-gray-300 flex justify-center items-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <AddPhotoAlternateIcon className="z-0 !text-8xl text-gray-50" />
          </div>
        ) : (
          // Render this when there is 1 or more photos in preview
          <div className="relative lg:flex lg:items-center">
            {/* Left Arrow Button, positioned absolutely relative to the parent container on large screens */}
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="hidden lg:flex absolute inset-y-0 left-0 z-10 lg:relative lg:left-auto lg:transform-none justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 mr-2"
            >
              <ArrowLeftIcon className="text-gray-50" />
            </button>

            <div className="w-44 h-44 rounded border-gray-300 bg-gray-300">
              <Slider ref={sliderRef} key={key} {...sliderSettings}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-44 h-44"
                      style={{ zIndex: 0, objectFit: "contain" }}
                    />
                    <button
                      onClick={() => {
                        handleDeleteImage(index);
                      }}
                      className="absolute top-0 right-0 bg-white border border-gray-300 rounded-full cursor-pointer m-2"
                    >
                      <DeleteIcon sx={{ fontSize: 20 }} />
                    </button>
                  </div>
                ))}
              </Slider>
            </div>

            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="hidden lg:flex absolute inset-y-0 left-0 z-10 lg:relative lg:left-auto lg:transform-none justify-center items-center bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 ml-2"
            >
              <ArrowRightIcon className="text-gray-50" />
            </button>
          </div>
        )}
      </div>
      {photoError && <div className="text-red-500 text-sm">{photoError}</div>}
      <input
        type="text"
        placeholder="Post title*"
        className="w-full p-2 border rounded"
        value={postTitle}
        onChange={(e) => setPostTitle(e.target.value)}
      />
      {titleError && <div className="text-red-500 text-sm">{titleError}</div>}

      <textarea
        placeholder="Write a caption...*"
        className="w-full p-2 border rounded"
        value={postDescription}
        onChange={(e) => setPostDescription(e.target.value)}
      />
      {captionError && (
        <div className="text-red-500 text-sm">{captionError}</div>
      )}
      <Autocomplete
        fullWidth
        options={countriesList}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField {...params} label="Country" variant="outlined" />
        )}
        value={country} // Use the country state here
        onChange={handleCountryChange}
      />
      {/* <input
        type="text"
        placeholder="Tag people"
        className="w-full p-2 border rounded"
        value={mentions}
        onChange={(e) => setMentions(e.target.value)}
      />
      <input
        type="text"
        placeholder="Add tags"
        className="w-full p-2 border rounded"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        <span className="ml-2">Private</span>
      </label> */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageChange}
      />
      <div className="flex justify-center mt-7">
        <button
          type="submit"
          className="btn_login !py-2 !px-5 flexCenter gap-8 rounded-full border hover:cursor-pointer"
          disabled={isPosting}
        >
          {isPosting ? "Posting..." : "Share Post"}{" "}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
