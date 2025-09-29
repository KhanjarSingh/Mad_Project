const express = require('express')
const process = require('process')
const dotenv = require('dotenv')
const {PrismaClient} = require('./src/generated/prisma')
const { error } = require('console')
dotenv.config()


const app = express()
const prisma = new PrismaClient()
app.get('/',(req,res)=>{
    res.status(200).send("Server is Running Perfectly")
})

// User API Routes

app.post('/users', async(req,res)=>{
    const {name,email,password,phone} = req.body

    if (!name || !email || !password){
        return res.status(401).json({ error: "All Fields are required" })
    }

    const checkEmail = await prisma.users.findFirst({
        where:{
            email:email
        }
    })
    if (checkEmail){
        return res.status(401).json({error:"The Email Already Exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const result = await prisma.users.create({
        data:{
            name:name,
            email:email,
            password:hashedPassword,
            phone:phone,
        }
    })
    
    res.status(201).json({
        id:result.id,
        name:result.name,
        email:result.email,
        password:result.password,
        phone:result.phone
    })
})


app.listen(process.env.PORT,()=>{
    console.log(` Server is running at http://localhost:${process.env.PORT}`)
})

