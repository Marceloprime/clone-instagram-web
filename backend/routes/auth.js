const  express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('user')
const bcrypt = require('bcryptjs')

router.get('/', (req , res) => {
    res.send('hello world')
})

router.post('/signup', (req ,  res) =>{
    const {name , email, password} = req.body
    console.log(name , email, password)

    if(!email || !password || !name){
        return res.status(422).json({error: "please add all the fields"})
    }

    User.findOne({email:email}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error: "user already exists with that email"})
        }

        bcrypt.hash(password,12)
            .then(hashedpassword => {
                const user = new User({
                    "name" : name, 
                    "email" : email, 
                    "password" : hashedpassword
                })
        
                user.save()
                    .then( user => {
                        console.log(user)
                        res.send(req.body)
                    })
                    .catch( error => {
                        console.log(error)
                    })
            })

    })
    .catch( error => {
        console.log(error)
    })
})

router.post('/signin', (req , res) =>{
    const {email, password} = req.body

    if(!email || !password){
        return res
            .status(422)
            .json({error: "please provider email or password"})
    }

    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({error : "Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then( doMatch => {
            if(doMatch){
                res.json({message: "successfully signed in"})
            }
            else{
                return res.status(422).json({error : "Invalid Email or password"})
            }
        })
        .catch( err => {
            console.log(err)
        })
    })

})

module.exports = router