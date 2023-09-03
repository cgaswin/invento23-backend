const joi = require("joi")
const CustomError = require("../errors/customError")

const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(",")
      const err = new CustomError(errorMessage, 400)
      CustomError.respond(err, res)
    }
    next()
  }
}

module.exports = validation
