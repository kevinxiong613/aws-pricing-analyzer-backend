const router = require("express").Router(); // Use Express routing
const pool = require("../db"); // Take the exported pool object in

module.exports = router;

// registering route
router.post("/register", async (req, res) => {
    try {
        // 1. Destructure the req.body (name, email, password)
        const { name, email, password } = req.body; // Same thing as python x1, x2 = list_with_two_items

        // 2. Check if user exist (if user exists then throw error)
        console.log(pool);
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email,
        ]); // $1 is the email, we want to check if they equal the email

        res.json(user.rows);

        // 3. Bcrypt the user password to hash it
        // 4. Enter the new user inside database
        // 5. GEenrating jwt token
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error"); // Server error of status code 500 if something goes wrong
    }
});
