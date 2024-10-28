const express = require('express')
const app = express()

const {initializeDatabase}= require('./db/db.connect')

const Recipe= require('./models/recipe.models')
const { error } = require('console')
const { MongoInvalidArgumentError } = require('mongodb')


 app.use(express.json())

 initializeDatabase()

 //to post new recipes in database
async function addNewRecipe(newRecipe) {
    try{
        const recipe= new Recipe(newRecipe)
        const saveRecipe = await recipe.save()
        return saveRecipe
    }catch(error){
        throw error
    }
}

app.post('/recipes', async(req,res)=>{
    try{
        const savedRecipe = await addNewRecipe(req.body)
        res.status(201).json({message:"recipe added successfully.", recipe:savedRecipe})
    }catch(error){
        res.status(500).json({error:"failed to add new data.", error})
    }
})

//to get all recipws in the database
  async function readAllRecipes() {
    try{
        const allRecipes = await Recipe.find()
        return allRecipes
    }catch(error){
        throw error
    }
  }

  app.get('/recipes', async(req,res)=>{
    try{
        const recipe= await readAllRecipes()
        if(recipe.length !=0){
            res.json(recipe)
        }else{
            res.status(404).json({error:'recipe not found'})
        }

    }catch(error){
        res.status(500).json({error:'failed to fetch data'})
    }
  })


  // to get a recipe's details by its title.
async function readRecipeByTitle(recipeTitle) {
    try{
        const recipe= await Recipe.findOne({title:recipeTitle})
        return recipe
    }catch(error){
        throw error
    }
}
  
app.get('/recipes/title/:recipeTitle', async(req,res)=>{
    try{
        const recipe = await readRecipeByTitle(req.params.recipeTitle)
        if(recipe){
            res.json(recipe)
        }else{
            res.status(404).json({error:'recipe not found.'})
        }
    }catch(error){
        res.status(500).json({error:'failed fetch data.'})
    }
})

  // to get details of all the recipes by an author

async function readRecipeByAuthor(recipeAuthor) {
    try{
        const recipe = await Recipe.find({author:recipeAuthor})
        return recipe
    }catch(error){
        throw error
    }
}

app.get('/recipes/author/:recipeAuthor', async(req,res)=>{
    try{
        const recipe = await readRecipeByAuthor(req.params.recipeAuthor)

        if(recipe){
            res.json(recipe)
        }else{
            res.status(404).json({error:'recipe not found.'})
        }
    }catch(error){
        res.status(500).json({error:'failed to fetch data.'})
    }
})


//to get all the recipes that are of "Easy" difficulty level

async function allEasyRecipes(easyLevel) {
    try{
        const recipe = await Recipe.find({difficulty:easyLevel})
        return recipe
    }catch(error){
        throw error
    }
}

app.get('/recipes/difficulty/:easyLevel', async(req,res)=>{
    try{
        const recipe = await allEasyRecipes(req.params.easyLevel)

        if(recipe !=0){
            res.json(recipe)
        }else{
            res.status(404).json({error:"recipe not found."})
        }

    }catch(error){
        res.status(500).json({error:'failed to fetch data'})
    }
})

//update a recipe's difficulty level with the help of its id

async function updateRecipeDifficulty(recipeId,dataToUpdate) {
    try{
        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new:true})
        return updatedRecipe
    }catch(error){
        throw error
    }
}

app.post('/recipes/difficulty/:recipeId', async(req,res)=>{
    try{
        const updatedRecipe = await updateRecipeDifficulty(req.params.recipeId, req.body)
        
        if(updatedRecipe){
            res.status(200).json({message:"recipe updated successfully"})
        }else{
            res.status(404).json({error:"recipe not found"})
        }

    }catch{
        res.status(500).json({error:'failed to update data'})
    }
})


//update a recipe's prep time and cook time with the help of its title
async function updateRecipePrepTimeAndCookTime(recipeTitle,dataToUpdate) {
    try{
        const updatedRecipe = await Recipe.findOneAndUpdate({title:recipeTitle}, dataToUpdate, {new:true})
        return updatedRecipe
    }catch(error){
        throw error
    }
}

app.post('/recipes/title/:recipeTitle', async(req,res)=>{
    try{
        const updatedRecipe = await updateRecipePrepTimeAndCookTime(req.params.recipeTitle, req.body)
        
        if(updatedRecipe){
            res.status(200).json({message:"recipe updated successfully"})
        }else{
            res.status(404).json({error:"recipe not found"})
        }

    }catch{
        res.status(500).json({error:'failed to update data'})
    }
})





//delete a recipe with the help of a recipe id.

async function deleteRecipeById(recipeId) {
    try{
        const updatedRecipe = await Recipe.findByIdAndDelete(recipeId)
        return updatedRecipe
    }catch(error){
        throw error
    }
}

app.delete('/recipes/delete/:recipeId', async(req,res)=>{
    try{
        const updatedRecipe = await deleteRecipeById(req.params.recipeId)
        
        if(updatedRecipe){
            res.status(200).json({message:"recipe deleted successfully"})
        }else{
            res.status(404).json({error:"recipe not found"})
        }

    }catch{
        res.status(500).json({error:'failed to delete data'})
    }
})




const PORT=3000
app.listen(PORT,()=>{
    console.log('server is running on PORT',PORT)
})
