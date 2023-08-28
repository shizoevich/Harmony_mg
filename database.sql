CREATE TABLE admin (
    id_admin SERIAL PRIMARY KEY,
    name_admin VARCHAR(255),
    mail_admin VARCHAR(255),
    password_admin VARCHAR(255),
    id_owner INTEGER,
    FOREIGN KEY (id_owner) REFERENCES owner (id_owner)
);

CREATE TABLE owner (
    id_owner SERIAL PRIMARY KEY,
    name_owner VARCHAR(255),
    mail_owner VARCHAR(255),
    password_owner VARCHAR(255),
    id_worker INTEGER,
    id_iot INTEGER,
    FOREIGN KEY (id_worker) REFERENCES worker (id_worker)
    FOREIGN KEY (id_iot) REFERENCES iot (id_iot)
);

CREATE TABLE worker (
    id_worker SERIAL PRIMARY KEY,
    mail VARCHAR(255),
    usually_sleep_start_time TIME,
    usually_sleep_end_time TIME,
    usually_peak_productivity_time TIME,
    usually_lowest_productivity_time TIME,
    id_owner INTEGER,
    id_sensor INTEGER,
    FOREIGN KEY (id_owner) REFERENCES owner (id_owner),
    FOREIGN KEY (id_sensor) REFERENCES sensor_data (id_sensor)
);

CREATE TABLE iot (
    id_iot SERIAL PRIMARY KEY,
    id_owner INTEGER,
    FOREIGN KEY (id_owner) REFERENCES owner (id_owner)
);

CREATE TABLE sensor_data (
    id_sensor SERIAL PRIMARY KEY,
    record_date TIMESTAMP,
    humidity FLOAT,
    temperature FLOAT,
    noise FLOAT,
    illumination FLOAT,
    stress_level INTEGER,
    sleep_quality INTEGER,
    energy_level INTEGER,
    sleep_start_time TIME,
    sleep_end_time TIME,
    peak_productivity_time TIME,
    lowest_productivity_time TIME,
    comment TEXT,
    id_iot INTEGER,
    id_worker INTEGER,
    FOREIGN KEY (id_iot) REFERENCES iot (id_iot),
    FOREIGN KEY (id_worker) REFERENCES worker (id_worker)
);


INSERT INTO sensor_data (record_date, humidity, temperature, noise, illumination, stress_level, sleep_quality,
 energy_level, sleep_start_time, sleep_end_time, peak_productivity_time, lowest_productivity_time, id_iot, id_worker)
VALUES 
  ('2023-06-6 08:00:00', NULL, NULL, NULL, NULL, 0, 5, 5, '08:00:00', '16:00:00', '19:00:00', '03:00:00', 3, 1),
  ('2023-06-6 22:00:00', NULL, NULL, NULL, NULL, 0, 0, 0, '22:00:00', '06:00:00', '10:00:00', '19:00:00', 3, 2),
  ('2023-06-6 20:00:00', NULL, NULL, NULL, NULL, 3, 3, 3, '20:00:00', '04:00:00', '07:00:00', '19:00:00', 3, 3),
  ('2023-06-6 08:00:00', NULL, NULL, NULL, NULL, 4, 4, 2, '08:00:00', '16:00:00', '19:00:00', '03:00:00', 2, 4),
  ('2023-06-6 22:00:00', NULL, NULL, NULL, NULL, 0, 0, 0, '22:00:00', '06:00:00', '10:00:00', '19:00:00', 2, 5),
  ('2023-06-6 06:00:00', NULL, NULL, NULL, NULL, 1, 5, 0, '06:00:00', '20:00:00', '22:00:00', '04:00:00', 2, 6),
  ('2023-06-6 20:00:00', NULL, NULL, NULL, NULL, 0, 0, 2, '20:00:00', '04:00:00', '07:00:00', '19:00:00', 2, 7),
  ('2023-06-6 08:00:00', 45, 22, 45, 0, 0, 5, 1, '08:00:00', '16:00:00', '19:00:00', '03:00:00', 1, 8),
  ('2023-06-6 22:00:00', 45, 22, 45, 0, 3, 3, 3, '22:00:00', '06:00:00', '10:00:00', '19:00:00', 1, 9),
  ('2023-06-6 06:00:00', 45, 22, 45, 0, 4, 4, 2, '06:00:00', '20:00:00', '22:00:00', '04:00:00', 1, 10),
  ('2023-06-6 22:00:00', 45, 22, 45, 0, 1, 5, 0, '22:00:00', '06:00:00', '10:00:00', '19:00:00', 1, 11),
  ('2023-06-6 06:00:00', 45, 22, 45, 0, 5, 0, 1, '06:00:00', '20:00:00', '22:00:00', '04:00:00', 1, 12),
  ('2023-06-6 20:00:00', 45, 22, 45, 0, 0, 0, 2, '20:00:00', '04:00:00', '07:00:00', '19:00:00', 1, 13);