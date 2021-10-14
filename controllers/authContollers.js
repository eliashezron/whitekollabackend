import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";
import asynchandler from 'express-async-handler'

// register user
// route '/register'
// method post

const registerUser = asynchandler(async(req, res) =>{
    
    const {userName, email, password} = req.body

    const userExists = await User.findOne({userName, email})
    if(userExists ){ 
    res.status(400)
    res.status(200).json('user already exists')
        }
    const user = await User.create({userName, email, password})
    if(user){
        res.status(200).json({
        _id:user._id,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePicture:user.profilePicture,
        token:generateToken(user._id),
        followers:user.followers,
        followings:user.followings,
        preferedCategories:user.preferedCategories,
        readingList:user.readingList,
        drafts:user.drafts
    })
    } else {
        res.status(400)
        throw new Error('invalid user information')
    }
})

// login user
// route '/login
// method post
const loginUser = asynchandler(async(req, res)=>{
    
        const {userName, password} = req.body

        const user = await User.findOne({userName})
        
        if(user && (await user.matchPassword(password))){
          res.status(200).json({
            _id:user.id,
            userName: user.userName,
            email: user.email,
            isAdmin: user.isAdmin,
            profilePicture:user.profilePicture,
            token:generateToken(user._id),
            followers:user.followers,
            followings:user.followings,
            preferedCategories:user.preferedCategories,
            readingList:user.readingList,
            drafts:user.drafts
        })   
        }else{
            res.status(401)
            throw new Error('Invalid userName or password')
         }
})

export {loginUser, registerUser}