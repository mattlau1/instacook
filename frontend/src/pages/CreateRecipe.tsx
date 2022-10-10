import React, { useEffect } from 'react'
import { IconButton, Avatar, Divider, ListItemAvatar, CardContent, CardActionArea, ListItemText, List, ListItem, CardMedia, Card, Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import testimg from '../static/images/authbackground.jpeg'
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Amplify, { API, Auth, Storage } from "aws-amplify";

type Props = {}

type Comment = {
  author: string,
  comment: string,
}

const CreateRecipe = (props: Props) => {
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("Matthew");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [comments, setComments] = React.useState([{author: "Gordon Ramsay", comment: "This lamb is so undercooked, it’s following Mary to school!"}, {author: "Gordon Ramsay", comment: "My gran could do better! And she’s dead!"}, {author: "Gordon Ramsay", comment: "This pizza is so disgusting, if you take it to Italy you’ll get arrested."}])
  const [selectedImage, setSelectedImage] = React.useState<File>();
  const [preview, setPreview] = React.useState<string>("");

  const listIngredient = ingredients.map((ingredient, key) =>
    <li key={key}>
      <ListItemText primary={ingredient} />
    </li>
  );
  const listInstructions = instructions.map((instruction, key) =>
    <ListItem key={key}>
      <Grid
        container
        spacing={0}
        direction="row"
      >
        <Grid item sm={0} sx={{paddingTop: 0.75}}>
          <Typography variant="h5">
            {key + 1}
          </Typography>
        </Grid>
        <Grid item sm={10} sx={{borderLeft: "1px solid", padding: 0, paddingLeft: 1, margin: 1}}>
          {instruction}
        </Grid>
      </Grid>
    </ListItem>
  );

  const bgStyles = {
    minHeight: `calc(100vh - 64px)`,
    backgroundColor: "#d3d3d3",
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("comment"))
    const data: Comment = {
      author: "Raymond Chung",
      comment: JSON.parse(JSON.stringify(formData.get("comment"))),
    };
    setComments([data, ...comments]);
  };

  const handleInstruction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("instruction"))
    // formData.set("")
    setInstructions([...instructions, JSON.parse(JSON.stringify(formData.get("instruction")))]);
  };

  const handleIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("ingredient"))
    setIngredients([...ingredients, JSON.parse(JSON.stringify(formData.get("ingredient")))]);
  };

  // const handleIngredient= (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   console.log(formData.get("comment"))
  //   const data: Comment = {
  //     author: "Raymond Chung",
  //     comment: JSON.parse(JSON.stringify(formData.get("comment"))),
  //   };
  // };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={bgStyles}
      sx={{paddingLeft: 0}}
    >
      <Container component="main" sx={{ border: "0px solid", borderRadius: 0, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box
          // component="form"
          // onSubmit={handleSubmit}
        >

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
            <TextField
              fullWidth
              id="recipeName"
              name="recipeName"
              label="Enter Recipe Name Here"
              variant="standard"
              onChange={(e) => {
                setRecipeName(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-end"
            }}
            >
            <Typography variant="caption">
              posted by {contributorName}
            </Typography>

          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            >

              <Box>
                <IconButton color="primary" aria-label="upload picture" component="label"
                              // style={{
                              //   height: 0,
                              //   paddingLeft: 0,
                              //   paddingRight: 0,
                              //   paddingTop: '56.25%', // 16:9,
                              //   marginTop:'30'
                              // }}
                >
                  <input hidden accept="image/*" type="file" onChange={(e) => {
                  e.preventDefault();
                  console.log(e.target.value);
                  if (e.target.files != null) {
                    setSelectedImage(e.target.files[0]);
                    setPreview(e.target.files[0].name);
                    console.log(e.target.files[0]);
                  }
                }}/>
                  <AddPhotoAlternateIcon fontSize='large' sx={{}}/>
                </IconButton>
                {preview}
                {/* {console.log(selectedImage)} */}
                {/* {e.target.files[0].name} */}

                {/* <Card
                  variant="outlined"

                  >
                  <img
                    // style={{
                    //   height: 0,
                    //   paddingLeft: 0,
                    //   paddingRight: 0,
                    //   paddingTop: '56.25%', // 16:9,
                    //   marginTop:'30'
                    // }}
                    src={preview}
                    alt={"hi"}
                  />
                </Card> */}
              </Box>
              {/* <Card
            variant="outlined"
            >
            <CardMedia
              image={testimg}
              style={{
                height: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: '56.25%', // 16:9,
                marginTop:'30'
              }}
            />
            </Card> */}
            <Grid container spacing={5} sx={{padding: 3}}>
              <Grid item sm={3}>
                <Typography variant="h5">
                  Ingredients
                </Typography>
                <ul>
                  {listIngredient}
                </ul>
                <Box
                  component="form"
                  onSubmit={handleIngredient}
                >
                  <TextField
                    fullWidth
                    variant='standard'
                    InputProps={{ endAdornment:
                    <IconButton
                    color='secondary'
                    type="submit">
                      <AddIcon />
                    </IconButton> }}
                    name="ingredient"
                    id="ingredient"
                    placeholder="Add another ingredient"
                  />
                </Box>
              </Grid>
              <Grid item sm={9}>
                <Typography variant="h5">
                  Cooking Instructions
                </Typography>
                <List>
                  {listInstructions}</List>
                  <Box
                    component="form"
                    onSubmit={handleInstruction}
                  >
                    <TextField
                      fullWidth
                      variant='standard'
                      InputProps={{ endAdornment:
                      <IconButton
                      color='secondary'
                      type="submit"
                      >
                        <AddIcon />
                      </IconButton> }}
                      name="instruction"
                      id="instruction"
                      placeholder="Add another cooking instruction"
                    />
                  </Box>
              </Grid>
            </Grid>
                  <Box
                    paddingTop={0}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: "flex-end"
                    }}
                  >
                    <Button variant="contained">Contained</Button>
                  </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}
export default CreateRecipe