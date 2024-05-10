module.exports = function (req, res, next) {
    // MIDDLEWARE (literally in the middle), check if we're sending valid info to login and register routes
    const { email, name, password } = req.body;

    function validEmail(userEmail) {
        // Regex function to check if the structure of the email is fine
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === "/register") {
        // REgister check
        console.log(!email.length);
        if (![email, name, password].every(Boolean)) {
            // Loop through email name and password with .every to ensure that each of these are included
            return res.status(401).json("Missing Credentials"); // Return json telling what went wrong, 401 for unauthenticated
        } else if (!validEmail(email)) {
            // Check if email is valid
            return res.status(401).json("Invalid Email");
        }
    } else if (req.path === "/login") {
        // Login check
        if (![email, password].every(Boolean)) {
            // Do same as above but with email and password
            return res.status(401).json("Missing Credentials");
        } else if (!validEmail(email)) {
            return res.status(401).json("Invalid Email");
        }
    }
    next(); // Once it checks that everything is okay, continues on the route (on /login or /register)
};
