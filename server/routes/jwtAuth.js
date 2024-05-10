const router = require("express").Router(); // Use Express routing
const pool = require("../db"); // Take the exported pool object in
const bcrypt = require("bcrypt"); // Need this to hash passwords
const jwtGenerator = require("../utils/jwtGenerator.js"); // Use this to generate jwt tokens
const validInfo = require("../middleware/validInfo"); // Need the FUNCTION to check if inputted info is valid or not
const authorization = require("../middleware/authorization"); // Need the FUNCTION to check if user is authorized

// Authentication = Verify user credentials and identity, authorization determines access rights

// sign-up route
router.post("/sign-up", validInfo, async (req, res) => {
    try {
        // 1. Destructure the req.body (name, email, password)
        const { name, email, password } = req.body; // Same thing as python x1, x2 = list_with_two_items, but variables correctly assigned based off the object

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

        // 5. Generating jwt token

        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token }); // Put the token as a json into the res to be sent back
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error"); // Server error of status code 500 if something goes wrong
    }
});

// LOGIN route
router.post("/login", validInfo, async (req, res) => {
    try {
        // 1. Destructure req.body
        const { name, email, password } = req.body;

        // 2. Check if user doesn't exist (if not then throw error)

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email,
        ]);

        if (user.rows.length == 0) {
            return res.status(401).json("Password or Email is incorrect"); // Unauthenticated
        }
        // 3. Check if incoming password is the same as the database password

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password); // Compare if the encrypted passwords are the same
        console.log(validPassword);

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect"); // Password hashes didn't match
        }
        // 4. Give them a jwt token
        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token }); // Put the token as a json into the res to be sent back
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/verify", authorization, async (req, res) => {
    try {
        res.json(true); // Just return true here since authorization middleware checks that the user is authorized
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
