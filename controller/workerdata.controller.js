const db = require('../db');

class WorkerDataController {
  async createWorkerData(req, res) {
    const {
      id_sensor,
      id_worker,
      record_time,
      stress_level,
      sleep_quality,
      energy_level,
      sleep_start_time,
      sleep_end_time,
      record_date,
      comment,
    } = req.body;

    const newWorkerData = await db.query(
      'INSERT INTO worker_data (id_sensor, id_worker, record_time, stress_level, sleep_quality, energy_level, sleep_start_time, sleep_end_time, record_date, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [
        id_sensor,
        id_worker,
        record_time,
        stress_level,
        sleep_quality,
        energy_level,
        sleep_start_time,
        sleep_end_time,
        record_date,
        comment,
      ]
    );

    res.json(newWorkerData.rows[0]);
  }

  async getWorkerData(req, res) {
    const id = req.params.id;
    const workerData = await db.query(
      'SELECT * FROM worker_data WHERE id_worker_data = $1',
      [id]
    );
    res.json(workerData.rows);
  }

  async updateWorkerData(req, res) {
    const id = req.params.id;
    const {
      id_sensor,
      id_worker,
      record_time,
      stress_level,
      sleep_quality,
      energy_level,
      sleep_start_time,
      sleep_end_time,
      record_date,
      comment,
    } = req.body;

    const updatedWorkerData = await db.query(
      'UPDATE worker_data SET id_sensor = $1, id_worker = $2, record_time = $3, stress_level = $4, sleep_quality = $5, energy_level = $6, sleep_start_time = $7, sleep_end_time = $8, record_date = $9, comment = $10 WHERE id_worker_data = $11 RETURNING *',
      [
        id_sensor,
        id_worker,
        record_time,
        stress_level,
        sleep_quality,
        energy_level,
        sleep_start_time,
        sleep_end_time,
        record_date,
        comment,
        id,
      ]
    );

    res.json(updatedWorkerData.rows[0]);
  }

  async getWorkerDataList(req, res) {
    const workerDataList = await db.query('SELECT * FROM worker_data');
    res.json(workerDataList.rows);
  }

  async deleteWorkerData(req, res) {
    const id = req.params.id;
    await db.query('DELETE FROM worker_data WHERE id_worker_data = $1', [id]);
    res.sendStatus(204);
  }
}

module.exports = new WorkerDataController();
