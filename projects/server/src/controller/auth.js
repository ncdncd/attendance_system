const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const crypto = require("crypto");
const transporter = require("../helpers/transporter")

const { User } = db;

const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {

  async registerAdmin(req, res) {

    const { email } =
        req.body;
        try {
            const isExist = await User.findOne({
              where: {
                email
              },
            });
    
            if (isExist) {
              res.status(400).send({
                message: "username/email/phone number already registered",
              });
              return;
            }

            const access_token = crypto.randomBytes(16).toString("hex");
            const time = new Date();
      
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
      
            const newUser = await User.create({
              email,
              password: hashPassword,
              access_token,
              exp_access_token: time
            });

            await transporter.sendMail({
                from: "the Company",
                to: email,
                subject:"link for authentication",
                html:`<p>Click on this link to edit your info and credentials
                <a href='${process.env.BASEPATH}/access?token=${access_token}' target="_blank">Verify Account</a></p>`,
            })
      
            res.status(201).send({
              message: "registration success",
              data: {
                email: newUser.email,
              },
            });

          } catch (error) {
            res.status(500).send({
              message: "something wrong in the server",
              errors: error.message,
            });
        }
  },

  async updateEmployeeData(req, res) {
    const token = req.query.token

    try {
      const userData = await db.User.findOne({
        where: {
          access_token: token,
        },
      });
      if (!userData) {
        return res.status(400).send({ message: "token is not valid" });
      }

      // check token expiration
      const tokenAcc = new Date(userData.exp_access_token);
      const now = new Date();
      tokenAcc.setHours(tokenAcc.getHours() + 48);

      if (now > tokenAcc) {
        return res.status(400).send({
          message: "token is already expired",
        });
      }

      // generate password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      userData.password = hashPassword;
      userData.forgotToken = null;
      userData.forgotTokenCreatedAt = null;
      await userData.save();
      res.send({
        message: "password is reset, try to login now!",
      });
    } catch (errors) {
      console.error(errors);
      res.status(500).send({
        message: "fatal error on server",
        error: errors.message,
      });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email
        },
      });
      if (!user) {
        return res.status(400).send({
          message: "login failed, incorrect identity/password",
        });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).send({
          message: "login failed, incorrect identity/password",
        });
      }

      const payload = { id: user.id };
      const token = jwt.sign(payload, secretKey, {
        expiresIn: "1h",
      });
      res.send({
        message: "login success",
        data: user,
        accessToken: token,
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        error: error.message,
      });
    }
  },
}