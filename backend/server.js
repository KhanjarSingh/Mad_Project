const express = require('express')
const process = require('process')
const dotenv = require('dotenv')

dotenv.config()


const app = express()

app.get('/',(req,res)=>{
    res.status(200).send("Server is Running Perfectly")
})


// app.post('/queues', /* Create queue */);
// app.get('/queues', /* List queues */);
// app.post('/queues/:id/join', /* Join queue */);
// app.delete('/queues/:id/leave', /* Leave queue */);

// // User authentication routes
// app.post('/auth/login', /* Login */);
// app.get('/auth/profile', /* Get profile */);


app.listen(process.env.PORT,()=>{
    console.log(` Server is running at http://localhost:${process.env.PORT}`)
})