const { check } = require('express-validator')

exports.addCommentValidator = () => {
    return [
        check('userName').notEmpty().withMessage("Name is a compulsory field"),
        check('userId').notEmpty().withMessage("User id is a compulsory field"),
        check('content').notEmpty().withMessage("Content is a compulsory field"),
    ]
};