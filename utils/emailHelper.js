const sgMail = require("@sendgrid/mail");
const fs = require("fs").promises;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailHelper = async (order, event) => {
  console.log("inside mail helper");
  const { email, name } = order;
  const {
    name: eventName,
    category,
    date,
    contactName,
    contactNumber,
    time,
  } = event;


  //converting date to readable format : month date
  const options = { month: "long", day: "numeric" };
  const dateString = date.toLocaleDateString("en-US", options);

  // const formattedTime = time.toLocaleString("en-US", {
  //   hour: "numeric",
  //   minute: "numeric",
  //   hour12: true,
  //   timeZone: "UTC"
  // });


  let competition, workshop;

  if (category == "competitions") {
    const {rules} = event
    let rulesHtml = "";

    for (let i =0 ; i < rules.length; i++) {
      rulesHtml += `<ul style="padding-top: 10px; padding-bottom: 10px;">
      <li>${rules[i]}</li>
      </ul>`
    }

    try {
      // Read HTML template file
      competition = await fs.readFile(
        __dirname + "/templates/competition.html",
        "utf-8"
      );
      console.log("html file read successful");
    } catch (error) {
      console.error("Error reading HTML template file:", error);
      return "error";
    }
    const messageHtml = competition
      .replace("{name}", name)
      .replace("{date}", dateString)
      .replace("{eventName}", eventName)
      .replace("{contactNumber}",contactNumber)
      .replace("{rules}", rulesHtml); 
      // .replace("{time}",formattedTime)
      



    // Send email with the modified HTML template
    const message = {
      to: email,
      from: {
        name: "Invento",
        email: process.env.EMAIL,
      },
      subject: `Confirmation of Registration: ${eventName} at INVENTO'23 - ${dateString} - Government Engineering College Palakkad`,
      html: messageHtml,
    };

    try {
      await sgMail.send(message);
      console.log("email sent");
    } catch (error) {
      console.log(error);
    }
  }

  if (category == "workshops") {
    try {
      // Read HTML template file
      workshop = await fs.readFile(
        __dirname + "/templates/workshop.html",
        "utf-8"
      );
      console.log("html file read successful");
    } catch (error) {
      console.error("Error reading HTML template file:", error);
      return "error";
    }
    const messageHtml = workshop
      .replace("{name}", name)
      .replace("{date}", dateString)
      .replace("{eventName}", eventName)
      .replace("{contactName}",contactName)
      .replace("{contactNumber}",contactNumber);
      // .replace("{time}",formattedTime)



    // Send email with the modified HTML template
    const message = {
      to: email,
      from: {
        name: "Invento",
        email: process.env.EMAIL,
      },
      subject: `Registration: ${eventName} at INVENTO'23 - ${dateString} - Government Engineering College Palakkad`,
      html: messageHtml,
    };

    try {
      await sgMail.send(message);
      console.log("email sent");
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = mailHelper;
