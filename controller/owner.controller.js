const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

class ownerController {
    
  async createOwner(req, res) {
    try {
      const { name_owner, mail_owner, password_owner, availability_iot } = req.body;
      let { role } = req.body;

      // Назначение роли "owner" по умолчанию
      if (!role) {
        role = 'owner';
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_owner, salt);
  
      const newOwner = await db.query(
        'INSERT INTO owner (name_owner, mail_owner, password_owner, availability_iot, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name_owner, mail_owner, hashedPassword, availability_iot, role]
      );
  
      // Создание JWT токена
      const payload = {
        id_owner: newOwner.rows[0].id_owner,
        name_owner: newOwner.rows[0].name_owner,
        role: newOwner.rows[0].role
      };

      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 3600 },
        (err, token) => {
          res.json({
            success: true,
            token: 'Bearer ' + token,
            role: newOwner.rows[0].role,
            id_owner: newOwner.rows[0].id_owner
          });
        }
      );
  
    } catch (error) {
      console.error('Error creating owner:', error);
      res.status(500).json({ error: 'An error occurred while creating the owner.' });
    }
  }

  // Остальные методы остаются без изменений...

  async getOwner(req, res) {
    const id = req.params.id;
    const owner = await db.query('SELECT * FROM owner WHERE id_owner = $1', [id]);
    res.json(owner.rows);
  }

  async updateOwner(req, res) {
    const id = req.params.id;
    const { name_owner, mail_owner, password_owner, availability_iot, role } = req.body;
    const updatedOwner = await db.query(
      'UPDATE owner SET name_owner = $1, mail_owner = $2, password_owner = $3, availability_iot = $4, role = $5 WHERE id_owner = $6 RETURNING *',
      [name_owner, mail_owner, password_owner, availability_iot, role, id]
    );
    res.json(updatedOwner.rows[0]);
  }

  async getOwners(req, res) {
    const owners = await db.query('SELECT * FROM owner');
    res.json(owners.rows);
  }

  async getOwnerSensorData(req, res) {
    const ownerId = req.params.id;

    const sensorData = await db.query(
        'SELECT sd.* FROM sensor_data sd ' +
        'JOIN iot i ON sd.id_iot = i.id_iot ' +
        'JOIN owner o ON i.id_owner = o.id_owner ' +
        'WHERE o.id_owner = $1',
        [ownerId]
    );

    res.json(sensorData.rows);
}
  async deleteOwner(req, res) {
    const id = req.params.id;
    await db.query('DELETE FROM owner WHERE id_owner = $1', [id]);
    res.sendStatus(204);
  }
  async getOwnerWorkers(req, res) {
    const ownerId = req.params.id;
    try {
      const workers = await db.query('SELECT * FROM worker WHERE id_owner = $1', [ownerId]);
      res.json(workers.rows);
    } catch (error) {
      console.error('Error getting owner workers:', error);
      res.status(500).json({ error: 'Failed to get owner workers' });
    }
  }

  async getSuitableWorkers(req, res) {
    try {
        const ownerId = req.params.id; // Owner's ID
        const { startTime, endTime } = req.body; // Date and time intervals
        const SuitableWorkers = await db.query('SELECT * FROM get_best_workers($1, $2, $3)', [ownerId, startTime, endTime]);
        res.json(SuitableWorkers.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

  async getOwnerIot(req, res) {
    const ownerId = req.params.id;
    try {
      const iot = await db.query('SELECT * FROM iot WHERE id_owner = $1', [ownerId]);
      res.json(iot.rows);
    } catch (error) {
      console.error('Error getting owner IoT:', error);
      res.status(500).json({ error: 'Failed to get owner IoT' });
    }
  }
  
  async getWorkersStatus(req, res) {
    const ownerId = req.params.id;
    const workersStatus = await db.query(`
        SELECT 
            w.id_worker,
            w.mail_worker,
            MAX(wd.stress_level) AS max_stress_level,
            AVG(wd.sleep_quality) AS avg_sleep_quality,
            AVG(wd.energy_level) AS avg_energy_level
        FROM worker w
        JOIN owner o ON w.id_owner = o.id_owner
        LEFT JOIN worker_data wd ON w.id_worker = wd.id_worker
        WHERE o.id_owner = $1
        GROUP BY w.id_worker, w.mail_worker
        ORDER BY avg_energy_level DESC;
    `, [ownerId]);
    
  
    res.json(workersStatus.rows);
  }
}

module.exports = new ownerController();

exports.checkToken = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, keys.secretOrKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    } else {
      return res.json({ role: decoded.role, id_owner: decoded.id_owner });
    }
  });
};