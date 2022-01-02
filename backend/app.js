const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
const PORT = 8000

require('./models/user')

app.use(express.json())

app.use(require('./routes/auth'))


const customMiddleware = (req,res,next) =>{
    console.log("Middleware executed")
    next()
}

mongoose.connect(MONGOURI)

mongoose.connection.on('connected', () =>{
    console.log('connected')
})

mongoose.connection.on('error', (e) =>{
    console.log('error')
})

app.use(customMiddleware)

app.get('/',(req,res,next)=>{
    res.send("hello world")
})

app.get('/about',customMiddleware,(req, res) =>{
    res.send('About')
})

app.listen(PORT,()=>{
    console.log("Server run",PORT)
})