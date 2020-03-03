const mongoose = require('mongoose')
const router = require('express').Router()
const User = mongoose.model('User')

router.post('/login', function (req, res) {
    var { username, password } = req.body

    User.findOne({ username: username }, function (err, user) {

        if (err) {
            next(err)
        }
        if (!user || !user.validPassword(password)) res.json({ success:true, error: "Username or password Invalid" })
        else {

            let token = user.generateJWT()
            res.json({
                success:true,
                token: token,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
                contact_ids: user.contact_ids,
                profile_picture: user.profile_picture,
                registered_tags: user.registered_tags,
                })
            }
        }
    )


})

router.post('/register', function (req, res, next) {

    var { firstname, lastname, username, email, password } = req.body

    var newUser = new User(req.body)
    newUser.setPassword(password)
    console.log(newUser)
    newUser.save().then(function () {
        return res.json({success:true})
    }).catch(next)


})

module.exports = router