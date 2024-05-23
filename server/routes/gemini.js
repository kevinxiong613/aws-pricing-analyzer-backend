const router = require("express").Router();
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.get("/verifyIngredients", async (req, res) => {
    try {
        const prompt = req.header("prompt");
        console.log(prompt);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        res.json({ text });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Verifying ingredients wasn't successful");
    }
});

router.get("/getRecipe", async (req, res) => {
    console.log("Entered node.js /getRecipe route");
    try {
        const prompt = req.header("prompt");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        // Manually parse the text into a JSON object
        const lines = text.split("--"); // Specified to seperate everything with dashes in the prompt, make sure to split the lines based off these dashes to seperate ingredients and instructions.
        const titleLine = lines[0].trim(); // Get the lines and trim out white space
        const ingredientsLine = lines[1].trim();
        const instructionsLine = lines[2].trim();
        const title = titleLine.replace("Title: ", "");
        const ingredients = ingredientsLine.replace("Ingredients: ", "").split(", "); // Create lists of the ingredients/instructions to return in a Json
        const instructions = instructionsLine.replace("Instructions: ", "").split(". ");
        instructions[instructions.length - 1] = instructions[
            instructions.length - 1
        ].replace(".", ""); // This will have a period for the last instruction at the end so get rid of it

        console.log(title);
        console.log(ingredients);
        console.log(instructions);
        const jsonObject = {
            // Convert the ingredient/instruction lists into a json
            title: title,
            ingredients: ingredients,
            instructions: instructions,
        };

        console.log(jsonObject);
        res.json(jsonObject); // Send the json to the client
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Fetching recipes wasn't successful");
    }
});
module.exports = router;
