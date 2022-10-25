const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
  _id: ID!
  email: String!
  username: String!
  password: String
  listRecipe: [Recipe!]
}

type UserInfo{
  username: String!
  numberFollower: Int!
  numberFollowing: Int!
}

type AuthData {
  userId: ID!
  username: String!
  email: String!
  token: String!
  tokenExpiration: Int!
}

type Recipe{
  title: String!
  dateCreated: String!
  content: String!
  contributor: User! 
  like: [String!]!
  listComments: [Comment!]!
  listTags: [Tag!]!
}

type Tag{
  _id: ID!
  content : String!
}

type RecipeOutput{
  _id: ID!
  title: String!
  dateCreated : String!
  content: String!
  contributorUsername: String!
  numberLike :Int!
  tags: [String!]!
}

type Comment{
  userName: String!
  recipeID: String!
  content: String!
  dateCreated: String!
}

input RecipeInput{
  title: String!
  dateCreated : String!
  content: String!
  tags: [ID!]!
}

input UserInput {
  email: String!
  username: String!
  password: String!
}


type RootQuery {
    login(username: String!, password: String!): AuthData!
    getListRecipeByContributor(username: String!): [RecipeOutput!]!
    getNewsFeed: [RecipeOutput!]!
    getRecipeById(recipeID: String!): RecipeOutput!
    getUserInfo(username:String!):UserInfo!
    isFollowing(followUser:String!): Boolean!
    getTags: [Tag!]!
    isUserAuth: Boolean!
  
}
type RootMutation {
    createUser(userInput: UserInput): User
    createRecipe(recipeInput: RecipeInput): RecipeOutput!
    createComment(recipeID:String!,content:String!,dateCreated:String!): Boolean!
    likeRecipe(recipeID: String!): Boolean!
    follow(followUsername: String!): Boolean!
    updateRecipe(recipeID: String!,RecipeInput: RecipeInput): Boolean!
    deleteRecipe(recipeID: String!): Boolean!
    updateComment(commentID: String!,content:String!,dateCreated:String!): Boolean!
    deleteComment(commentID: String!,recipeID: String!): Boolean!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
