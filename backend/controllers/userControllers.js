import User from "../models/UserModel.js"
import Post from "../models/PostsModel.js"
import asynchandler from 'express-async-handler'
import generateToken from "../utils/generateToken.js"
import Categories from "../models/CategoriesModel.js"
// get all users
// route '/'
// access private/admin
// method get

const getAllUsers = asynchandler(async(req, res) =>{
    const userName = req.query.userName
    let users;
    if(userName){
        users = await User.findOne({userName}).select("-password").lean()
    }else{
         users = await User.find({})
    }
    // users = users.filter((user) => user._id.toString() !== req.user.id)
    res.status(200).json(users)
}) 

const getSingleUserbyusername = asynchandler(async(req, res)=>{
    try {
        
        const user = await User.findOne({userName:req.params.userName}).select('-password')
       let isFollowing = false;
        if(user.followers.includes(req.user._id)){
            isFollowing = true
        }
        res.status(200).json(isFollowing)
    } catch (error) {
        res.status(400).json(error)
    }

})

// get top users
const getMostFollowedUsers = asynchandler(async(req, res)=>{
    // const count = User.countDocuments({})
    // const random = Math.floor(Math.random()* count)
    // const topUsers = await User.findOne().skip(random)
    const topUsers = await User.find({}).sort({followers: -1}).limit(4)
    res.json(topUsers)
})

const randomUsers = asynchandler(async(req,res)=>{
   const users = await User.find({}).limit(5) 

   const Randomizer = (array)=>{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
   const randomusers = Randomizer(users)
   res.json(randomusers)
})
// get single user
// route '/profile'
// method get
const getSingleUser = asynchandler(async(req, res) => {
    const user = await User.findById(req.user._id)
    if(user){
        res.status(200)
        res.json(user)
    }else{
        res.status(404)
        throw new Error('User not found')
    }

})
// get single user
// route '/:id'
// method get
const adminGetSingleUser = asynchandler(async(req, res) => {
    const  user = await User.findById(req.params.id).select('-password')
    if(user){
        res.status(200).json(user)
    }else{
        res.status(404)
        throw new Error('User not found')
    }

})

// update user by admin
// route '/:id
// method put
const updateUserByAdmin = asynchandler(async(req, res)=>{
   const user = await User.findById(req.params.id)

    if(user){

        user.isAdmin = req.body.isAdmin || user.isAdmin
        
         const updatedUser = await user.save()
            res.status(200).json({
            _id:updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profilePicture:updatedUser.profilePicture,
            token:generateToken(updatedUser._id),
            followers:updatedUser.followers,
            followings:updatedUser.followings,
            preferedCategories:updatedUser.preferedCategories,
            readingList:updatedUser.readingList,
            drafts:updatedUser.drafts
    })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})
// update user profile
// route '/profile'
// method put
const updateUserProfile = asynchandler(async(req, res)=>{
    const user = await User.findById(req.user._id)

    if(user){
        user.userName = req.body.userName || user.userName
        user.email = req.body.email || user.email 
        user.userBio = req.body.userBio || user.userBio
        user.profession = req.body.profession || user.profession
        user.workplace = req.body.workplace || user.workplace
        user.profilePicture = req.body.profilePicture || user.profilePicture
        user.coverPhoto = req.body.coverPhoto || user.coverPhoto
        if(req.body.password){
            user.password = req.body.password
        }
         const updatedUser = await user.save()
        res.status(200)
        res.json({
            _id:updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            profilePicture:user.profilePicture,
            coverPhoto:user.coverPhoto,
            profession:user.profession,
            workplace:user.workplace,
            userBio:user.userBio,
            token:generateToken(updatedUser._id)
    })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

// delete user
// route '/:id'
// method delete
const deleteUser = asynchandler(async(req, res)=>{
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message:'user removed'})
    }else{
        res.status(404)
        throw new Error ('user not found')
    }
})

// follow a user
// route '/:id/follow
// method put
const followUser = asynchandler(async(req, res)=>{
    if(req.user._id !== req.body.userId){
        try{
            const currentUser = await User.findById(req.user._id)
            const user = await User.findById(req.body.userId)
            if(!currentUser.followings.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.user._id}})
                await currentUser.updateOne({$push:{followings:req.body.userId}})
                res.status(200).json(
                 {   _id:currentUser._id,
                    userName: currentUser.userName,
                    email: currentUser.email,
                    isAdmin: currentUser.isAdmin,
                    profilePicture:currentUser.profilePicture,
                    token:generateToken(currentUser._id),
                    followers:currentUser.followers,
                    followings:currentUser.followings,
                    preferedCategories:currentUser.preferedCategories,
                    readingList:currentUser.readingList,
                    drafts:currentUser.drafts}
                )
            }else{
                await user.updateOne({$pull:{followers:req.user._id}})
                await currentUser.updateOne({$pull:{followings:req.body.userId}})
                res.status(403).json(
                   { _id:currentUser._id,
                    userName: currentUser.userName,
                    email: currentUser.email,
                    isAdmin: currentUser.isAdmin,
                    profilePicture:currentUser.profilePicture,
                    token:generateToken(currentUser._id),
                    followers:currentUser.followers,
                    followings:currentUser.followings,
                    preferedCategories:currentUser.preferedCategories,
                    readingList:currentUser.readingList,
                    drafts:currentUser.drafts}
                )
            }
        }catch(error){
            res.status(500).json(error)
            res.send(error)
        }
    }else{
        res.status(403).json('you can not follow your self')
    }
})




