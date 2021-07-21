const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const Users = require('../models/Users');

router.post('/', auth, async (req, res) => {
  const admin = await Users.findById(req.user.id).select('-password');
  const { email, password, role } = req.body;
  try {
    let user = await Users.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'user already exists' });
    }
    if (admin.role === 'admin') {
      user = new Users({
        email,
        password,
        role,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.json(user);
    } else {
      return res.status(400).json({ msg: 'You are not a admin' });
    }
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

router.get('/', auth, async (req, res) => {
  const admin = await Users.findById(req.user.id).select('-password');
  try {
    if (admin.role === 'admin') {
      const users = await Users.find({});
      res.json(users);
    } else {
      return res.status(400).json({ msg: 'You are not a admin' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  const admin = await Users.findById(req.user.id).select('-password');

  try {
    if (admin.role === 'admin') {
      await Users.findOneAndRemove(req.params.id);

      res.json({ msg: 'User deleted' });
    } else {
      res.status(400).send('Your are not a admin');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
