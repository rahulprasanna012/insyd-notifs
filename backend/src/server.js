const express=require("express")
const app =express()
const dotenv=require("dotenv")

const cors=require("cors")
const connectDB = require("./config/db")

app.use(cors())
dotenv.config();



connectDB()



const PORT =process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server Running in port ${PORT}`);
})
