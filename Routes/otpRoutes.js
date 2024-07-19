const express = require('express');
const nodemailer = require('nodemailer');
const sql = require('mssql'); // Make sure to require 'mssql'
const dbConfig = require('../dbCofig/dbConfig'); // Fixed typo in the path

const router = express.Router();
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
router.post('/sample', async (req, res) => {
    res.send("hiiii");
});

router.post('/generateOtp', async (req, res) => { // Fixed typo in route name
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Enter Email", success: false });
        }
        const otp = generateOtp();

        const pool = await sql.connect(dbConfig);
        const request = pool.request();
        await request
            .input('email', sql.NVarChar, email)
            .input('otp', sql.NVarChar, otp)
            .query('INSERT INTO OTPs (Email, OTP) VALUES (@Email, @OTP)');

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send OTP' });
            }
            res.status(200).json({ message: 'OTP sent successfully' });
        });

    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});

/////////////////////////////////           veryfy OTP          /////////////////////////////////

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
  
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .input('otp', sql.NVarChar, otp)
        .query('SELECT * FROM OTPs WHERE Email = @Email AND OTP = @OTP');
  
      if (result.recordset.length > 0) {
        await pool.request()
          .input('email', sql.NVarChar, email)
          .query('DELETE FROM OTPs WHERE Email = @Email'); // OTP is valid, remove it after verification
        return res.status(200).json({ message: 'OTP verified successfully' });
      }
      res.status(400).json({ message: 'Invalid OTP' });
    } catch (error) {
      res.status(500).json({ message: 'Database error', error });
    }
  });

module.exports = router;
