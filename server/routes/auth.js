// root/server/routes/auth.js

// ========================= Import Dependencies =========================
const express = require("express");
const router = express.Router(); // express router for defining routes
const pool = require("../database/database"); // Database connection pool

// Authentication libraries (bcrypt for hashing, jwt for tokens)
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ========================= Auth Routes =========================


// | -------- Register User -------- |
// - post function
// - 1) Validates user input
// - 2) Hashes password
// - 3) Stores new user in database
//
//  User table schema:
//  - user_id (PRIMARY KEY)
//  - username (user facing)
//  - email 
//  - password_hash
//  - full_name 
// | ------------------------------- |


router.post("/register", async (req, res) => {
    // Get user details from request body sent by client
    // Sets collected data to variables
    const { username, email, password, full_name } = req.body;

    // Try block - check if user exists, hash password, insert new user
    try {
        // ====== 1) Check if user exists ======
        // check db if user w/ username + email exists
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR username = $2",
            [email, username]
        );

        // If user exists, return error
        // if rows.length is GREATER than 0, user exists
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "User already exists with that email or username" });
        }


        // ====== 2) Hash password using bcrypt ======
        // using bcrypt to hash password before storing in DB
        // "salt" adds random data to password before hashing
        const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds

        const passwordHash = await bcrypt.hash(password, salt); // Hash password with salt



        // ====== 3) Insert new user into database ======

        // Using "INSERT" to add new user to "users" table
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, full_name",
            [username, email, passwordHash, full_name]
        );

        // ====== 4) Create JWT token ======
        // uses "user_id" (FROM user) as to verify user identity in future requests
        const payload = {
            user: {
                id: newUser.rows[0].user_id,
            }
        };

        // ====== 5) Sign JWT token ======
        jwt.sign(
            payload, // payload (w/ user_id) from above
            process.env.JWT_SECRET, // Secret key from environment variable (.env file)
            { expiresIn: "90d" }, // Token expiration time (90 days) (require re-login after expiration)
            (err, token) => {
                if (err) throw err; // if JWT signing fails, throw error
                // Return token to client
                res.json({ token });
            }
        );


    // End of try block - catch errors
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});



// | -------- Login User -------- |
// - post function
// - 1) Check if user exists (w/ username and password)
// - 2) Verify password
// - 3) Create and retuen JWT token
//
//  User table schema:
//  - user_id (PRIMARY KEY)
//  - username (user facing)
//  - email 
//  - password_hash
//  - full_name 
// | ------------------------------- |

router.post("/login", async (req, res) => {

    // ---- 1) Get user input from request body ----
    const { username, password } = req.body;

    // Try block - check if user exists, verify password, create token
    try {
        // ---- 2) Check if user exists ----
        // check if user exists in db using username 
        const user = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        // If user does not exist, return error
        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        
        // ---- 3) Validate password ----
        // check input password against hashed password in db
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        // If password is invalid, return error
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // Authentication successful - create JWT token

        // ---- 4) Create JWT payload ----
        // same as register
        const payload = {
            user: {
                id: user.rows[0].user_id,
            }
        };

        // ---- 5) Sign JWT token ----
        jwt.sign(
            payload, // payload (w/ user_id) from above
            process.env.JWT_SECRET, // Secret key from environment variable (.env file)
            { expiresIn: "90d" }, // Token expiration time (90 days) (require re-login after expiration)
            (err, token) => {
                if (err) throw err; // if JWT signing fails, throw error
                // Return token to client
                res.json({ token });
            }
        );

    // End of try block - catch errors
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// Export the router to be used in server.js
module.exports = router;


        



