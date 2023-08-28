const Router = require('express');
const router = new Router();
const passport = require('passport');
const workerController = require('../controller/worker.controller');

router.post('/worker',passport.authenticate('jwt', { session: false }), workerController.createWorker);
router.get('/worker/:id',passport.authenticate('jwt', { session: false }), workerController.getWorker);
router.get('/workers', workerController.getWorkers);
router.put('/worker/:id',passport.authenticate('jwt', { session: false }), workerController.updateWorker);
router.delete('/worker/:id',passport.authenticate('jwt', { session: false }), workerController.deleteWorker);

module.exports = router;
