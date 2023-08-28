const db = require('../db');

class iotController {
    async createIot(req, res) {
        const { id_owner } = req.body;
        const newIot = await db.query('INSERT INTO iot (id_owner) VALUES ($1) RETURNING *', [id_owner]);
        res.json(newIot.rows[0]);
    }

    async getIot(req, res) {
        const id = req.params.id;
        const iot = await db.query('SELECT * FROM iot WHERE id_iot = $1', [id]);
        res.json(iot.rows);
    }
    
    async test(req, res) {
        res.json({"status":true})
    }
    async updateIot(req, res) {
        const id = req.params.id;
        const { id_owner } = req.body;
        const updatedIot = await db.query('UPDATE iot SET id_owner = $1 WHERE id_iot = $2 RETURNING *', [id_owner, id]);
        res.json(updatedIot.rows[0]);
    }

    async getIots(req, res) {
        const iots = await db.query('SELECT * FROM iot');
        res.json(iots.rows);
    }

    async deleteIot(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM iot WHERE id_iot = $1', [id]);
        res.sendStatus(204);
    }
}

module.exports = new iotController();
