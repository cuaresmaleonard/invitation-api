const express = require("express");
const app = express();
require("dotenv").config();
const { registerRouter, familyRouter } = require("./routes/index.js");
const port = 3300;
const cors = require("cors");
const hostVercel = process.env.HOST_VERCEL;
const hostDomain = process.env.HOST_DNS;
const path = require("path");
const rateLimit = require("express-rate-limit");

// Create rate limiter with a window of 15 minutes and a limit of 100 requests per IP
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: "Too many requests, please try again later.", // Message to send when limit is exceeded
	statusCode: 429, // HTTP status code to send when limit is exceeded
	standardHeaders: true, // Enable the default headers
	legacyHeaders: false, // Disable the legacy headers
	keyGenerator: (req) => req.ip, // Use IP address as the key
	skipFailedRequests: true, // Do not count failed requests
	skipSuccessfulRequests: true, // Do not count successful requests
	handler: (req, res, next) => {
		res.status(429).send("Rate limit exceeded");
	},
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// parses incoming requests with JSON payloads
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [hostVercel, hostDomain];

const corsOptions = {
	origin: (origin, callback) => {
		// Check if the origin is in the allowed list
		if (allowedOrigins.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};

const checkOrigin = (req, res, next) => {
	const origin = req.headers.origin;

	if (origin === hostVercel || origin === hostDomain) {
		next(); // Allow the request
	} else {
		res.status(403).send("Forbidden"); // Block the request
	}
};

// app.use(checkOrigin);

app.use(cors(corsOptions));

app.get("/", (req, res) => res.send(`API is running...`));

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api", checkOrigin, registerRouter);

app.use("/api", checkOrigin, familyRouter);

app.listen(port, () => {
	console.log(`Server is running at port ${port}`);
});
