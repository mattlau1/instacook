import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types/instacook-types';
import { Typography, Container, Grid, Link } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';

type Props = {}

const Feed = (props: Props) => {
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Get recipes from all contributors the user has subscribed to
     */
    const fetchRecipes = async () => {
      try {
        const requestBody = {
          query: `
            query {
              getNewsFeed {
                _id
                contributorUsername
                title
                content
                numberLike
                image
                tags
              }
            }
          `
        };
        const res = await fetch('http://localhost:6921/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });

        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }
        const recipes = apiData.data.getNewsFeed

        const newList: Recipe[] = recipes.map((item: Recipe) => ({
          _id: item._id,
          contributorUsername: item.contributorUsername,
          title: item.title,
          content: item.content,
          numberLike: item.numberLike,
          image: item.image,
          tags: item.tags,
        }))

        setRecipeList([...newList]);
      } catch (error) {
        console.log("Error on fetching recipe", error);
        setRecipeList([]);
      }
    };

    /**
     * Check if the user is authenticated, and get logged-in user detail
     */
    const setUserData = async () => {
      try {
        const { user } = await currentAuthenticatedUser();
        setUsername(user);
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
    setUserData();
    fetchRecipes();
  }, [navigate])

  return (
    <Container
      sx={{ backgroundColor: 'white', paddingBottom: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      {/* A message if there are no recipes displayed */}
      {recipeList.length === 0 ?
        <Grid item pt={6}>
          <Typography variant="h2" align='center' mb={5}>
            No posts yet.
          </Typography>

          <Typography variant="h4" align='center'>
            Head to the <Link href='/'>discovery page</Link> to get started.
          </Typography>
        </Grid>
        :
        <Grid item pt={6}>
          <Typography variant="h2" align='center' mb={5}>
            Hello, {username}.
          </Typography>
        </Grid>
      }

      {/* Recipe Posts */}
      <Grid
        container
        item
        direction="column"
        justifyContent="center"
        alignItems="center"
        md={9}
        ml={{ md: 18 }}
        mr={{ md: 18 }}
      >
        {recipeList.map((item, index) => (
          <ProfileRecipe key={index} post={item} />
        ))}
      </Grid>
    </Container>
  )
}

export default Feed