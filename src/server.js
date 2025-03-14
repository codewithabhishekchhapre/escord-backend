const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userroutes=require("./routes/UserRoutes")
const escortRoutes = require("./routes/escortRoutes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userroutes);
app.use("/api/escorts", escortRoutes); // Use Escort routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));