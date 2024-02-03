const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const db = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(db, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database is connected successfully");
    });

app.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});
