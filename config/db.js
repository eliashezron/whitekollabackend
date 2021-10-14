import  mongoose  from "mongoose";

const connectDB = async() =>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify:false
        })
        console.log(`MongoDB connected: ${connection.connection.host}`.cyan.underline)

    }catch(error){
        console.error(`ERROR: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

export default connectDB