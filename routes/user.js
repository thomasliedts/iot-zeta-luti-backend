const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Users = require('../models/Users');

router.post('/', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    let user = await Users.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'user already exists' });
    }
    user = new Users({
      email,
      password,
      role,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server erreur');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ msg: 'There is no user' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Users.findOneAndRemove(req.params.id);

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;