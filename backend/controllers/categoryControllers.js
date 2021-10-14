import asynchandler from 'express-async-handler'
import Categories from '../models/CategoriesModel.js'

// getAllCategories
const getAllCategories = asynchandler(async(req, res)=>{
    const category = req.query.category

    let categories
    if(category){
        categories = await Categories.findOne({category})
    }else{
        categories = await Categories.find({})
    }
    res.status(200).json(categories)
})


// create category
// method post
// route /create
const createCategory = asynchandler(async(req, res)=>{
    const {category, color} = req.body
    const categoryExists = await Categories.findOne({category, color})

    if(categoryExists){
        res.status(200).json({message:'category or color already exists'})
    }
    const newCategory = await Categories.create({category, color})
    if(newCategory){
        res.status(200).json(newCategory)
    }else{
        res.status(400)
        res.json({message:'failed to create category'})
    }
})

const deleteCategory = asynchandler(async(req,res)=>{
    const category = await Categories.findById(req.params.id)
    if(category){
        res.status(200).json({message:'category deleted succesfully'})
    }else{
        res.status(400).json({message:'category not found'})
    }
})

export {getAllCategories}