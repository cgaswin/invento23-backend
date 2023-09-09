const sgMail = require("@sendgrid/mail")
const fs = require("fs").promises

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const mailHelper = async (order, event, type) => {
  console.log("inside mail helper")
  const { email, name } = order
  const {
    name: eventName,
    category,
    date,
    contactName,
    contactNumber,
    time,
  } = event

  //converting date to readable format : month date
  const options = { month: "long", day: "numeric" }
  const dateString = date.toLocaleDateString("en-IN", options)

  // const formattedTime = time.toLocaleString("en-US", {
  //   hour: "numeric",
  //   minute: "numeric",
  //   hour12: true,
  //   timeZone: "UTC"
  // });

  // const {rules} = event
  // let rulesHtml = "";

  // for (let i =0 ; i < rules.length; i++) {
  //   rulesHtml += `<ul style="padding-top: 10px; padding-bottom: 10px;">
  //   <li>${rules[i]}</li>
  //   </ul>`
  // }

  if (type === "unverified") {
    try {
      // Read HTML template file
      mailTemplate = await fs.readFile(__dirname + "/index.html", "utf-8")
      console.log("html file read successful")
    } catch (error) {
      console.error("Error reading HTML template file:", error)
      return "error"
    }
    const messageHtml = mailTemplate
      .replace("{name}", name)
      .replace("{event}", eventName)
    // .replace("{{date}}", dateString)
    // .replace("{contactNumber}",contactNumber)
    // .replace("{rules}", rulesHtml);
    // .replace("{time}",formattedTime)

    // Send email with the modified HTML template
    const message = {
      to: email,
      from: {
        name: "Invento",
        email: process.env.EMAIL,
      },
      subject: `Registration Received | INVENTO'23`,
      html: messageHtml,
    }

    try {
      await sgMail.send(message)
      console.log("email sent")
    } catch (error) {
      console.log(error)
    }
  } else if (type === "verified") {
    try {
      // Read HTML template file
      mailTemplate = await fs.readFile(__dirname + "/confirm.html", "utf-8")
      console.log("html file read successful")
    } catch (error) {
      console.error("Error reading HTML template file:", error)
      return "error"
    }
    const messageHtml = mailTemplate
      .replace("{name}", name)
      .replace("{event}", eventName)
    // .replace("{{date}}", dateString)
    // .replace("{contactNumber}",contactNumber)
    // .replace("{rules}", rulesHtml);
    // .replace("{time}",formattedTime)

    // Send email with the modified HTML template
    const message = {
      to: email,
      from: {
        name: "Invento",
        email: process.env.EMAIL,
      },
      subject: `Payment Verified : ${eventName} | INVENTO'23`,
      html: messageHtml,
    }

    try {
      await sgMail.send(message)
      console.log("email sent")
    } catch (error) {
      console.log(error)
    }
  }
}

async function sendMailForVerifiedProshow(mailparams) {
  const { email, eventName, uniqueId, eventDate } = mailparams

  if (!email || !eventName || !uniqueId || !eventDate) {
    throw new Error("Invalid mail params")
  }

  const options = { month: "long", day: "numeric" }
  const dateString =
    eventName.toLowerCase() === "combo"
      ? "15/09/23 ,16/09/23"
      : eventDate.toLocaleDateString("en-IN", options)

  const message = {
    to: email,
    from: {
      name: "Invento",
      email: process.env.EMAIL,
    },
    subject: `Payment Verified - ProShow -${eventName} | INVENTO'23`,
  }

  let mailTemplate = ""

  try {
    mailTemplate = await fs.readFile(__dirname + "/proshow.html", "utf-8")
  } catch (error) {
    console.error("Error reading HTML template file:", error)
    return "error"
  }

  const messageHtml = mailTemplate
    .replace("{date}", dateString)
    .replace("{event}", eventName)
    .replace("{code}", uniqueId)

  message.html = messageHtml

  try {
    await sgMail.send(message)
    console.log("email sent")
  } catch (error) {
    console.error("Error sending mail")
    console.log(error)
  }
}

module.exports = { mailHelper, sendMailForVerifiedProshow }
