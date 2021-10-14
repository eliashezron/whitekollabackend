import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/user.js'
import posts from './data/trending.js'
import User from './models/UserModel.js'
import Post from './models/PostsModel.js'
import Categories from './models/CategoriesModel.js'
import connectDB from './config/db.js'
import categories from './data/CategoryColors.js'

dotenv.config()
connectDB()

const importData = async()=>{
    try{
        await User.deleteMany()
        await Post.deleteMany()
        await Categories.deleteMany()

        await Categories.insertMany(categories)
        const createdUsers =  await User.insertMany(users)

        const adminAuthor = createdUsers[0]._id
        const adminuserAuthor = createdUsers[0].userName

        const samplePosts = posts.map(post => 
            ({...post, author:adminAuthor, userAuthor:adminuserAuthor})
        )
        await Post.insertMany(samplePosts)

        console.log('Data Imported'.green.inverse)
        process.exit()

    }catch(error){
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async() =>{
    try{
        await User.deleteMany()
        await Post.deleteMany()
        await Categories.deleteMany()

        console.log('data Destroyed!'.red.inverse)
        process.exit()
    }catch(error){
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if(process.argv[2] === '-d'){
    destroyData()
}else{
    importData()
}