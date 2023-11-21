const mqtt = require('mqtt');

const SensorboxModel = require('../models/sensorbox');
const getSensorboxesMW = require('../middleware/sensorbox/getSensorboxesMW');

module.exports = function(sensorboxRepo) {

    const dummyRes = { locals: {} };
    getSensorboxesMW({ SensorboxModel: SensorboxModel})({}, dummyRes, () => {
        sensorboxRepo.push(...dummyRes.locals.sensorboxes.map(sensorbox => ({
            serialNumber: sensorbox.serialNumber,
            acknowledged: true
        })));

        const mqtt_options = {
            clientId: `WebServer_${Math.random().toString(16).substring(2, 10)}`,
            username: 'WebServer',
            password: 'LX1xu0I8LrloDeR',
            port: 8084,
            protocolVersion: 5
        };

        const client = mqtt.connect('wss://mqtt.dancs.org/mqtt', mqtt_options);

        client.on('connect', () => {
            client.subscribe('sensorbox/#', (err) => {
                if (err)
                    console.error('Error subscribing to topics:', err);
            });
            sensorboxRepo.push({ serialNumber: '666666', acknowledged: true });
        });

        client.on('message', (topic, _) => {
            const sliced = topic.toString().split('/');
            if (sliced.length > 1 && sliced[0] === 'sensorbox' && !sensorboxRepo.some(entry => entry.serialNumber === sliced[1])) {
                sensorboxRepo.push({ serialNumber: sliced[1], acknowledged: false });
                sensorboxRepo.sort((a, b) => a.serialNumber - b.serialNumber);
            }
        });

        client.on('error', (err) => {
            console.error('Error:', err);
        });
    });
};