const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");



dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
    "EMAIL_APP_PASSWORD exists:",
    !!process.env.EMAIL_APP_PASSWORD
);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/coding", require("./routes/codingRoutes"));

app.get("/", (req, res) => {
    res.json({
        message: "SCORVUE Backend is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SCORVUE server running on port ${PORT}`);
});