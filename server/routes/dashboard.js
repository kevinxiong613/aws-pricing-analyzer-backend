const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {
        // req.user has the payload after authorization since we set it to the payload we generated in that middleware componment
        // req.user is the uuid we created, given to us from payload from authorization
        const user = await pool.query("SELECT user_name FROM users where user_id = $1", [
            // Only get username, dont give back password
            req.user,
        ]);

        res.json(user.rows[0]); // Gets the user back
    } catch (err) {
        console.log(err.message);
        res.status(500).json("Server error");
    }
});
module.exports = router;
