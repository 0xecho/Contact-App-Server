const mongoose = require('mongoose')
var router = require('express').Router();


var Contact = mongoose.model('Contact')
var User = mongoose.model('User')
var Tag = mongoose.model('Tag')

// router.get('/')



module.exports = router;
