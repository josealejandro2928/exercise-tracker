const path = '/api/users';
const Exercise = require('../models/exercise.model');
const User = require('./../models/user.model');
const moment = require('moment');

module.exports = function register(app) {
  app.post(`${path}`, createUser);
  app.get(`${path}`, getUsers);
  app.post(`${path}/:_id/exercises`, createExcercise);
  app.get(`${path}/:_id/logs`, getLogs);
};

const createUser = async (req, res) => {
  try {
    let { username } = req.body;
    if (!username) throw { message: 'username must be passed', status: 500 };
    let user = await User.create({ username });
    return res.status(201).json({ _id: user._id, username: user.username });
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

const createExcercise = async (req, res) => {
  try {
    let { _id } = req.params;
    let { description, duration, date } = req.body;
    console.log(req.body);
    if (!_id) throw { message: '_id must be passed', status: 400 };

    if (!description)
      throw { message: 'description must be passed', status: 400 };

    if (!duration) throw { message: 'duration must be passed', status: 400 };
    date = date ? new Date(date) : new Date();

    let user = await User.findById(_id);
    if (!user)
      throw { message: `user with _id = ${_id} does not exist`, status: 404 };

    let excercise = await Exercise.create({
      description,
      duration,
      date,
      userId: _id,
    });
    let response = {
      _id: _id,
      username: user.username,
      date: moment(date).add(5, 'hour').toDate().toDateString(),
      duration: excercise.duration,
      description: excercise.description,
    };
    return res.status(201).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

const getLogs = async (req, res) => {
  try {
    let { _id } = req.params;
    let queryUser = { userId: _id };
    let { from, to, limit } = req.query;
    if (from && to) {
      queryUser.date = { $gte: from, $lte: to };
    }
    if (!limit) {
      limit = 1000000;
    }

    if (!_id) throw { message: '_id must be passed', status: 400 };

    const [user, excercises] = await Promise.all([
      User.findById(_id),
      Exercise.find(queryUser).limit(+limit),
    ]);
    if (!user)
      throw { message: `user with _id = ${_id} does not exist`, status: 404 };
    const result = {
      username: user.username,
      _id: user._id,
      log: excercises.map((item) => ({
        description: item.description,
        duration: item.duration,
        date: item.date,
      })),
      count: excercises.length,
    };

    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    let users = (await User.find()).map((item) => ({
      _id: item._id,
      username: item.username,
    }));

    return res.status(200).json(users);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
};