// follow a user
// route '/:id/follow
// method put
const followCategory = asynchandler(async(req, res)=>{
    if(req.user._id){
        try{
            const category = await Categories.findById(req.body.categoryId)
            const user = await User.findById(req.user._id)
            if(!user.preferedCategories.includes(req.body.categoryId)){
                await user.updateOne({$push:{preferedCategories:req.body.categoryId}})
                await category.updateOne({$push:{followers:req.user._id}})
                res.status(200).json('category has been followed')
            }else{
                await user.updateOne({$pull:{preferedCategories:req.body.categoryId}})
                await category.updateOne({$pull:{followers:req.user._id}})
                res.status(403).json('category has been unfollowed')
            }
        }catch(error){
            res.status(500).json(error)
        }
    }else{
        res.status(403).json('login to follow a category')
    }
})
// view followers
// route '/friends/:id
// method get
const viewFollowings = asynchandler(async(req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const followers = await Promise.all(
            user.followings.map(async(x)=>{
                return await User.findById(x)
            })
        )
        let followersList = []
        followers.map((follower)=>{
            const{_id, userName, userBio, profilePicture} = follower
            followersList.push({_id, userName, userBio, profilePicture})
        })
        res.status(200).json(followersList)
    } catch (error) {
        res.status(500).json(error)
    }
})
// view followers
// route '/friends/:id
// method get
const viewFollowers = asynchandler(async(req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const followings = await Promise.all(
            user.followers.map(async(x)=>{return await User.findById(x)})
        )

        let followingsList = []
        followings.map((following)=>{
            const{_id, userName,userBio, profilePicture} = following
            followingsList.push({_id, userBio, userName, profilePicture})
        })
        res.status(200).json(followingsList)
    } catch (error) {
        res.status(500).json(error)
    }
})
// view followers
// route '/profile/follwers
// method get
const viewFollowingsProfile = asynchandler(async(req, res)=>{
    try {
        const user = await User.findById(req.user._id)
        const followers = await Promise.all(
            user.followings.map(async(x)=>{
                return await User.findById(x)
            })
        )
        let followersList = []
        followers.map((follower)=>{
            const{_id, userName, userBio, profilePicture} = follower
            followersList.push({_id, userName,userBio, profilePicture})
        })
        res.status(200).json(followersList)
    } catch (error) {
        res.status(500).json(error)
    }
})
// view followers
// route '/friends/:id
// method get
const viewFollowersProfile = asynchandler(async(req, res)=>{
    try {
        const user = await User.findById(req.user._id)
        const followings = await Promise.all(
            user.followers.map(async(x)=>{return await User.findById(x)})
        )

        let followingsList = []
        followings.map((following)=>{
            const{_id, userName, profilePicture} = following
            followingsList.push({_id, userBio, userName, profilePicture})
        })
        res.status(200).json(followingsList)
    } catch (error) {
        res.status(500).json(error)
    }
})
// add to reading list
const userReadingList = asynchandler(async(req, res)=>{
        try{
            const post = await Post.findById(req.body.postId)
            const user = await User.findById(req.user._id)
            if(!user.readingList.includes(req.body.postId)){
                await user.updateOne({$push:{readingList:req.body.postId}})
                await post.updateOne({$push:{saved:req.user._id}})
                res.status(200).json('post has been added to reading list')
            }else{
                await user.updateOne({$pull:{readingList:req.body.postId}})
                await post.updateOne({$pull:{saved:req.user._id}})
                res.status(403).json('post has been removed from reading list')
            }
        }catch(error){
            res.status(500).json(error)
        }
    
})
// get reading list
const getReadingList = asynchandler(async(req, res)=>{
    try {
        const user = await User.findById(req.user._id)
        const posts = await Promise.all(
            user.readingList.map(async(x)=>{return await Post.findById(x)})
        )

        let readingList = []
        posts.map((post)=>{
            readingList.push(post)
        })
        res.status(200).json(readingList)
    } catch (error) {
        res.status(500).json(error)
    }
    
})

export {getAllUsers,
        getReadingList,
        followCategory,
        userReadingList,
        getSingleUser,
        updateUserByAdmin,
        updateUserProfile,
        deleteUser,
        adminGetSingleUser,
        viewFollowers,
        viewFollowings,
        viewFollowersProfile,
        viewFollowingsProfile,
        getMostFollowedUsers,
        randomUsers, getSingleUserbyusername,
        followUser}