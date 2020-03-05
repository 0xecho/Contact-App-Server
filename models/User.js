const mongoose = require('mongoose')
const mongooseUnique = require('mongoose-unique-validator')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret

const UserSchema = new mongoose.Schema({  
    firstname : {type: String, required: [true, "can't be empty!"],match:[/^[a-zA-Z']+$/, 'must on only contain lowercase or uppercase characters!']},
    lastname : {type: String, required: [true, "can't be empty!"],match:[/^[a-zA-Z']+$/, 'must on only contain lowercase or uppercase characters!']},
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be empty!"],match:[/^[a-zA-Z0-9]+$/, 'must on only contain characters and numbers!']},
    email : {type: String, lowercase: true, unique: true, required: [true, "can't be empty!"],match:[/\S+@\S+\.\S+/, 'must on only contain lowercase or uppercase characters!']},
    password_hash : String,
    password_salt: String,
    profile_picture : String,
    registered_tags : [{type: mongoose.Schema.Types.ObjectId, ref:"Tag"}]
}, {timestamps: true})

const crypto = require("crypto")

UserSchema.plugin(mongooseUnique, {message: 'is taken.'})

UserSchema.methods.setPassword = function(password) {
    this.password_salt = crypto.randomBytes(16).toString('hex')
    this.password_hash = crypto.pbkdf2Sync(password, this.password_salt, 1000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validPassword = function(password) {
    this.checkPass = crypto.pbkdf2Sync(password, this.password_salt, 1000, 512, 'sha512').toString('hex')
    return this.password_hash === this.checkPass
}

UserSchema.methods.generateJWT = function() {
    var now = new Date()
    var expiry_date = new Date(now)
    expiry_date.setDate(now.getDate() + 10)
    
    return jwt.sign({
        id : this._id,
        username: this.username,
        exp: parseInt(expiry_date.getTime()/1000)
        
    }, secret)
    
}

module.export = mongoose.model('User', UserSchema)