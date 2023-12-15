const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'rockroshan1114@gmail.com',
    pass: 'hqsxhgtdoxisoolw',
  },
});

const sendMail = (to, subject, text) => new Promise((resolve, reject) => {
    transporter.sendMail({to,subject,text}, (error, info) => {
        if (error) {
        reject(error);
        } else {
        resolve(info);
        }
    });
    }
);

module.exports = sendMail 
