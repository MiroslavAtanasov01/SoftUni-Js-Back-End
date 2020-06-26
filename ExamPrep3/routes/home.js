const controllers = require('../controllers')
const router = require('express').Router()
const auth = require('../utils/auth')

router.get('/', controllers.home.get.home)
router.get('/expenses', auth(), controllers.home.get.expenses)

module.exports = router