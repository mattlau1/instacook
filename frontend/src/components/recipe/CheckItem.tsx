import { Checkbox, FormControlLabel } from '@mui/material';
import React, { useState, useEffect } from 'react';

type Props = {
  bookId: string,
  recipeId: string,
  name: string,
}

const CheckItem = (props: Props) => {
  const [isInBook, setIsInBook] = useState(false);

  useEffect(() => {
    /**
     * Check if the recipe is saved in any books
     */
    const checkRecipeInBook = async () => {
      try {
        const requestBody = {
          query: `
            query {
              checkRecipeInBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
            }
          `
        };
        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }
        setIsInBook(apiData.data.checkRecipeInBook);
      } catch(error) {
        console.log("remove recipe failed", error);
      }
    }
    checkRecipeInBook();
  })


  /**
   *  Remove recipe ID from the book that is saved into 
   */
  const removeRecipeIdFromBook = async () => {
    try {
      const requestBody = {
        query: `
          mutation {
            deleteRecipeIdInBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
          }
        `
      };
      console.log(requestBody);
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }
      console.log("remove successfully")
      setIsInBook(false);
    } catch(error) {
      console.log("remove recipe failed", error);
    }
  };

  /**
   * Add recipe ID into the book
   */
  const addRecipeIdToBook = async () => {
    try {
      const requestBody = {
        query: `
          mutation {
            addRecipeToBook(recipeBookID: "${props.bookId}", recipeID: ${props.recipeId})
          }
        `
      };
      console.log(requestBody);
      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }
      console.log("add successfully")
      setIsInBook(true);
    } catch(error) {
      console.log("add to recipe failed", error);
    }

  };

  return (
    <FormControlLabel 
      onClick={()=> isInBook ? removeRecipeIdFromBook() : addRecipeIdToBook()}
      control={<Checkbox checked={isInBook} />} 
      label={props.name} 
    />
  )
}

export default CheckItem;