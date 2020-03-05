const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secret = require('../config').secret
const getUserFromTokenOrError = require('./helpers').getUserFromTokenOrError

router.use('/api', validateUser, require('./api'))
// router.user('/api', validateUser, require('./api/tags'))
router.use('/auth', require('./auth'))
// router.use('/accounts', require('./accounts'))
// router.use('/contacts', require('./contacts'))

function validateUser(req, res, next)
{
   getUserFromTokenOrError(req, res, next)
   next()
}

module.exports = router;
