const Router = require('express');
const router = new Router();
const passport = require('passport');
const iotController = require('../controller/iot.controller');
const { checkRole } = require('../middleware');
router.get('/test', iotController.test);
router.post('/iot',passport.authenticate('jwt', { session: false }), checkRole('admin'), iotController.createIot);
router.get('/iot/:id',passport.authenticate('jwt', { session: false }), iotController.getIot);
router.get('/iots',passport.authenticate('jwt', { session: false }), checkRole('admin'), iotController.getIots);
router.put('/iot/:id',passport.authenticate('jwt', { session: false }), checkRole('admin'), iotController.updateIot);
router.delete('/iot/:id',passport.authenticate('jwt', { session: false }), checkRole('admin'), iotController.deleteIot);

module.exports = router;

