const nodemailer = require("nodemailer")

const mailHelper = async(option) => {

  

    var transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_HOST_PORT,
        service: process.env.NODEMAILER_SERVICE,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      });

      const message = {
        from: "Invento23 inventogec@gmail.com",
        to: option.email,
        subject: option.subject,
        html: `<p>Registration to Invento 23 was successful.</p>`,
      }


      await transporter.sendMail(message)
}

module.exports = mailHelper