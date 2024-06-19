const express = require('express');
const router = express.Router();
const passport = require('passport');
const ownerController = require('../controller/owner.controller');
const { checkRole } = require('../middleware');

router.post('/register', ownerController.createOwner);
router.post('/login', ownerController.loginOwner);
router.get('/check-token', passport.authenticate('jwt', { session: false }), ownerController.checkToken);
router.get('/owner/:id', passport.authenticate('jwt', { session: false }), ownerController.getOwner);
router.put('/owner/:id', passport.authenticate('jwt', { session: false }), ownerController.updateOwner);
router.get('/owners', passport.authenticate('jwt', { session: false }), checkRole('owner'), ownerController.getOwners);
router.delete('/owner/:id', passport.authenticate('jwt', { session: false }), checkRole('admin'), ownerController.deleteOwner);
router.get('/owner/:id/workers', passport.authenticate('jwt', { session: false }), ownerController.getOwnerWorkers);
router.get('/owner/:id/sensor-data', passport.authenticate('jwt', { session: false }), ownerController.getOwnerSensorData);
router.get('/owner/:id/iot', passport.authenticate('jwt', { session: false }), ownerController.getOwnerIot);
router.post('/owner/:id/suitable-workers', passport.authenticate('jwt', { session: false }), ownerController.getSuitableWorkers);
router.get('/owner/:id/workers-status', passport.authenticate('jwt', { session: false }), ownerController.getWorkersStatus);
router.post('/workers', passport.authenticate('jwt', { session: false }), ownerController.createWorker);

module.exports = router;

