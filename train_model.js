const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const csv = require('csv-parser');

// Завантаження даних
const sleepData = [];
fs.createReadStream('data/sleep_data.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Перетворення значень в числовий формат
    row.brightness = parseFloat(row.brightness);
    row.noise = parseFloat(row.noise);
    row.humidity = parseFloat(row.humidity);
    row.temperature = parseFloat(row.temperature);
    row.sleep_quality = parseFloat(row.sleep_quality);

    // Перевірка на NaN та Infinity
    if (isNaN(row.brightness) || isNaN(row.noise) || isNaN(row.humidity) || isNaN(row.temperature) || isNaN(row.sleep_quality)) {
      console.error('Invalid data detected:', row);
      return;
    }
    
    // Додавання нормалізованих значень у масив
    sleepData.push([
      row.brightness / 100, // Нормалізація значень освітлення
      row.noise / 100, // Нормалізація рівня шуму
      row.humidity / 100, // Нормалізація рівня вологості
      row.temperature / 100, // Нормалізація температури
      row.sleep_quality
    ]);
  })
  .on('end', () => {
    // Перетворення даних у тензори
    const data = tf.tensor2d(sleepData.map(d => d.slice(0, 4)), [sleepData.length, 4]);
    const labels = tf.tensor2d(sleepData.map(d => [d[4]]), [sleepData.length, 1]);

    // Побудова та тренування моделі
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [4] }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: 'meanSquaredError'
    });

    model.fit(data, labels, {
      epochs: 100,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1} / 100`);
          console.log('loss = ', logs.loss);
        }
      }
    }).then(async () => {
      console.log('Training complete');
      // Збереження моделі
      await model.save('file://./model');
      console.log('Model saved');
    }).catch(err => {
      console.error('Error during training:', err);
    });
  });

