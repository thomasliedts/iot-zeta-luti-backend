const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Users = require('../models/Users');

router.get('/:id', auth, async (req, res) => {
  const localUser = await Users.findById(req.user.id).select('-password');
  try {
    const user = await Users.findById(req.params.id);

    if (!user) {
      return res.status(400).json({ msg: 'There is no user' });
    }
    if (localUser?.id === user?.id) {
      res.json(user);
    } else {
      return res.status(400).json({ msg: 'no authorization to see that' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
