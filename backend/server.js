import path from 'path';
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import colors from 'colors'
import cors from 'cors'
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/user&authRoutes.js'
import postRoutes from './routes/postRoute.js' 
import categoryRoutes from './routes/categoryRoutes.js' 
import uploadRoutes from './routes/uploadRoutes.js' 
const __dirname = path.resolve(path.dirname(''));
dotenv.config({path:__dirname + '/.env'})

connectDB()

const app = express()

app.use(express.json())
app.use(cors())

// app.use(cors())
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// const pusher = new Pusher({
//     app_id : "1234215",
//     key : "a09580bb76b0d8c97e6c",
//     secret : "172bb0a44701f8ba18c3",
//     cluster : "mt1",
//     encrypted: true
//   })
//   let comments = [
//     {
//       author: 'robo',
//       message: 'i totally didn\'t see that coming'
//     }
//   ]
  /**
* receive new comment from the client
* update the comments array with the new entry
* publish update to Pusher
*/
// app.post('/api/comment', function (req, res) {
//     const {author, message} = req.body
//     comments = [...[{author, message}], ...comments]
//     pusher.trigger('whitepen', 'new-comment', {author, message})
//     res.sendStatus(200)
//   })
  // send all comments to the requester
  // app.get('/api/comments', function (req, res) {
  //   res.json(comments)
  // })
// app.use(express.static(__dirname + '/public'))
app.use("/public", express.static(path.join(__dirname, "/public")))

// app.get('/', (req, res)=>{
//     res.send('this is the home page')
// })
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// routing
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/upload', uploadRoutes)

// "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
// // deloying to the server
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/client/build')))

    app.get('*', (req, res)=>
     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))
}
// error middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000 

app.listen(PORT,console.log( `app is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold))