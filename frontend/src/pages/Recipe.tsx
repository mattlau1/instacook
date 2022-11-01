import React from 'react'
import { IconButton, Avatar, Divider, ListItemAvatar, CardContent, CardActionArea, ListItemText, List, ListItem, CardMedia, Card, Box, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import testimg from '../static/images/authbackground.jpeg'
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useParams } from 'react-router-dom';
import { API, Auth, Storage } from "aws-amplify";
import EditIcon from '@mui/icons-material/Edit';
import Image from 'mui-image';
import { Comment } from '../types/instacook-types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
type Props = {}

// const listRecipes = /* GraphQL */ `
// query ListRecipes(
//   $filter: ModelRecipeFilterInput
//   $limit: Int
//   $nextToken: String
//   ) {
//   listRecipes(filter: $filter, limit: $limit, nextToken: $nextToken) {
//     items {
//       id
//       name
//       content
//       contributor
//       fileImage
//       createdAt
//       updatedAt
//       owner
//     }
//     nextToken
//   }
// }
// `;

// const getRecipe = /* GraphQL */ `
// query GetRecipe($id: ID!) {
//   getRecipe(id: $id) {
//     id
//     name
//     content
//     contributor
//     fileImage
//     createdAt
//     updatedAt
//     owner
//   }
// }
// `;

const sampleComments = [
  { author: "Gordon Ramsay", comment: "This lamb is so undercooked, it’s following Mary to school!" },
  { author: "Gordon Ramsay", comment: "My gran could do better! And she’s dead!" },
  { author: "Gordon Ramsay", comment: "This pizza is so disgusting, if you take it to Italy you’ll get arrested." }
]

