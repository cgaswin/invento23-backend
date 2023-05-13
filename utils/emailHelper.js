const sgMail = require("@sendgrid/mail")
const fs = require("fs").promises

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mailHelper = async (order, event) => {
  console.log("inside mail helper")
  const { email, name } = order
  const { name: eventName, category, date } = event //TODO:also add contact name and number

//converting date to readable format : month date
const options = { month: 'long', day: 'numeric' }
const dateString = date.toLocaleDateString('en-US', options)


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
      to: email,
      from: {
        name:"Invento",
        email: process.env.EMAIL
      },
      subject: `Confirmation of Registration: ${eventName} at INVENTO'23 - ${dateString} - Government Engineering College Palakkad`,
      html: messageHtml,
    }

    sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  }

  //if(category=="competitions")
}

module.exports = mailHelper