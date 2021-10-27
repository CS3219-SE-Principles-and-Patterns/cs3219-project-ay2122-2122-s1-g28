import { check } from "express-validator";

function userNameValidator() {
	return [
		check("name").notEmpty().withMessage("Name is a compulsory field"),
	];
}

function userEmailValidator() {
	return [
		check("email")
			.custom((value) => {
				const domain = value.substring(value.lastIndexOf("@") + 1);
				if (domain === "u.nus.edu") {
					return true;
				} else {
					return false;
				}
			})
			.withMessage("Email should be in the form of @u.nus.edu"),
	];
}

function userPasswordValidator() {
	return [
		check("password").isStrongPassword().withMessage("Password should be of minimum length 8, consists of 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character"),
	];
}

function userRegisterValidator() {
	return [
		userNameValidator(),
		userEmailValidator(),
		userPasswordValidator(),
	];
}

function userLoginValidator() {
	return [
		userEmailValidator(),
		userPasswordValidator(),
	];
}

function userUpdateValidator() {
	return [
		check("password").optional().isStrongPassword().withMessage("Password should be of minimum length 8, consists of 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character"),
	];
}

module.exports = { userRegisterValidator, userLoginValidator, userUpdateValidator };
