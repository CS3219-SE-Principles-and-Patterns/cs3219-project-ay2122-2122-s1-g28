const { check } = require('express-validator')

exports.userNameValidator = () => {
    return [
        check('name').notEmpty().withMessage("Name is a compulsory field"),
    ]
}

exports.userEmailValidator = () => {
    return [
    check('email').notEmpty().withMessage("Email is a compulsory field"),
    
    check('email')
    .contains("@u.nus.edu")
    .custom(value => {
        const domain = value.substring(value.lastIndexOf("@") + 1)
        if (domain === "u.nus.edu") {
            return true
        } else {
            return false
        }
    })
    .withMessage("Email should be in the form of @u.nus.edu"),
    ]
}

exports.userPasswordValidator = () => {
    return [
        check('password').notEmpty().withMessage("Password is a compulsory field"),
        check('password').isStrongPassword().withMessage("Password should be of minimum length 8, consists of 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character"),
    ]
}

exports.userRegisterValidator = () => {
    return [
       this.userNameValidator(),
       this.userEmailValidator(),
       this.userPasswordValidator(),
    ]
};

exports.userLoginValidator = () => {
    return [
        this.userEmailValidator(),
        this.userPasswordValidator(),
     ]
}
