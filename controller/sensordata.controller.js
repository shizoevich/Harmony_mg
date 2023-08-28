const db = require('../db');

class sensorDataController {
    async createSensorData(req, res) {
        const { date, humidity, temperature, noise, illumination, id_iot } = req.body;
        const newSensorData = await db.query('INSERT INTO sensor_data (date, humidity, temperature, noise, illumination, id_iot) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
        [date, humidity, temperature, noise, illumination, id_iot]);
        res.json(newSensorData.rows[0]);
    }
    

    async getSensorData(req, res) {
        const id = req.params.id;
        const sensorData = await db.query('SELECT * FROM sensor_data WHERE id_sensor = $1', [id]);
        res.json(sensorData.rows);
    }

    async updateSensorData(req, res) {
        const id = req.params.id;
        const { record_date, record_time, humidity, temperature, noise, illumination, id_iot, id_worker} = req.body;
        const updatedSensorData = await db.query('UPDATE sensor_data SET record_date = $1, record_time = $2, humidity = $3, temperature = $4, noise = $5, illumination = $6, id_iot = $7, id_worker = $8 WHERE id_sensor = $9 RETURNING *', 
        [record_date, record_time, humidity, temperature, noise, illumination, id_iot, id_worker, id]);
        res.json(updatedSensorData.rows[0]);
    }

    async getSensorDataList(req, res) {
        const sensorDataList = await db.query('SELECT * FROM sensor_data');
        res.json(sensorDataList.rows);
    }

    async deleteSensorData(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM sensor_data WHERE id_sensor = $1', [id]);
        res.sendStatus(204);
    }
}

module.exports = new sensorDataController();
