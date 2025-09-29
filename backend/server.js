const express = require('express')
const process = require('process')
const dotenv = require('dotenv')

dotenv.config()


const app = express()

app.get('/',(req,res)=>{
    res.status(200).send("Server is Running Perfectly")
})


app.listen(process.env.PORT,()=>{
    console.log(` Server is running at http://localhost:${process.env.PORT}`)
})