const Recipe = (props: Props) => {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [username, setUsername] = React.useState("");
  const [description, setDescription] = React.useState<string>("");
  const [recipeImage, setRecipeImage] = React.useState<string>("");
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState([""]);
  const [instructions, setInstructions] = React.useState([""]);
  const [similarRecipes, setSimilarRecipes] = React.useState([1, 2, 3, 4, 5, 6, 7])
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [numberLike, setNumberLike] = React.useState(0);
  const [tags, setTags] = React.useState([""]);
  const [token, setToken] = React.useState<string>("");


  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // const apiData: any = await API.graphql({ query: listRecipes });
        // const recipes = apiData.data.listRecipes.items;
        // console.log(recipes);
        // const apiData2: any = await API.graphql({
        //   query: getRecipe,
        //   variables: { id: recipeId }
        // });
        // const recipeById = apiData2.data.getRecipe;

        // setRecipeName(recipeById.name);
        // setDescription(JSON.parse(recipeById.content)[2])
        // setContributorName(recipeById.contributor);
        // if (recipeById.content[0] != null) {
        //   setIngredients(JSON.parse(recipeById.content)[0]);
        // }
        // if (recipeById.content[1] != null) {
        //   setInstructions(JSON.parse(recipeById.content)[1]);
        // }

        // const fileAccessURL = await Storage.get(recipeById.fileImage.slice(5, -1), { expires: 30, level: "public" });
        // setRecipeImage(fileAccessURL);

        const requestBody = {
          query: `
            query {
              getRecipeById(recipeID: "${recipeId}") {
                  title
                  content
                  dateCreated
                  contributorUsername
                  numberLike
                  listComments {
                      userName
                      recipeID
                      content
                      dateCreated
                  }
                  tags
              }
          }
          `
        }

        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("TRIGGERRREDD");
        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }
        console.log(apiData);
        setRecipeName(apiData.data.getRecipeById.title)
        setDescription(JSON.parse(apiData.data.getRecipeById.content)[2])
        setContributorName(apiData.data.getRecipeById.contributorUsername)
        setRecipeImage(JSON.parse(apiData.data.getRecipeById.content)[3])
        setNumberLike(apiData.data.getRecipeById.numberLike)
        setComments(apiData.data.getRecipeById.listComments)
        setTags(apiData.data.getRecipeById.tags)
        if (apiData.data.getRecipeById.content[0] != null) {
          setIngredients(JSON.parse(apiData.data.getRecipeById.content)[0]);
        }
        if (apiData.data.getRecipeById.content[1] != null) {
          setInstructions(JSON.parse(apiData.data.getRecipeById.content)[1]);
        }
      } catch (error) {
        console.log("error on fetching recipe", error);
      }
    };

    const setUserData = async () => {
      try {
        // TS types are wrong: https://github.com/aws-amplify/amplify-js/issues/4927
        const user = await Auth.currentAuthenticatedUser({
          bypassCache: false
        })
        console.log(user)
        setUsername(user.username);
        setToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzVmNzcwNWNjNTA0ZDJjZjMwYTQ0MWUiLCJlbWFpbCI6InNoYWRvd0BnbWFpbC5jb20iLCJpYXQiOjE2NjcyOTE4MDMsImV4cCI6MTY2NzI5NTQwM30.f9S7XJp9-BcGmpo-4hZy60yaGXe6-Ykxkd3PKF-GteM")
      } catch (e) {
        if (typeof e === "string") {
          console.log(e);
        } else if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log(e);
        }

        // go to login page if not authenticated
        navigate('/login');
      }
    }
    setUserData()
    fetchRecipes();
  }, [navigate, recipeId]);


  const similarRecipesCarousel = similarRecipes.map((recipe, key) =>
    <Grid key={key} item sm={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={testimg}
            alt="similar recipe"
          />
          <CardContent>
            <Typography variant="h5">
              Similar Recipe {recipe}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  // REMOVE THIS
  let items = []
  let carouselTab: any[] = []
  for (let i = 0; i < similarRecipesCarousel.length; i++) {
    carouselTab.push(similarRecipesCarousel[i]);
    if (carouselTab.length % 4 === 0) {
      items.push(carouselTab);
      carouselTab = [];
    }
  }
  items.push(carouselTab);

  const handleSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("comment"))
    const d = new Date();
    const data: Comment = {
      userName: username,
      content: JSON.parse(JSON.stringify(formData.get("comment"))),
      dateCreated: d.toString(),
      recipeID: recipeId!
    };
    const requestBody = {
      query: `
        mutation {
          createComment(recipeID: "${recipeId}",
          content: "${JSON.parse(JSON.stringify(formData.get("comment")))}",
          dateCreated: "${d.toString()}"
          )
      }
      `
    }
    console.log(requestBody)
    const res = await fetch('http://localhost:3000/graphql', {
      body: JSON.stringify(requestBody),
      method: "POST",
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    });
    console.log("TRIGGERRREDD");
    const apiData1 = await res.json();
    console.log(apiData1);

    setComments([data, ...comments]);
    console.log(comments)
  };

  const handleLike = async () => {
    const requestBody = {
      query: `
        mutation {
          likeRecipe(recipeID: "${recipeId}")
        }
      `
    }
    console.log(requestBody)
    await fetch('http://localhost:3000/graphql', {
      body: JSON.stringify(requestBody),
      method: "POST",
      headers: {
        Authorization: token,
        'Content-Type': 'application/json'
      }
    });
  }

  const tagStyles = {
    display: "flex",
    backgroundColor: '#28343c',
    paddingRight: 1,
    paddingLeft: 1,
    borderRadius: 2,
    color: '#FFF',
    margin: 0.5,
    justifyItems: "center",
    alignItems: "center",
  }

  const likeStyles = {
    backgroundColor: '#FFF',
    padding: 1,
    borderRadius: 2,
    color: '#28343c',
    margin: 0.5,
    minWidth: "60px",
    '&:hover': {
      backgroundColor: '#28343c',
      color: '#fff',
    },
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{
        backgroundColor: "#d3d3d3",
      }}
      sx={{ paddingLeft: 0 }}
    >
      <Container component="main" sx={{ border: "0px solid", borderRadius: 0, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">
            {recipeName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: "flex-end"
          }}
        >

          <Typography variant="caption"
            onClick={() => { navigate(`/profile/${contributorName}`) }}
            sx={{ cursor: "pointer" }}>
              posted by {contributorName}
          </Typography>
              {(contributorName === username) &&
                <IconButton onClick={() => { (navigate(`/updaterecipe/${recipeId}`)) }} color={"secondary"}>
                  <EditIcon />
                </IconButton>}

        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {description}
        </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          <Card
            variant="outlined"
          >
            <Image
              src={recipeImage}
              duration={0}
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                marginTop: '30'
              }}
            />
          </Card>
          <Box sx={{display: "flex"}}>
            <Box sx={{display: "flex", width: "50%"}}>
            {tags.map((tag, key) =>
              <Box sx={tagStyles} key={key}>
              <Typography variant='body2'>
                {tag}
              </Typography>
            </Box>
            )}

            </Box>
            <Box sx={{
            display: "flex",
            width: "50%",
            alignItems: "flex-end",
            flexDirection: "column"}}>
                <IconButton sx={likeStyles} onClick={handleLike}>
                  <Grid container direction="row" alignItems="center">
                    <FavoriteIcon sx={{ fontSize: "30px", marginRight: 0.5}}/>
                    <Typography>
                      {numberLike}
                    </Typography>
                  </Grid>
                </IconButton>
            </Box>
          </Box>
          <Grid container spacing={3} sx={{ padding: 3}}>
            <Grid item sm={3}>
              <Typography variant="h5">
                Ingredients
              </Typography>
              <ul>
                {ingredients.map((ingredient, key) =>
                  <li key={key}>
                    <ListItemText primary={ingredient} />
                  </li>
                )}
              </ul>
            </Grid>
            <Grid item sm={8}>
              <Typography variant="h5">
                Cooking Instructions
              </Typography>
            {/* </Box> */}
              <List>
                {instructions.map((instruction, key) =>
                  <ListItem key={key}>
                    <Grid
                      container
                      spacing={0}
                      direction="row"
                    >
                      <Grid item sm={0} sx={{ paddingTop: 0.75 }}>
                        <Typography variant="h5">
                          {key + 1}
                        </Typography>
                      </Grid>
                      <Grid item sm={10} sx={{ borderLeft: "1px solid", padding: 0, paddingLeft: 1, margin: 1 }}>
                        {instruction}
                      </Grid>
                    </Grid>
                  </ListItem>
                )}
              </List>
            </Grid>

          </Grid>
        </Box>
        <Box
          sx={{
            padding: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">
            Similar Recipes
          </Typography>
          <Carousel
            autoPlay={false}
            animation={"slide"}
          >
            {
              items.map((item, key) =>
                <Grid key={key} container spacing={2} sx={{ padding: 3 }}>
                  {item}
                </Grid>
              )
            }
          </Carousel>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmitComment}
          sx={{
            padding: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{
            paddingBottom: 3
          }}>
            Comments
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: "flex-start"
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ maring: "5" }} alt={username} src="" />
            </ListItemAvatar>
            <TextField
              fullWidth
              variant='standard'
              InputProps={{
                endAdornment:
                  <IconButton
                    color='secondary'
                    type="submit">
                    <SendIcon />
                  </IconButton>
              }}
              name="comment"
              id="comment"
              placeholder="Add a Comment"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-end"
            }}
          >
          </Box>
          <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
            {comments.map((comment, key) =>
              <div key={key}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={comment.userName} src="" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.userName}
                    secondary={
                      <Typography variant="body2">
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" />
              </div>
            )}
          </List>
        </Box>
      </Container>
    </Grid>
  )
}

export default Recipe