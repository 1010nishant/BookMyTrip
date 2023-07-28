const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text').htmlToText;

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Nishant Jangid <${process.env.DEV_EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // gmail
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.PROD_EMAIL_USERNAME,
                    pass: process.env.PROD_EMAIL_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({
            host: process.env.DEV_EMAIL_HOST,
            port: process.env.DEV_EMAIL_PORT,
            auth: {
                user: process.env.DEV_EMAIL_USERNAME,
                pass: process.env.DEV_EMAIL_PASSWORD
            }
        });
    }

    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        };

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};
