const express = require("express");
const app = express();
require("dotenv").config();
const { registerRouter, familyRouter } = require("./routes/index.js");
const port = 3300;
const cors = require("cors");
const host = process.env.HOST;
// parses incoming requests with JSON payloads
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const corsOptions = {
	origin: host, // The URL of your local client
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => res.send(`API is running...`));

app.use("/api", registerRouter);

app.use("/api", familyRouter);

app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});
