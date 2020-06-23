const config = require('../config/config')
const models = require('../models')

module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('createCourse', {
                title: 'Create course',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                username: req.user.username
            })
        },
        details: async (req, res, next) => {
            const course = await models.Course.findById(req.params.id).lean()

            res.render('detailsCourse', {
                title: 'Details course',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                isCreator: req.user.id.toString() === course.creatorId.toString(),
                isAlreadyEnrolled: course.users.toString().includes(req.user.id.toString()),
                ...course,
                username: req.user.username
            })
        },
        edit: async (req, res, next) => {
            const course = await models.Course.findById(req.params.id).lean()

            res.render('editCourse', {
                title: 'Edit course',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                ...course,
                username: req.user.username
            })
        },
        delete: async (req, res, next) => {
            await models.Course.findByIdAndRemove(req.params.id).lean()
            res.redirect('/home')
        },
        enroll: async (req, res, next) => {
            await models.Course.findByIdAndUpdate(req.params.id, {
                $addToSet: {
                    users: [req.user.id],
                },
            });
            res.redirect(`/course/details/${req.params.id}`)
        }
    },
    post: {
        create: async (req, res, next) => {
            const { title, description, imageUrl, isPublic } = req.body
            const createdAt = new Date()

            if (title.length < 4) {
                return res.render('createCourse', {
                    error: 'Title should be at least 5 symbols'
                })
            }

            if (description.length < 20) {
                return res.render('createCourse', {
                    error: 'Description should be at least 20 symbols'
                })
            }

            try {
                await models.Course.create({
                    title, description, imageUrl, isPublic: isPublic === 'on', createdAt, creatorId: req.user.id
                })
                res.redirect('/home');
            } catch (error) {
                return res.render('createCourse', {
                    error: 'Image url is not valid'
                })
            }

        },
        edit: async (req, res, next) => {
            const { title, description, imageUrl, isPublic } = req.body
            if (title.length < 4) {
                return res.render('editCourse', {
                    error: 'Title should be at least 5 symbols'
                })
            }

            if (description.length < 20) {
                return res.render('editCourse', {
                    error: 'Description should be at least 20 symbols'
                })
            }

            if (!imageUrl.startsWith('http://') || !imageUrl.startsWith('https://')) {
                return res.render('editCourse', {
                    error: 'Image url is not valid'
                })
            }

            try {
                try {
                    await models.Course.findByIdAndUpdate(req.params.id, { title, description, imageUrl, isPublic: isPublic === 'on' })
                    res.redirect(`/course/details/${req.params.id}`)
                } catch (err) {
                    next(err)
                }
            } catch (error) {
                res.render('editCourse', {
                    title: 'Edit course',
                    isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                    ...course
                })
            }
        },

    }
}