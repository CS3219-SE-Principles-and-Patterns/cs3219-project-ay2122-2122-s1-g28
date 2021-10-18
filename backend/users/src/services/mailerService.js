const { GCP_CLIENT_ID, GCP_CLIENT_SECRET, EMAIL, GCP_ACCESS_TOKEN, GCP_REFRESH_TOKEN, FRONTEND_URL } = require('../config/config');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
      type: 'OAuth2',
      user: EMAIL,
      clientId: GCP_CLIENT_ID,
      clientSecret: GCP_CLIENT_SECRET,
      refreshToken: GCP_REFRESH_TOKEN,
      accessToken: GCP_ACCESS_TOKEN,
      expires: 1484314697598
  }
});

const registerAccountEmailOptions = (email, token) => {
  const emailOptions = {
    from: EMAIL,
    to: email,
    subject: "NUSociaLife Account Verification",
    // html: `<p>Click <a href="${FRONTEND_URL}/verify-email/${token}">here</a> to activate your account. Note: Link is only valid for 15 minutes!!!</p>`,
    html: `<p>Click <a href="${'http://localhost:5000/api/users'}/verifyEmail/${token}">here</a> to activate your account. Note: Link is only valid for 15 minutes!!!</p>`,
  };

  return emailOptions;
} 

const resetPasswordEmailOptions = (email, tempPassword) => {
  const emailOptions = {
    from: EMAIL,
    to: email,
    subject: "NUSociaLife Account Reset Passsword",
    html: `<p>Here is your temporary password: ${tempPassword} </p>`,
  };

  return emailOptions;
} 

exports.sendRegisterUserEmail = async (email, token) => {
    try {
      const emailOptions = registerAccountEmailOptions(email, token);
      await transporter.sendMail(emailOptions);
    } catch (err) {
        console.log(err);

        return res.status(404).json([{
          status: "error",
          msg: "Unable to connect to Nodemailer!",
        }])
    }
  };

exports.sendForgotPasswordEmail = async (email, tempPassword) => {
    try {
      const emailOptions = resetPasswordEmailOptions(email, tempPassword);
      await transporter.sendMail(emailOptions);
    } catch (err) {
        console.log(err);

        return res.status(404).json([{
          status: "error",
          msg: "Unable to connect to Nodemailer!",
        }])
    }
  };