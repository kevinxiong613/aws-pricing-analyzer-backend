const jwt = require("jsonwebtoken"); // Need jsonwebtoken library
require("dotenv").config(); // Need environment variables

module.exports = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");
        if (!jwtToken) {
            // If the jwtToken doesn't even exist (null)
            return res.status(403).json("Not authorized");
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET); // If it's verified, will return a payload that can be used in routes

        req.user = payload.user;
    } catch (error) {
        console.error(err.message);
        return res.status(403).json("Not authorized"); // 403 used for authorization issues
    }
};
