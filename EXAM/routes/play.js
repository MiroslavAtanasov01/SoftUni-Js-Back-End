const router = require('express').Router()
const controllers = require('../controllers')
const auth = require('../utils/auth')

router.get('/create', auth(), controllers.play.get.create)
router.post('/create', auth(), controllers.play.post.create)

router.get('/edit/:id', auth(), controllers.play.get.edit)
router.post('/edit/:id', auth(), controllers.play.post.edit)

router.get('/details/:id', auth(), controllers.play.get.details)

router.get('/like/:id', auth(), controllers.play.get.like)

router.get('/delete/:id', auth(), controllers.play.get.delete)

module.exports = router