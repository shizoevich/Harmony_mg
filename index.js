const express = require('express')
const passport = require('passport');

const workerRouter = require('./routes/worker.routes');
const ownerRouter = require('./routes/owner.routes');
const iotRouter = require('./routes/iot.routes');
const workerdataRouter = require('./routes/workerdata.routes')
const sensordataRouter = require('./routes/sensordata.routes');
const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())
require('./config/passport')(passport);

app.use(passport.initialize());
app.use('/api', sensordataRouter)
app.use('/api', ownerRouter)
app.use('/api', iotRouter)
app.use('/api', workerRouter)
app.use('/api', workerdataRouter)
app.listen(PORT, () => {
    console.log(`kwak ${PORT}`)
  })