const controllers = require('../controllers')
const router = require('express').Router()
// const auth = require('../utils/auth')

router.get('/', controllers.home.get.home)
router.get('/shared', controllers.home.get.shared)

module.exports = router