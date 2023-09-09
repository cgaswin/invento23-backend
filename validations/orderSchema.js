const joi = require("joi")

module.exports = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.number().required(),
  referalCode: joi.string(),
  college: joi.string(),
  year: joi.number().optional(),
  orderEvents: joi
    .array()
    .optional()
    .items(
      joi.object({
        event: joi.string().required(),
        participants: joi
          .array()
          .items(joi.string().allow(null, ""))
          .optional(),
        name: joi.string().optional(),
        type: joi.string().optional(),
        price: joi.number().optional(),
        ticketCount: joi.number().optional(),
      })
    )
    .optional(),
  // paymentInfo: joi.object({
  //   id: joi.string().required(),
  // }),
  paymenetInfo: joi.any().when("totalAmount", {
    is: 0,
    then: joi.forbidden(),
    otherwise: joi.object({
      id: joi.string().required(),
    }),
  }),
  totalAmount: joi.number().required(),
  // paymentProof: joi.any(),
  paymentProof: joi.any().when("totalAmount", {
    is: 0,
    then: joi.forbidden(),
    otherwise: joi.any(),
  }),
  ticketCount: joi.number().optional(),
})
