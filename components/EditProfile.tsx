"use client";
import React, { useState, useEffect } from "react";
import {
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import { countries } from "countries-list";
import { styled } from "@mui/material/styles";
import Axios from "axios";
import Button from "./Button";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
interface Country {
  label: string;
  value: string;
}
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

const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const EditProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [gender, setGender] = useState("");
  const findCountryObject = (countryName: string) => {
    return (
      countriesList.find(
        (country) => country.label.toLowerCase() === countryName.toLowerCase()
      ) || null
    );
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const countryData: Country[] = Object.values(countries).map((country) => ({
      label: country.name,
      value: country.continent,
    }));
    setCountriesList(countryData);
  }, []); // Runs only once on component mount

  // This useEffect is for fetching user data
  useEffect(() => {
    // Ensure countriesList is populated before making the user data fetch
    if (countriesList.length > 0) {
      const tokenData = localStorage.getItem("token");
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
          return;
        }

        Axios.get("https://bryanliow2.com/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            const fetchedUserData = response.data;
            setFullName(fetchedUserData.name || "");
            setHeadline(fetchedUserData.headline || "");
            setGender(fetchedUserData.gender || "");
            const countryObj = findCountryObject(fetchedUserData.country || "");
            setCountry(countryObj);
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      }
    }
  }, [countriesList]); // This useEffect depends on countriesList

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

  const handleCountryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: Country | null
  ) => {
    setCountry(value);
  };

  const handleBack = () => {
    router.push("/profile");
  };

  const handleUpdateProfile = () => {
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

      const data = {
        name: fullName,
        country: country?.label, // Assuming country is an object with a 'label' property
        headline: headline,
        gender: gender,
      };

      Axios.post("https://bryanliow2.com/api/updateprofile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          Axios.get("https://bryanliow2.com/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              setUserData(response.data);
              sessionStorage.setItem("userData", JSON.stringify(response.data));
            })
            .catch((error) => {
              console.error("There was an error!", error);
            });
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    }
  };

  return (
    <ProfileContainer>
      <div onClick={() => handleBack()} className="hover:cursor-pointer">
        <ArrowBackIcon />
      </div>
      <div
        className="relative bg-cover bg-center p-4 h-50"
        // style={{ backgroundImage: "url('/path-to-timeline-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-gray-90 to-black opacity-80"></div>
        <div className="flex justify-center items-center space-x-4 pl-4 h-full">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="Profile"
            className="z-10 w-44 h-44 rounded-full border-4 border-white shadow-sm"
          />
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Profile updated successfully"
        action={action}
      />
      <form noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
          variant="outlined"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Autocomplete
          fullWidth
          options={countriesList}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              margin="normal"
              variant="outlined"
            />
          )}
          value={country} // Use the country state here
          onChange={handleCountryChange}
        />
        <TextField
          fullWidth
          label="Headline"
          margin="normal"
          variant="outlined"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender-select"
            label="Gender"
            value={gender} // Use the gender state here
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <div className="mt-7 flex justify-center">
          <Button
            type="button" // Change type to "button" to prevent form submission
            title="Update Profile"
            variant="btn_login"
            onClick={handleUpdateProfile}
          />
        </div>
      </form>
    </ProfileContainer>
  );
};

export default EditProfile;
