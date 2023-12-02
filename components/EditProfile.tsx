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

interface Country {
  label: string;
  value: string;
}

const ProfileContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const EditProfile = () => {
  const [country, setCountry] = useState<Country | null>(null);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const countryData: Country[] = Object.values(countries).map((country) => ({
      label: country.name,
      value: country.continent,
    }));
    setCountriesList(countryData);
  }, []);

  const handleCountryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: Country | null
  ) => {
    setCountry(value);
  };

  const handleUpdateProfile = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.log("No authorization token found");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      fullName,
      country: country?.label, // Assuming country is an object with a 'label' property
      headline,
      gender,
    };

    Axios.post("http://127.0.0.1:8000/api/update-profile", data, { headers })
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  return (
    <ProfileContainer>
        <div
          className="relative bg-cover bg-center p-4 h-50"
          style={{ backgroundImage: "url('/path-to-timeline-image.jpg')" }}
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
          value={country}
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
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <div className="mt-7 flex justify-center">
          <Button
            type="submit"
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
