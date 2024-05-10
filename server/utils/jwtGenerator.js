const jwt = require("jsonwebtoken");
require("dotenv").config(); // Need to get the jwt secret stored as an environment variable

function jwtGenerator(user_id) {
    const payload = {
        user: user_id,
    };
    // jwt basically creates a hash signature with both the payload and jwt_secret, so if you don't know the secret then you can't fake a token
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" }); // We want it to expire in one hour
}

module.exports = jwtGenerator;
