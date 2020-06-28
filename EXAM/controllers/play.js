const config = require('../config/config')
const models = require('../models')

module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('createPlay', {
                title: 'Create play',
            })
        },
        details: async (req, res, next) => {
            const play = await models.Play.findById(req.params.id).lean()

            res.render('detailsPlay', {
                title: 'Details play',
                isCreator: req.user.id.toString() === play.creatorId.toString(),
                isAlreadyLiked: play.usersLiked.toString().includes(req.user.id.toString()),
                ...play,
            })
        },
        delete: async (req, res, next) => {
            await models.Play.findByIdAndRemove(req.params.id).lean()
            // await models.User.findByIdAndRemove(req.params.id).lean() 
            res.redirect('/home')
        },
        edit: async (req, res, next) => {
            const play = await models.Play.findById(req.params.id).lean()

            res.render('editPlay', {
                title: 'Edit play',
                ...play,
            })
        },
        like: async (req, res, next) => {
            console.log(req.params.id);
            console.log(req.user.id);

            await models.Play.findByIdAndUpdate(req.params.id, {
                $addToSet: {
                    usersLiked: [req.user.id],
                },
            });

            await models.User.findByIdAndUpdate(req.user.id, {
                $addToSet: {
                    likedPlays: [req.params.id],
                },
            })
            res.redirect(`/play/details/${req.params.id}`)
        }
    },
    post: {
        create: async (req, res, next) => {
            const { title, description, imageUrl, isPublic } = req.body
            const createdAt = new Date()

            try {
                const data = await models.Play.create({
                    title, description, imageUrl, isPublic: isPublic === 'on', createdAt, creatorId: req.user.id
                })

                res.redirect('/home');
            } catch (err) {
                if (err.name === 'MongoError') {
                    return res.render('createPlay', {
                        error: 'Title is already taken!'
                    })
                } else
                    if (err.name === 'ValidationError' || err.name === 'MongooseError') {
                        const errorMessages = Object.entries(err.errors).map(e => {
                            return e[1].message
                        })
                        return res.render('createPlay', {
                            error: errorMessages
                        })
                    }
            }

        },
        edit: async (req, res, next) => {
            const { title, description, imageUrl, isPublic } = req.body


            if (!title || !description || !imageUrl) {
                const play = await models.Play.findById(req.params.id).lean()
                return res.render('editPlay', {
                    error: 'You can not have empty fields', ...play
                })
            }
            await models.Play.findByIdAndUpdate(
                req.params.id, { title, description, imageUrl, isPublic: isPublic === 'on' }, { runValidators: true }
            )
            res.redirect(`/play/details/${req.params.id}`)
        }
    }
}