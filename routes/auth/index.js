const router = require('express').Router()
var User = require('../../models/User')

router.post('/login', function(req,res)  {
    res.send("Login Page")
})

router.post('/register', function(req,res)  {
    res.send("Register Page")
})

module.exports = router