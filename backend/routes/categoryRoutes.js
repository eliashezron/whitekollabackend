import express from 'express'
import { getAllCategories } from '../controllers/categoryControllers.js'

const router = express.Router()

router.get('/', getAllCategories)



export default router
// get all categories