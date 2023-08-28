const Router = require('express');
const router = new Router();
const passport = require('passport');
const sensorDataController = require('../controller/sensordata.controller');

router.post('/sensorData', sensorDataController.createSensorData);
router.get('/sensorData/:id',passport.authenticate('jwt', { session: false }), sensorDataController.getSensorData);
router.get('/sensorDataList',passport.authenticate('jwt', { session: false }), sensorDataController.getSensorDataList);
router.put('/sensorData/:id',passport.authenticate('jwt', { session: false }), sensorDataController.updateSensorData);
router.delete('/sensorData/:id',passport.authenticate('jwt', { session: false }), sensorDataController.deleteSensorData);

module.exports = router;
