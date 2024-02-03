const User = require("./../models/UserModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_JWT, {
        expiresIn: "1d",
    });
};
exports.sginup = async (req, res, next) => {
    const newuser = await User.create(req.body);
    const token = signToken(newuser._id);
    res.status(200).json({
        status: "success",
        data: {
            user: newuser,
            token,
        },
    });
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(Error("please provide email or password"));
    }
    const currantuser = await User.findOne({ email }).select("+password");
    if (
        !currantuser ||
        !(await currantuser.CheckPassword(password, currantuser.password))
    ) {
        return next(Error("invaild email or password"));
    }
    console.log(currantuser._id);
    const token = signToken(currantuser._id);
    res.status(200).json({
        status: "success",
        data: {
            token,
        },
    });
};

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(Error("your are not logged in "));
    }
    const decode = await promisify(jwt.verify)(token, process.env.SECRET_JWT);

    const currantuser = await User.findById(decode.id);

    if (!currantuser) {
        return next(Error("invaild email or password"));
    }

    req.user = currantuser;
    next();
};

exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
};
