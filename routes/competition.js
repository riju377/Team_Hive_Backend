const express = require('express');
const router = express.Router({ mergeParams: true });
const Competition = require('../models/competition');
const user = require('../models/user');
const User = require('../models/user')



router.get('/:userId/competition', async (req, res) => {
    try {
        const {userId} = req.params;
        const data = await Competition.find({enough: 0, owner:{$ne : userId}, "applicants.user":{ $nin:[userId]}, "acceptedApp.user":{ $nin:[userId]}}).sort({deadline: 1 })
        res.status(200).json({
            data,
            msg: "Active Competitions Sent"
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/:userId/compCreated', async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId).populate(
            [{
            path: "compCreated",
            populate: {
                path: "applicants.user"
            }
           },{
            path: "compCreated",
            populate: {
                path: "acceptedApp.user"
            }
           }
        ]
        )
        //console.log(user)
        res.status(200).json({
            user,
            msg: "Admin Competitions Sent"
        })
    } catch (error) {
        console.log(error)
    }
})


router.post('/:userId/createComp', async (req, res) => {

    const { userId } = req.params;
    const { name, memberReq, competitionDate, deadline, owner} = req.body;
    console.log(req.body)
    if (!name || !memberReq) {
        res.status(422).json({
            error: "Fil all the required column"
        })
    }
    try {
        const newComp = new Competition(req.body);
        newComp.owner = userId;
        newComp.memberLeft = newComp.memberReq;
        newComp.enough = 0;
        const result = await newComp.save();
        const user = await User.findById(userId);
        user.compCreated.push(result._id);
        await user.save()
        res.status(200).json({
            result,
            user,
            message:"Competition Created"
        })
    }
    catch (error) {
        console.log(error)
    }
})


router.post('/:userId/accept/:compId', async (req, res) => {
    try {
        const { userId, compId } = req.params;
        console.log(userId, compId );
        const compet = await Competition.findById(compId);
        console.log(compet)
        const comp = await Competition.findByIdAndUpdate(compId, { $pull: { applicants:{user: userId}}}, {new:true})
        const result = await Competition.findByIdAndUpdate(compId, { $push: { acceptedApp: { user: userId } }, $inc: { memberLeft: -1 }},  { new: true });
        console.log(result)
        const updateUser = await User.updateOne({ _id: userId, appliedComp:{$elemMatch : {comp:compId}}}, { $set: { 'appliedComp.$.status': 'accepted' }});
        // comp.applicants.pull({user:userId})
        // const compet = Competition.findById(compId);
        if(compet.memberLeft <= 0){
            const enough = await Competition.findByIdAndUpdate(compId, {enough:true, memberLeft:0})
            console.log(enough, 'enough')
        }
        console.log(updateUser);
        const us = await user.findById(userId);
        console.log(us)
        res.status(200).json({
            comp,
            us,
            msg:"Request Accepted"
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/:userId/reject/:compId', async (req, res) => {
    try {
        const { userId, compId } = req.params;
        const comp = await Competition.findByIdAndUpdate(compId, { $pull: { applicants: { user:userId } } }, { new: true });
        const updateUser = await User.updateOne({ _id: userId, 'appliedComp.comp': compId }, { $set: { 'appliedComp.$.status': 'rejected' } });
        console.log(updateUser)
        // const result = await Competition.findById(compId);

        // console.log()
        res.status(200).json({
            comp,
            msg:"Request Reected"
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;