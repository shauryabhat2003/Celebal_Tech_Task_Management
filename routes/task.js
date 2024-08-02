const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

// @route    POST api/tasks
// @desc     Create a task
// @access   Private
router.post('/', auth, createTask);

// @route    GET api/tasks
// @desc     Get all tasks
// @access   Private
router.get('/', auth, getTasks);

// @route    PUT api/tasks/:id
// @desc     Update task status
// @access   Private
router.put('/:id', auth, updateTask);

module.exports = router;
