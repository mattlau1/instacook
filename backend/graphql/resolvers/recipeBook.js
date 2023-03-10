const RecipeBook = require("../../models/recipeBook");
const Recipe = require("../../models/recipe");
const User = require("../../models/user");
const Tag = require("../../models/tag.js");

module.exports = {
  // create a new recipe book by a logged in user
  createRecipeBook: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const authUser = await User.findById(req.userId);

    const recipeBook = new RecipeBook({
      name: args.recipeBookName,
      dateCreated: new Date(args.dateCreated),
      contributor: req.userId,
    });

    try {
      if (!authUser) {
        throw new Error("User not found.");
      }

      await recipeBook.save();

      authUser.listRecipeBooks.push(recipeBook);
      await authUser.save();

      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // get all recipe books' id and name of a logged in user
  // recipe books are sorted by date created
  getListOfRecipeBook: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const authUser = await User.findById(req.userId);

    const recipeBooks = await RecipeBook.find({
      _id: { $in: authUser.listRecipeBooks }
    }).sort({
      dateCreated: -1
    });
    return recipeBooks.map((recipeBook) => {
      return {
        _id: recipeBook._id,
        name: recipeBook.name
      };
    });
  },

  // get all recipe thumbnail from a recipe book
  getSavedRecipe: async (args) => {
    const recipeBook = await RecipeBook.findById(args.recipeBookID);
    const recipes = await Recipe.find({
      _id: { $in: recipeBook.listRecipes }
    }).sort({
      title: 1
    });
    return recipes.map(async (recipe) => {
      // query and sort list of tags
      const sortedListTag = await Tag.find({
        _id: { $in: recipe.tags }
      }).sort({
        content: 1
      });
      const tagNames = sortedListTag.map((tag) => { return tag.content });

      const contributor = await User.findById(recipe.contributor);
      return {
        _id: recipe._id,
        contributorUsername: contributor.username,
        title: recipe.title,
        content: recipe.content,
        numberLike: recipe.numberLike,
        tags: tagNames,
      };
    });
  },

  // add a recipe to a recipe book by a logged in user
  addRecipeToBook: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const recipeBook = await RecipeBook.findById(args.recipeBookID);
    recipeBook.listRecipes.push(args.recipeID);
    await recipeBook.save();
    return true;
  },

  // delete a recipe book by a logged in user
  deleteRecipeBook: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    await RecipeBook.findByIdAndDelete(args.recipeBookID);
    const authUser = await User.findById(req.userId);
    authUser.listRecipeBooks = authUser.listRecipeBooks.filter(
      (recipeBookID) => recipeBookID.toString() !== args.recipeBookID
    );
    await authUser.save();
    return true;
  },

  // delete a recipe from a recipe book by a logged in user
  deleteRecipeIdInBook: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const recipeBook = await RecipeBook.findById(args.recipeBookID);
    recipeBook.listRecipes = recipeBook.listRecipes.filter(
      (recipeID) => recipeID.toString() !== args.recipeID
    );
    await recipeBook.save();
    return true;
  },

  // check if a recipe is in a recipe book
  checkRecipeInBook: async (args) => {
    const recipeBook = await RecipeBook.findById(args.recipeBookID);
    return recipeBook.listRecipes.includes(args.recipeID);
  }
};
