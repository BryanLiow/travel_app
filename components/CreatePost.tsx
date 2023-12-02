import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel, 
  Container, 
  Typography 
} from '@mui/material';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [mentions, setMentions] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission logic here
    console.log({ title, description, location, mentions, hashtags, isPrivate });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Post Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Location"
          fullWidth
          margin="normal"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          label="@ Mentions"
          fullWidth
          margin="normal"
          value={mentions}
          onChange={(e) => setMentions(e.target.value)}
        />
        <TextField
          label="# Hashtags"
          fullWidth
          margin="normal"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          }
          label="Private Post"
        />
        <Button type="submit" variant="contained" color="primary">
          Create Post
        </Button>
      </form>
    </Container>
  );
};

export default CreatePost;
