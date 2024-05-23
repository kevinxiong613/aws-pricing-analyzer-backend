const router = require("express").Router();
const pool = require("../db"); // Take the exported pool object in
const dotenv = require("dotenv");

router.post("/saveRecipe", async (req, res) => {
    try {
        const { title, ingredients, instructions, user_id } = req.body;
        console.log(title);
        console.log(ingredients);
        console.log(instructions);
        console.log(user_id);
        const existing = await pool.query(
            "SELECT * FROM recipes WHERE user_id = $1 AND title = $2",
            [user_id, title]
        );
        if (existing.rows.length != 0) {
            return res.status(401).send("Recipe already exists for this user.");
        }

        // Enter the new recipe inside the database
        const newUser = await pool.query(
            "INSERT INTO recipes (title, ingredients, instructions, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, ingredients, instructions, user_id]
        );
        res.json({ newUser });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Failed to save recipe.");
    }
});

router.get("/getUserRecipes", async (req, res) => {
    try {
        const user_id = req.header("user_id");

        const recipes = await pool.query("SELECT * FROM recipes WHERE user_id = $1", [
            user_id,
        ]);

        // Send the recipes back as a json
        res.json({ recipes: recipes.rows });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Failed to retrieve recipes.");
    }
});

module.exports = router;
