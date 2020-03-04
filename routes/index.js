const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secret = require('../config').secret

router.use('/api', validateUser, require('./api'))
router.use('/auth', require('./auth'))
// router.use('/accounts', require('./accounts'))
// router.use('/contacts', require('./contacts'))

function validateUser(req, res, next)
{
    var token; 
    token = req.headers['x-access-token']
    if(token)
    {
        
        try{
            const verify = jwt.verify(token, secret)
            console.log(verify)
            next()
        } catch (err) {
            next(err)
        }
        
        
        
    } else {
        res.json({"success":false,"error":"You need to Login first."})
    }
        
    
}

module.exports = router;
