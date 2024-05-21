const router = require("express").Router();
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.get("/getRecipes", async (req, res) => {
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
        res.status(500).send("Fetching recipes wasn't successful");
    }
});

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
        res.status(500).send("Fetching recipes wasn't successful");
    }
});
module.exports = router;
