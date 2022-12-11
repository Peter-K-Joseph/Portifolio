"use strict";
const express = require("express");
const {createLogger, format, transports} = require("winston");
const {combine, timestamp, printf} = format;
const app = express();

const logger = createLogger({
	format: combine(
		timestamp(),
		printf(({level, message, timestamp}) => {
			return `${timestamp} [${level}]: ${message}`;
		})
	),
	transports: [new transports.Console(), new transports.File({ filename: 'system.log' })],
});

const data = {
	setting_data: require("./dist/json/settings.json"),
};

const port = 80;

app.use(express.static("dist"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
	logger.info(`${req.protocol} connection established by HOST:${req.headers["host"]}`);
	try {
		res.render("index");
	} catch {
		logger.error(`Server crashed. Failed to serve index page to HOST:${req.headers["host"]}`);
		res.send(res.json({
			"error": "500",
			"type": "Internal Server Error",
			"desc": "Index file crashed during rendering"
		}))
	}
});

app.get("/viewpdf", (req, res) => {
	logger.info(`${req.protocol} connection established by HOST:${req.headers["host"]}`);
	try {
		res.render("viewpdf");
	} catch {
		logger.error(`Server crashed. Failed to serve index page to HOST:${req.headers["host"]}`);
		res.send(res.json({
			"error": "500",
			"type": "Internal Server Error",
			"desc": "Index file crashed during rendering"
		}))
	}
});

app.post("/apis/internship", (req, res) => {
	logger.info(`Access requested to get internship data`);
	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(data.setting_data["interships"]));
});

app.post("/apis/resume", (req, res) => {
	logger.info(`Access requested to get internship data`);
	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(data.setting_data["resume"]));
});

app.post("/apis/texts", (req, res) => {
	logger.info(`Access requested to get text data`);
	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(data.setting_data["statements"]));
});

app.post("/apis/education", (req, res) => {
	logger.info(`Access requested to get text data`);
	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(data.setting_data["education"]));
});

app.post("/apis/projects", (req, res) => {
	logger.info(`Access requested to get project data`);
	res.header("Content-Type", "application/json");
	res.send(JSON.stringify(data.setting_data["projects"]));
});

app.get("debug/system/logs", (req, res) => {
	logger.info(`Access requested to get system logs`);
	res.header("Content-Type", "text/plain");
	res.send(fs.readFileSync("system.log"));
});

app.listen(port, () => {
	logger.info(`Portifolio app is online and is active at PORT:${port}`);
});

app.get("*", (req, res) => {
	logger.error(`Access requested denied due to Error 404 to ${req.originalUrl}`);
	res.status(404).redirect(`${req.protocol + "://" + req.get("host")}/error/404.html`);
});

app.post("*", (req, res) => {
	logger.error(`Access requested denied due to Error 404`);
	res.send(
		res.json({
			"error": 404,
			"access-request": "denied",
			"desc": "Requested file not found",
		})
	);
});