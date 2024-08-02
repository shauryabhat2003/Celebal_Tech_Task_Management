const Task = require('../models/task');
const User = require('../models/user');
const nodemailer = require('nodemailer');

exports.createTask = async (req, res) => {
    const { title, description, category, assignedTo, deadline } = req.body;
    try {
        const task = new Task({
            title,
            description,
            category,
            assignedTo,
            createdBy: req.user.id,
            deadline,
        });

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email').populate('createdBy', 'name email');
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateTask = async (req, res) => {
    const { status } = req.body;
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        task.status = status;
        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const sendNotification = (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error.message);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

exports.createTask = async (req, res) => {
    const { title, description, category, assignedTo, deadline } = req.body;
    try {
        const task = new Task({
            title,
            description,
            category,
            assignedTo,
            createdBy: req.user.id,
            deadline,
        });

        await task.save();

        const assignee = await User.findById(assignedTo);
        sendNotification(assignee.email, 'New Task Assigned', `You have been assigned a new task: ${title}`);

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
