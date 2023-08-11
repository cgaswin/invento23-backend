const joi = require("joi")
const CustomError = require("../errors/customError")

const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(",")
      return next(new CustomError(errorMessage, 400))
    }
    next()
  }
}

module.exports = validation
