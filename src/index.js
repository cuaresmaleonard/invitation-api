const express = require("express");
const app = express();
require("dotenv").config();
const { registerRouter } = require("./routes/index.js");
const port = 3300;

// parses incoming requests with JSON payloads
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Invitation-api"));

app.use("/api", registerRouter);

app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});
