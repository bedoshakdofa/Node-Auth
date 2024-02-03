const express = require("express");
const AuthRouter = require("./routes/UserRoute");
const app = express();
app.use(express.json());

app.use("/api/v1/user", AuthRouter);

app.all("*", (req, res, next) => {
    return next(Error(`this url : ${req.originalUrl} is not found`));
});

app.use((err, req, res, next) => {
    res.status(400).json({
        status: "fail",
        message: err.message,
    });
});

module.exports = app;
