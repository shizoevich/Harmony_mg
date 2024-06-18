const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const keys = require('../config/keys');
const passport = require('passport');
const ownerController = require('../controller/owner.controller');
const { checkRole } = require('../middleware');

router.post('/login', async (req, res) => {
  const { mail_owner, password_owner } = req.body;
  console.log('Received mail_owner:', mail_owner);
  console.log('Received password_owner:', password_owner);

  try {
    const owner = await db.query('SELECT * FROM owner WHERE mail_owner = $1', [mail_owner]);
    if (!owner.rows.length) {
      return res.status(404).json({ mail_owner: 'Owner not found' });
    }

    const isMatch = await bcrypt.compare(password_owner, owner.rows[0].password_owner);
    if (isMatch) {
      const payload = {
        id_owner: owner.rows[0].id_owner,
        name_owner: owner.rows[0].name_owner,
        role: owner.rows[0].role
      };

      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 3600 },
        (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token
          });
        }
      );
    } else {
      return res.status(400).json({ password_owner: 'Password incorrect' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/owner', ownerController.createOwner);
router.get('/owner/:id', passport.authenticate('jwt', { session: false }), ownerController.getOwner);
router.put('/owner/:id', passport.authenticate('jwt', { session: false }), ownerController.updateOwner);
router.get('/owners', passport.authenticate('jwt', { session: false }), checkRole('owner'), ownerController.getOwners);
router.delete('/owner/:id', passport.authenticate('jwt', { session: false }), checkRole('admin'), ownerController.deleteOwner);
router.get('/owner/:id/workers', passport.authenticate('jwt', { session: false }), ownerController.getOwnerWorkers);
router.get('/owner/:id/sensor-data', passport.authenticate('jwt', { session: false }), ownerController.getOwnerSensorData);
router.get('/owner/:id/iot', passport.authenticate('jwt', { session: false }), ownerController.getOwnerIot);
router.post('/owner/:id/suitable-workers', passport.authenticate('jwt', { session: false }), ownerController.getSuitableWorkers);
router.get('/owner/:id/workers-status', passport.authenticate('jwt', { session: false }), ownerController.getWorkersStatus);
router.post('/register', ownerController.createOwner);

module.exports = router;
