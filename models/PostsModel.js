import mongoose from 'mongoose'
const commentSchema = mongoose.Schema({
    userName:{type:String, required:true},
    comment:{type:String, required:true},
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
},{timestamps:true})

const postSchema = mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    userAuthor:{
        type:String,
        required:true
    },
    title:{
        type: String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required: true,
        min: 150
    },
    image:{
        type:String,
        required: false,
    },
    category:{
        type:Array,
        required:true
    },
    comments:[commentSchema],
    numberOfComments:{
        type: Number,
        required:true,
        default:0
    },
    likes:{
        type: Array,
        default:[]
    },
    saved:{
        type:Array,
        default:[]
    },
    submitted:{
        type:Boolean,
        default:false
    },
    published:{
        type:Boolean,
        default:false
    }
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema)

export default Post