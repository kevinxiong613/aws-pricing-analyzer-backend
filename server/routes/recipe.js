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
            res.status(401).send("Recipe already exists for this user.");
        }

        // Enter the new recipe inside the database
        const newUser = await pool.query(
            "INSERT INTO recipes (title, ingredients, instructions, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, ingredients, instructions, user_id]
        );
        res.json({ newUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Failed to save recipe.");
    }
});

router.get("/getUserRecipes", async (req, res) => {
    try {
        const email = req.header("token");

        const existing = await pool.query(
            "SELECT * FROM recipes WHERE user_email = $1 AND title = $2",
            [email, title]
        );
        if (existing.rows.length != 0) {
            res.status(401).send("Recipe already exists for this user.");
        }

        // Enter the new recipe inside the database
        const newUser = await pool.query(
            "INSERT INTO recipes (title, ingredients, instructions, user_email) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, ingredients, instructions, email]
        );
        res.json({ newUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Failed to save recipe.");
    }
});

module.exports = router;
