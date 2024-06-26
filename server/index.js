const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// middleware

app.use(express.json()); // Be able to access req.body
app.use(
    cors({
        origin: "http://localhost:3000", // Replace with your frontend URL
    })
); // Declare cors middleware, CORS defines a way for client web applications that are loaded in one domain to interact with resources in a different domain.

// ROUTES
// register and login routes, want to hit at /authentication
app.use("/authentication", require("./routes/jwtAuth"));

// gemini routes
app.use("/generate", require("./routes/gemini"));

// saving and loading recipes routes
app.use("/recipes", require("./routes/recipe"));

app.listen(5001, () => {
    console.log("app is running!");
});
