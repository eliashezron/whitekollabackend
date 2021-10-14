import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cloudinary from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer'

dotenv.config()

const cloud = cloudinary.v2
const router = express.Router()

cloud.config({
    cloud_name:'eliashezron1',
    api_key:'885519831199467',
    api_secret:'n503NmtCArF3U9LqClV03LPtShM'
})

const storageImage = new CloudinaryStorage({
    cloudinary: cloud,
    params:{
        folder:'postImages',
        public_id:(req, file)=>`${file.originalname.split('.')[0]}-${Date.now()}`
    }
})

const storageProfilePicture = new CloudinaryStorage({
    cloudinary: cloud,
    params:{
        folder:'userProfilePictures',
        public_id:(req, file)=>`${file.originalname.split('.')[0]}-${Date.now()}`,
        transformation:[{width:750, height:200, crop:"limit"}]
    },
})
const storageCoverPhoto = new CloudinaryStorage({
    cloudinary: cloud,
    params:{
        folder:'userCoverPhotos',
        public_id:(req, file)=>`${file.originalname.split('.')[0]}-${Date.now()}`,
        transformation:[{width:750, height:200, crop:"limit"}]
    },
})

function checkFileType(file, cb){
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(extname && mimetype){
        return cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage:storageImage,
    fileFilter:function(req,file,cb){
        checkFileType(file, cb)
    },
})
const uploadPP = multer({
    storage:storageProfilePicture,
    fileFilter:function(req,file,cb){
        checkFileType(file, cb)
    },
})
const uploadPPC = multer({
    storage:storageCoverPhoto,
    fileFilter:function(req,file,cb){
        checkFileType(file, cb)
    },
})

router.post('/', upload.single('image'), (req, res)=>{
    res.send(req.file.path)
})
router.post('/profile', uploadPP.single('image'), (req, res)=>{
    res.send(req.file.path)
})
router.post('/cover', uploadPPC.single('image'), (req, res)=>{
    res.send(req.file.path)
})
export default router