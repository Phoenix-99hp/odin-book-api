require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const mongoDb = process.env.DB_URI || process.env.DEV_DB;
mongoose.connect(mongoDb, {
	useFindAndModify: false,
	useUnifiedTopology: true,
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const app = express();

const corsOptions = {
	origin: process.env.CORS,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes")(app);

app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
