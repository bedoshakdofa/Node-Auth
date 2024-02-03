const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide user name"],
        maxlength: 20,
        minlength: 1,
    },
    email: {
        type: String,
        requried: [true, "please provide yor email"],
        validate: [
            validator.isEmail,
            "plesae write your email in proper format ",
        ],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minlength: [8, "password must not be less than 8 charcter"],
        select: false,
    },
    passwordConfirm: {
        type: String,
        requried: [true, "please renter your password"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
        },
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

UserSchema.methods.CheckPassword = async function (candidatePass, userPass) {
    return await bcrypt.compare(candidatePass, userPass);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
