import React from 'react'
import { IconButton, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import RecipeContents from '../components/recipe/RecipeContents';
import { useNavigate } from 'react-router-dom';
import Image from 'mui-image';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';
import { Tag, TagObj } from '../types/instacook-types';
type Props = {}

const bgStyles = {
  minHeight: `calc(100vh - 64px)`,
  backgroundColor: "#d3d3d3",
}

const CreateRecipe = (props: Props) => {

  const navigate = useNavigate();
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [preview, setPreview] = React.useState<string>("");
  const [imgData, setImgData] = React.useState<any>('');
  const [tagOptions, setTagOptions] = React.useState<TagObj>({});
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  React.useEffect(() => {
    /**
     * Retrieves relevant user data
     */
    const setUserData = async () => {
      try {
        const { user } = await currentAuthenticatedUser();
        setUsername(user);
        loadTags();
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
  }, [navigate])

  /**
   * Retrieves all existing tags from the database and sets relevant state hook(s)
   */
  const loadTags = async () => {
    const body = {
      query: `
        query {
          getTags {
            _id
            content
          }
        }
      `
    }

    const res = await fetch('http://localhost:6921/graphql', {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const apiData = await res.json();

    if (apiData.errors) {
      throw new Error(apiData.errors[0].message);
    }

    // create custom tag object
    const tagArr: Tag[] = apiData.data.getTags;
    const tags: TagObj = {}

    tagArr.map((tag: Tag) => (
      tags[tag.content] = tag._id
    ))
    setTagOptions(tags);
    console.log("cleared")
  }

  /**
   * Handles the addition of a tag to a recipe
   *
   * @param tags An array of strings containing selected tags
   */
  const handleTagAdd = (tags: string[]) => {
    setSelectedValues([...tags])
  }

  /**
   * Handles the creation of a new tag if it does not already exist
   *
   * @param tag A string containing the tag name
   */
  const handleTagCreation = async (tag: String) => {
    const requestBody = {
      query: `
      mutation {
        createTag(tagName: "${tag}")
      }
      `
    }
    try {
      const res = await fetch('http://localhost:6921/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }
      loadTags();
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Handles the creation of a recipe
   */
  const handleCreateRecipe = async () => {
    const d = new Date();
    const tagsData = selectedValues.map(i => `"${i}"`);
    const ingredientsData = ingredients.map(i => `"${i}"`);
    const instructionsData = instructions.map(i => `"${i}"`);
    const requestBody = {
      query: `
        mutation {
          createRecipe(
            recipeInput: {
              title: "${recipeName}",
              image: "${imgData}",
              content: """[[${ingredientsData}], [${instructionsData}], [${(description)}]]""",
              dateCreated: "${d.toString()}",
              tags: [${tagsData}]
          }) {
            _id
            title
            content
            dateCreated
            contributorUsername
            numberLike
            tags
          }
        }
      `
    }
    try {
      const res = await fetch('http://localhost:6921/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }
      navigate(`/recipe/${apiData.data.createRecipe._id}`)
    } catch (error) {
      console.log(error)
    }

  }

  /**
   * Handles the addition of an instruction to a recipe
   *
   * @param event React event
   */
  const handleInstruction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setInstructions([...instructions, JSON.parse(JSON.stringify(formData.get("instruction")))]);
  };

  /**
   * Handles the addition of an ingredient to a recipe
   *
   * @param event React event
   */
  const handleIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIngredients([...ingredients, JSON.parse(JSON.stringify(formData.get("ingredient")))]);
  };

  /**
   * Handles the removal of an ingredient to a recipe
   *
   * @param event React event
   */
  const handleRemoveIngredient = () => {
    const copy = [...ingredients];
    copy.pop();
    setIngredients(copy);

  };


  /**
   * Handles the removal of an instruction to a recipe
   *
   * @param event React event
   */
  const handleRemoveInstruction = () => {
    const copy = [...instructions];
    copy.pop();
    setInstructions(copy);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={bgStyles}
      sx={{ paddingLeft: 0 }}
    >
      <Container component="main" sx={{ border: "0px solid", borderRadius: 0, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box>
          {/* Recipe Name */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
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
          {/* Contributor Name */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-end"
            }}
          >
            <Typography variant="caption">
              posted by {username}
            </Typography>
          </Box>
          {/* Recipe Description */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-start"
            }}
          >
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Enter Description Here"
              variant="standard"
              onChange={(e) => {
                setDescription(JSON.stringify(e.target.value));
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Recipe Image */}
            <Box>
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" onChange={(e) => {
                  e.preventDefault();
                  if (e.target.files != null) {
                    setPreview(e.target.files[0].name);
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                      setImgData(reader.result);
                    });
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
                <AddPhotoAlternateIcon fontSize='large' sx={{}} />
              </IconButton>
              {imgData.length !== 0 && <Image
                src={imgData}
                duration={0}
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginTop: '30'
                }}
              />}
              {preview}
            </Box>

            {/* Ingredients and Instructions */}
            <RecipeContents
              ingredients={ingredients}
              instructions={instructions}
              handleInstruction={handleInstruction}
              handleIngredient={handleIngredient}
              handleRemoveIngredient={handleRemoveIngredient}
              handleRemoveInstruction={handleRemoveInstruction}
              handleTagCreation={handleTagCreation}
              tagOptions={tagOptions}
              selectedValues={selectedValues}
              handleTagAdd={handleTagAdd}
            />

            {/* Done button */}
            <Box
              paddingTop={0}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "flex-end"
              }}
            >
              <Button variant="contained"
                onClick={handleCreateRecipe}
              >Done</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}
export default CreateRecipe