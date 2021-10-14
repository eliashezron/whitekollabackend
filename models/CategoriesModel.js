import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema({
    category:{
        type:String,
        unique:true,
        required: true
    }, 
    color:{
        type: String,
        required: true,
        default:'white'
    },
    followers:{
        type:Array,
        default:[],
    }
},{
    timestamps: true
})

const Categories = mongoose.model('Categories', categoriesSchema)

export default Categories