const nodemailer = require("nodemailer")
const fs = require("fs")

const readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
         callback(err);                 
      }
      else {
          callback(null, html);
      }
  });
};

const mailHelper = async(order,event) => {

  let config = {
    service : 'gmail',
    auth : {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
}

let transporter = nodemailer.createTransport(config);

readHTMLFile(__dirname + '/testmail.html', function (err, html) {
  if (err) throw err;

  // Replace placeholders in the HTML template with actual values
  let messageHtml = html.replace("{name}", event.name)

  // Send email with the modified HTML template
  let message = {
    from: process.env.EMAIL,
    to: order.email,
    subject: "invento test",
    html: messageHtml,
  };

  transporter.sendMail(message)
    .then(() => {
      console.log("Message sent successfully");
      return "message sent";
    })
    .catch((error) => console.log(error));
});
};


module.exports = mailHelper