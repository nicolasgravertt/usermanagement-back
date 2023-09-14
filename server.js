const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./src/config/corsOptions");
const { logger } = require("./src/middleware/logEvents");
const errorHandler = require("./src/middleware/errorHandler");
const verifyJWT = require("./src/middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./src/middleware/credentials");
const { connectToDatabase } = require("./src/db/mongoDB");
const PORT = process.env.PORT || 3500;

// Connect to database
connectToDatabase();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use("/", require("./src/routes/root"));
app.use("/register", require("./src/routes/register"));
app.use("/auth", require("./src/routes/auth"));
app.use("/refresh", require("./src/routes/refresh"));
app.use("/logout", require("./src/routes/logout"));

app.use(verifyJWT);
// app.use("/users", require("./src/routes/api/users"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
