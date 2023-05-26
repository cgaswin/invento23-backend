const joi = require("joi")

module.exports = joi.object({
name:joi.string().required(),
email:joi.string().required(),
phone:joi.number().required(),
referalCode:joi.string(),
college:joi.string(),
year:joi.number(),
orderEvents:joi.array().items(joi.object({
event:joi.string().required()
})),
paymentInfo:joi.object({
id:joi.string().required()
}),
totalAmount:joi.number().required()
})