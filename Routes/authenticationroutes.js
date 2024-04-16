const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000;
const crypto = require("crypto");
const moment=require("moment");
const nodemailer=require("nodemailer");
const ResetToken = require("../Models/resetpassword_model");
const Teacher=require("../Models/Educator");
const Student=require("../Models/Student");
const router = express.Router();
// Generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }
// User Registration API
const maxTime=1000000;
router.post('/register', async (req, res) => {
    try {
        const { email, name, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;
        if(role.toLowerCase()==="teacher"){
        newUser = new Teacher({ email, name, password: hashedPassword });
        await newUser.save();
        }else if(role.toLowerCase()==="student"){
            newUser=new Student({email,name,password: hashedPassword});
            await newUser.save();
        }
        const token = jwt.sign({ userId: newUser._id }, 'secret_key',{expiresIn: maxTime});
        res.cookie('jwt',token,{expiresIn: maxTime, httpOnly: true});
        res.status(201).json({ message: 'User registered successfully',name });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// User Login API
router.post('/login', async (req, res) => {
    try {
        const { name, password, role } = req.body;
        console.log(name,password,role);
 if(role.toLowerCase()==="student"){
        Student.findOne({ name: name }).then(async student => {
          console.log(student);
    if (student) {
        const passwordMatch = await bcrypt.compare(password, student.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: Student._id }, 'secret_key',{expiresIn: maxTime});
        res.cookie('jwt',token,{expiresIn: maxTime, httpOnly: false});
        res.json({ message: 'Login successful',name });
       // Output the found student document
    } else {
      console.log('Student not found');
    }
  })
  .catch(error => {
    console.error('Error finding student:', error);
  });
        }
        else if(role.toLowerCase()==="teacher"){
           Teacher.findOne({name: name}).then(async teacher=>{
            if(teacher){
                const passwordMatch= await bcrypt.compare(password,teacher.password);
                if(!passwordMatch){
                    return res.status(401).json({error: 'Invalid username or password'});
                }
                const token= jwt.sign({userId: Teacher._id}, 'secret_key',{expiresIn: maxTime});
                res.cookie('jwt',token,{expiresIn: maxTime,httpOnly: false});
                res.json({message: 'Login Successful',name});
            }else{
                console.log("Teacher not found");
            }
           })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Forgot Password API
router.post('/forgot-password', async (req, res) => {
    const {email,role}=req.body;
    const token=generateToken();
    const expires = moment().add(1, 'hour').toDate();

    try {
      // Save reset token to MongoDB
      await ResetToken.create({ email, token, expires, role });
  
      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 's6akshat2110045@gmail.com',
          pass: process.env.PASSWORD,
        }
      });
  
      // Send email with reset password link
      const mailOptions = {
        from: 'akshat2110045@akgec.ac.in',
        to: email,
        subject: 'Reset Password',
        text: `Click on the following link to reset your password: http://localhost:${PORT}/api/reset/${token}`
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Reset password link sent to email:', email);
      res.json({ message: 'Reset password link sent to your email' });
    } catch (error) {
      console.error('Error sending reset password email:', error);
      res.status(500).json({ error: 'Failed to send reset password email' });
    }
    
});
router.route('/reset/:token').get( async (req, res) => {
    const { token } = req.params; 
    try {
      // Find reset token in MongoDB
      const resetToken = await ResetToken.findOne({ token });
  
      // Check if token exists and is not expired
      if (resetToken && moment().isBefore(resetToken.expires)) {
        // Allow user to reset password
        res.send("message: reset password form"); // Render reset password form
      } else {
        // Token is invalid or expired
        res.status(400).send('Invalid or expired reset password link');
      }
    } catch (error) {
      console.error('Error finding reset token:', error);
      res.status(500).json({ error: 'Failed to find reset token' });
    }
  }).post(async (req,res)=>{
    const {token}=req.params;
    const {newpass}=req.body;
    //encrypt the new password
    const hashedPassword = await bcrypt.hash(newpass, 10);
    try{
        const user_reset = await ResetToken.findOne({ token });
        const email=user_reset.email;
        let user;
        if(user_reset.role.toLowerCase()==="teacher"){
            user=await Teacher.findOne({email});
        }else if(user_reset.toLowerCase()==="student"){
            user=await Student.findOne({email});
        }
        user.password=hashedPassword;
        await user.save();
        // Password updated successfully
        res.send({ message: 'Password updated successfully' });
        }catch(err){
            console.error('Error updating password:', error);
            res.status(500).json({ error: 'Failed to update password' });
        }
  })

  module.exports = router;