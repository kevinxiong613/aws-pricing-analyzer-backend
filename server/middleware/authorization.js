const jwt = require("jsonwebtoken"); // Need jsonwebtoken library
require("dotenv").config(); // Need environment variables

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");
        if (!jwtToken) {
            // If the jwtToken doesn't even exist (null)
            return res.status(403).json("Not authorized");
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET); // If it's verified, will return a payload that can be used in routes (it's the user_id)

        req.user = payload.user;
        next(); // Continue with the rest of the route that this function was passed in as a parameter
    } catch (err) {
        console.error(err.message + " authorization has failed!");
        return res.status(403).json("Not authorized"); // 403 used for authorization issues
    }
};
