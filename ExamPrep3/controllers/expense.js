const config = require('../config/config')
const models = require('../models')

module.exports = {
    get: {
        create: (req, res, next) => {
            res.render('createExpense', {
                title: 'Create expense',
            })
        },
        report: async (req, res, next) => {
            const expense = await models.Expense.findById(req.params.id).lean()

            res.render('report', {
                title: 'Report',
                ...expense,
            })
        },
        delete: async (req, res, next) => {
            await models.Expense.findByIdAndRemove(req.params.id).lean()
            res.redirect('/home/expenses')
        },

    },
    post: {
        refill: async (req, res, next) => {
            const { refill } = req.body

            await models.User.findByIdAndUpdate(req.user.id, {
                $inc: { 'amount': +refill },
            });

            res.redirect(`/home/expenses`)
        },
        create: async (req, res, next) => {
            const { merchant, total, category, description, report } = req.body
            const date = new Date()

            try {
                const data = await models.Expense.create({
                    merchant, total, category, description, report: report === 'on', date, creatorId: req.user.id
                })

                await models.User.findByIdAndUpdate(req.user._id, { $addToSet: { expenses: [data.id], }, });

                res.redirect('/home/expenses');
            } catch (err) {
                if (err.name === 'ValidationError' || err.name === 'MongooseError') {
                    const errorMessages = Object.entries(err.errors).map(e => {
                        return e[1].message
                    })
                    return res.render('createExpense', {
                        error: errorMessages
                    })
                }
            }

        },
    }
}