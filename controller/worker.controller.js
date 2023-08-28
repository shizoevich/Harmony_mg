const db = require('../db');


class workerController {
    
  async createWorker(req, res) {
    const { name_worker, mail_worker, usually_sleep_start_time, usually_sleep_end_time, usually_peak_productivity_time, usually_lowest_productivity_time, id_owner } = req.body;
    
    const newWorker = await db.query(
        'INSERT INTO worker (name_worker, mail_worker, usually_sleep_start_time, usually_sleep_end_time, usually_peak_productivity_time, usually_lowest_productivity_time, id_owner) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [name_worker, mail_worker, usually_sleep_start_time, usually_sleep_end_time, usually_peak_productivity_time, usually_lowest_productivity_time, id_owner]
    );

    res.json(newWorker.rows[0]);
}

    async getWorker(req, res) {
        const id = req.params.id;
        const worker = await db.query('SELECT * FROM worker WHERE id_worker = $1', [id]);
        res.json(worker.rows);
    }

    async updateWorker(req, res) {
        const id = req.params.id;
        const { name_worker ,mail_worker, usually_sleep_start_time, usually_sleep_end_time, usually_peak_productivity_time, usually_lowest_productivity_time, id_owner } = req.body;
        const updatedWorker = await db.query('UPDATE worker SET name_worker= $1, mail_worker = $2, usually_sleep_start_time = $3, usually_sleep_end_time = $4, usually_peak_productivity_time = $5, usually_lowest_productivity_time = $6, id_owner = $7 WHERE id_worker = $8 RETURNING *', 
        [name_worker ,mail_worker, usually_sleep_start_time, usually_sleep_end_time, usually_peak_productivity_time, usually_lowest_productivity_time, id_owner, id]);
        res.json(updatedWorker.rows[0]);
    }

    async getWorkers(req, res) {
        const workers = await db.query('SELECT * FROM worker');
        res.json(workers.rows);
    }

    async deleteWorker(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM worker WHERE id_worker = $1', [id]);
        res.sendStatus(204);
    }
}

module.exports = new workerController();
