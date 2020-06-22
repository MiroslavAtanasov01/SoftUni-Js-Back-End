const config = require('../config/config')
const models = require('../models')

module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('createCourse', {
                title: 'Create course',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined
            })
        },
        details: async (req, res, next) => {
            const course = await models.Course.findById(req.params.id).lean()

            res.render('detailsCourse', {
                title: 'Details course',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                isCreator: req.user.id.toString() === course.creatorId.toString(),
                ...course
            })
        },
        edit: async (req, res, next) => {
            const course = await models.Course.findById(req.params.id).lean()

            res.render('editCourse', {
                title: 'Edit course',
                isLoggedIn: req.cookies[config.development.cookie] !== undefined,
                ...course
            })
        },
        delete: async (req, res, next) => {
            await models.Course.findByIdAndRemove(req.params.id).lean()
            res.redirect('/home')
        }
    },
    post: {
        create: async (req, res, next) => {
            const { title, description, imageUrl, isPublic } = req.body
            const createdAt = new Date()

            await models.Course.create({
                title, description, imageUrl, isPublic: isPublic === 'on', createdAt, creatorId: req.user.id
            })
            res.redirect('/home');
        },
        edit: async (req, res, next) => {
            const { title, description, imageUrl, isPublic } = req.body
            try {
                await models.Course.findByIdAndUpdate(req.params.id, { title, description, imageUrl, isPublic: isPublic === 'on' })
                res.redirect(`/course/details/${req.params.id}`)
            } catch (err) {
                next(err)
            }
        }
    }
}