const router = require("express").Router(); // Use Express routing
const pool = require("../db"); // Take the exported pool object in
const bcrypt = require("bcrypt"); // Need this to hash passwords

module.exports = router;

// Authentication = Verify user credentials and identity, authorization determines access rights

// registering route
router.post("/register", async (req, res) => {
    try {
        // 1. Destructure the req.body (name, email, password)
        const { name, email, password } = req.body; // Same thing as python x1, x2 = list_with_two_items

        // 2. Check if user exist (if user exists then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email,
        ]); // $1 is the email, we want to check if they equal the email

        if (user.rows.length != 0) {
            // If we get results there are already users with this email
            return res.status(401).send("User already exists"); //  401 means the person is unauthenticated, 403 is not authorized
        }

        // 3. Bcrypt the user password to hash it

        const saltRound = 10; // Define the complexity of the salt generation

        const bcryptPassword = await bcrypt.hash(password, saltRound); // Await in front of anything that takes time basically

        // 4. Enter the new user inside database
        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword] // Return the new user too to confirm
        );

        res.json(newUser.rows[0]);
        // 5. GEenrating jwt token
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error"); // Server error of status code 500 if something goes wrong
    }
});
