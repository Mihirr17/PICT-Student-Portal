require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const PORT = process.env.PORT || 3500;


connectDB();

// Session middleware setup
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI }), 
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};


app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionOptions));


app.use("/", express.static("public"));


app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/paper", require("./routes/paperRoutes"));
app.use("/notes", require("./routes/notesRoutes"));
app.use("/internal", require("./routes/internalRoutes"));
app.use("/attendance", require("./routes/attendanceRoutes"));
app.use("/time_schedule", require("./routes/timeScheduleRoutes"));
app.use("/teachers", require("./routes/teacherRoutes")); 
app.use("/students", require("./routes/studentRoutes")); 

// 404 handler
app.all("*", (req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "404 Not Found", details: "No paths found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});


app.use(errorHandler);


mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
});


mongoose.connection.on("error", (err) => {
  console.error("MongoDB Connection Error:", err);
  logEvents(
    `${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});


process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  logEvents(`Uncaught Exception: ${err.message}`, "uncaughtException.log");
});
