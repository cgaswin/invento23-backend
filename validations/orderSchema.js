const joi = require("joi")

module.exports = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.number().required(),
  referalCode: joi.string(),
  college: joi.string(),
  year: joi.number(),
  orderEvents: joi
    .array()
    .optional()
    .items(
      joi.object({
        event: joi.string().required(),
        participants: joi.array().items(joi.string()).optional(),
      })
    )
    .optional(),
  paymentInfo: joi.object({
    id: joi.string().required(),
  }),
  totalAmount: joi.number().required(),
  paymentProof: joi.any(),
})
