const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

class ownerController {
  async createOwner(req, res) {
    try {
      const { name_owner, mail_owner, password_owner, availability_iot } = req.body;
      let { role } = req.body;

      if (!role) {
        role = 'owner';
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_owner, salt);

      const newOwner = await db.query(
        'INSERT INTO owner (name_owner, mail_owner, password_owner, availability_iot, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name_owner, mail_owner, hashedPassword, availability_iot, role]
      );

      const payload = {
        id_owner: newOwner.rows[0].id_owner,
        name_owner: newOwner.rows[0].name_owner,
        role: newOwner.rows[0].role,
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
            id_owner: newOwner.rows[0].id_owner,
          });
        }
      );
    } catch (error) {
      console.error('Error creating owner:', error);
      res.status(500).json({ error: 'An error occurred while creating the owner.' });
    }
  }

  async loginOwner(req, res) {
    const { mail_owner, password_owner } = req.body;
    console.log('Received mail_owner:', mail_owner);
    console.log('Received password_owner:', password_owner);

    try {
      const owner = await db.query('SELECT * FROM owner WHERE mail_owner = $1', [mail_owner]);
      if (!owner.rows.length) {
        console.log('Owner not found');
        return res.status(404).json({ mail_owner: 'Owner not found' });
      }

      const isMatch = await bcrypt.compare(password_owner, owner.rows[0].password_owner);
      if (isMatch) {
        const payload = {
          id_owner: owner.rows[0].id_owner,
          name_owner: owner.rows[0].name_owner,
          role: owner.rows[0].role,
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        console.log('Password incorrect');
        return res.status(400).json({ password_owner: 'Password incorrect' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async checkToken(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, keys.secretOrKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
      } else {
        return res.json({ role: decoded.role, id_owner: decoded.id_owner });
      }
    });
  }

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

  async getOwner(req, res) {
    const id = req.params.id;
    try {
        const owner = await db.query('SELECT * FROM owner WHERE id_owner = $1', [id]);
        if (!owner.rows.length) {
            return res.status(404).json({ message: 'Owner not found' });
        }
        res.json(owner.rows[0]);
    } catch (error) {
        console.error('Error fetching owner:', error);
        res.status(500).json({ error: 'An error occurred while fetching the owner.' });
    }
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
      const ownerId = req.params.id;
      const { startTime, endTime } = req.body;
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
    const workersStatus = await db.query(
      `
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
      `,
      [ownerId]
    );
    res.json(workersStatus.rows);
  }
}

module.exports = new ownerController();
