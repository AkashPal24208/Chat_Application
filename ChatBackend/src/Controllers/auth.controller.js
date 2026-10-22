const UserDataModel = require('../Models/UserData');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const blackListModel = require('../Models/BlackList');

/**
 * @route GET/api/auth/register
 * @description register controller 
 */
async function registerUserController(req, res) {
    console.log("BODY:", req.body);
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide all details"
            });
        }

        const isExist = await UserDataModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isExist) {
            return res.status(400).json({
                message: "Already registered"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await UserDataModel.create({
            username,
            email,
            password: hash
        });  

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        // const userObject = user.toObject()
        // delete userObject.password

        return res.status(200).json({
            message: "Registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log("🔥 REGISTER ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
}
/**
 * @route GET/api/auth/login 
 * @description login controller 
 * 
 */
async function getLoginUserController(req,res){
    const {email,password} = req.body;
     
    const user = await UserDataModel.findOne({email})

    if(!user){
       return res.status(400).json({
            message:"user does not exist"
        })
    }

    const ispassword = await bcrypt.compare(password,user.password)

    if(!ispassword){
        return res.status(400).json({
            message:"Inavlid password..."
        })
    }

    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    // now set token to cookies 
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
});

    return res.status(200).json({
        message:"User LoggedIN successfully..",
        token,
        user:{
            id:user._id,
            user:user.username,
            emai:user.email
        }
    })
}

/**
 * @route GET/api/auth/logout
 * @description logout controller , no argument is get passed , token ko black list main add kar dena 
 *  and cookies ko clear karte hain .
 */

async function logoutController(req, res) {
    try {
        const token = req.cookies.token;

        if (token) {
            await blackListModel.create({ token });
        }

        res.clearCookie("token");

        return res.status(200).json({
            message: "user loggedOut successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
}

/**
 * @route GET/api/auth/get-me
 * @description to get user data from backend with the help of token
 */

async function getmeController(req,res){
    const user = await UserDataModel.findById(req.user.id)

    return res.status(200).json({
        message:"user fetched successfully",
       
        user:{
            id:user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {getLoginUserController,registerUserController,logoutController,getmeController}