const express = require("expres");
const app = express();
const cors = require("cors");

// middleware

app.use(express.json()); // Be able to access req.body
app.use(cors());

// ROUTES

app.listen(5000, () => {
    console.log("app is running");
});
