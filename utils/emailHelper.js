const nodemailer = require("nodemailer")
const fs = require("fs").promises

const mailHelper = async (order, event) => {
  console.log("inside mail helper")
  console.log(order)
  console.log("----")
  console.log(event)
  const { email, name } = order
  const { name: eventName, category, date } = event //TODO:also add contact name and number

//converting date to readable format : month date
const options = { month: 'long', day: 'numeric' }
const dateString = date.toLocaleDateString('en-US', options)

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  let html
  try {
    // Read HTML template file
    html = await fs.readFile(__dirname + "/templates/workshop.html", "utf-8")
    console.log("html file read successful")
  } catch (error) {
    console.error("Error reading HTML template file:", error)
    return "error"
  }

  if (category == "competitions") { //TODO: change it later to workshop
    // Replace placeholders in the HTML template with actual values
    const messageHtml = html
      .replace("{name}", name)
      .replace("{date}", dateString)
      .replace("{eventName}", eventName)

    // Send email with the modified HTML template
    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: `Confirmation of Registration: ${eventName} at INVENTO'23 - ${dateString} - Government Engineering College Palakkad`,
      html: messageHtml,
    }

    try {
      console.log("sending message")
      await transporter.sendMail(message)
      console.log("Message sent successfully")
      return "message sent"
    } catch (error) {
      console.error("Error sending email:", error)
      return "error"
    }
  }

  //if(category=="competitions")
}

module.exports = mailHelper