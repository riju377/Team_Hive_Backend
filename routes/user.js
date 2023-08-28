const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user')
const Comp = require('../models/competition')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.get('/', async (req, res) => {
    try {
        const data = await User.find({});
        res.status(200).json({
            data,
            msg: "USers Sent"
        })
    } catch (error) {
        console.log(error)
    }
})


router.post('/create', async (req, res) => {
    try {
        const { fname, lname, phNumber, email, password } = req.body;
        if (!fname || !phNumber || !email || !password) {
            res.status(422).json({
                error: "Fil all the required column"
            })
        }
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            res.status(422).json({ error: "User already existed" });

        }
        else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const user = new User({ fname, email, lname, phNumber, password:hashedPassword });
            //Saves data to db
            await user.save();
            res.status(201).json({ message: "User created", user });
            return;
        }
    }
    catch (err) {
        console.log(err)
    }
})

router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({
            error: "Fil all the required column"
        })
    }

    const user = await User.findOne({ email: email });
  
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
    return res.status(200).json({ token, message: "Login Success", id: user._id});
  });

//route: /apply/:compId
router.post('/:userId/apply/:compId', async (req, res) => {
    try {
        const { msg } = req.body;
        const { userId, compId } = req.params;
        console.log(req.params)
        const user = await User.findById(userId);
        const applicant = { user: userId, msg: msg };
        const competition = await Comp.findById(compId)
        const comp = await Comp.findByIdAndUpdate(compId, {
            $push: {
                applicants: applicant
            }
        }, { new: true })
        user.appliedComp.push({comp:compId, name:competition.name, status:'pending'});
        await user.save();
        console.log(user, comp)
        res.status(200).json({
            user,
            comp,
            msg: "Applied Successfully"
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id/user', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await User.findById(id).populate('appliedComp');
        if (!data) {
            return res.status(400).json({
                msg: "User not found"
            })
        }
        else {
            res.status(200).json({
                data
            })
        }

    } catch (error) {
        console.log(error)
    }
})

module.exports = router;