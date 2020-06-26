const models = require('../models')

module.exports = {
    get: {
        home: async (req, res, next) => {
            res.render('homePage', {
                title: 'Home Page',
            })
        },
        expenses: async (req, res, next) => {
            const expenses = await models.User.findById(req.user.id).populate('expenses').lean()
            let totalAmount = 0;

            for (const da of expenses.expenses) {
                totalAmount += da.total
            }

            res.render('expenses', {
                title: 'Expenses', ...expenses,
            })
        },
    }
}