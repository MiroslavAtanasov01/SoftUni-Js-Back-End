const controllers = require('../controllers')
const router = require('express').Router()
const auth = require('../utils/auth')

router.get('/', controllers.home.get.home)
router.get('/sortDate', controllers.home.get.sortDate)
router.get('/sortLike', controllers.home.get.sortLike)

module.exports = router