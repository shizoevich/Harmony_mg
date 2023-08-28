const express = require('express');
const router = express.Router();
const passport = require('passport');

const workerDataController = require('../controller/workerdata.controller');

router.post('/worker_data',passport.authenticate('jwt', { session: false }), workerDataController.createWorkerData);
router.get('/worker_data/:id',passport.authenticate('jwt', { session: false }), workerDataController.getWorkerData);
router.put('/worker_data/:id',passport.authenticate('jwt', { session: false }), workerDataController.updateWorkerData);
router.get('/worker_data',passport.authenticate('jwt', { session: false }), workerDataController.getWorkerDataList);
router.delete('/worker_data/:id',passport.authenticate('jwt', { session: false }), workerDataController.deleteWorkerData);

module.exports = router;
