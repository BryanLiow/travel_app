"use client";
import React from 'react';
import { Avatar, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';

const ProfileContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper, // use your theme colors
  color: theme.palette.text.primary,
}));

const UserAvatar = styled(Avatar)({
  width: 90,
  height: 90,
  margin: 'auto',
});

const ProfileSection = styled('div')({
  padding: '20px 0',
  textAlign: 'center',
});

const EditProfileButton = styled(Button)({
  position: 'absolute',
  top: 20,
  right: 20,
  // Add more styles according to your theme
});

const EditProfile = () => {
  // Placeholder function for edit action
  const handleEditProfile = () => {
    // Define your navigation or state change to edit profile here
    console.log('Edit Profile Clicked');
  };

  return (
    <ProfileContainer>
      <ProfileSection>
        <EditProfileButton
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditProfile}
        >
          Edit Profile
        </EditProfileButton>
        <UserAvatar src="/path-to-user-image.jpg" />
        <h3>User Name</h3>
        <p>@username</p>
      </ProfileSection>
      <List component="nav">
        <ListItem button>
          <ListItemText primary="Name" secondary="User Name" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText primary="Bio" secondary="User Bio Here" />
        </ListItem>
        <Divider />
        {/* Add more list items here */}
      </List>
    </ProfileContainer>
  );
};

export default EditProfile;
