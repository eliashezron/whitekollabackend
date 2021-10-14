import express from 'express'
import { loginUser, registerUser } from '../controllers/authContollers.js'
import { adminGetSingleUser,
            deleteUser,
            followCategory, 
            followUser,
            getAllUsers,
            getMostFollowedUsers,
            getReadingList,
            getSingleUser,
            randomUsers,
            updateUserByAdmin,
            updateUserProfile,
            userReadingList, 
            viewFollowers,
            viewFollowersProfile,
            viewFollowingsProfile,
            viewFollowings,
            getSingleUserbyusername} from '../controllers/userControllers.js'
import {protect, admin} from '../middleware/authMiddeleware.js'


const router = express.Router()
router.post('/login', loginUser)
router.post('/register', registerUser)
router.get('/', getAllUsers)
router.get('/random', randomUsers)
router.get('/topusers', getMostFollowedUsers)
router.get('/profile', protect, getSingleUser)
router.get('/profile/followers',  viewFollowersProfile)
router.get('/profile/followings',  viewFollowingsProfile)
router.get('/profile/readinglist', protect, getReadingList)
router.get('/:userName', getSingleUserbyusername)
router.get('/:id/followers',  viewFollowers)
router.get('/:id/followings',  viewFollowings)
router.get('/:id', protect, adminGetSingleUser)
router.put('/profile', protect, updateUserProfile)
router.put('/profile/readinglist', protect, userReadingList)
router.put('/profile/follow', protect, followUser)
router.put('/profile/followcategory', protect, followCategory)
router.delete('/:id', protect, admin, deleteUser)

export default router