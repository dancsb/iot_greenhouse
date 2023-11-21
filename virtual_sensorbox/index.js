const mqtt = require('mqtt');

const serialNumbers = ['524352', '827233', '327314'];
const numDevices = 3;

const deviceStates = [[25.0, 60.0, 700.0, 200.0], [15.0, 34.0, 600.0, 350.5], [31.0, 45.0, 1000.0, 100.0]];

function createVirtualDevice(deviceIndex) {
    const options = {
        clientId: `sensorbox_${serialNumbers[deviceIndex]}`,
        username: 'ESP32',
        password: 'yOjFxF5f42Kjq2X',
        port: 8883,
        protocolVersion: 5
    };

    const client = mqtt.connect('mqtts://mqtt.dancs.org', options);

    client.on('connect', () => {
        console.log(`Connected to MQTT broker for device ${serialNumbers[deviceIndex]}`);

        setInterval(() => {
            deviceStates[deviceIndex][0] += getRandomChange(5);
            deviceStates[deviceIndex][1] += getRandomChange(5);
            deviceStates[deviceIndex][2] += getRandomChange(20);
            deviceStates[deviceIndex][3] += getRandomChange(15);

            deviceStates[deviceIndex][0] = clamp(deviceStates[deviceIndex][0], 20.0, 40.0);
            deviceStates[deviceIndex][1] = clamp(deviceStates[deviceIndex][1], 20.0, 80.0);
            deviceStates[deviceIndex][2] = clamp(deviceStates[deviceIndex][2], 500.0, 1500.0);
            deviceStates[deviceIndex][3] = clamp(deviceStates[deviceIndex][3], 0.0, 1000.0);

            const topic = `sensorbox/${serialNumbers[deviceIndex]}/readings`;

            const message = JSON.stringify({
                temp: parseFloat(deviceStates[deviceIndex][0].toFixed(1)),
                hum: parseFloat(deviceStates[deviceIndex][1].toFixed(1)),
                CO2: parseFloat(deviceStates[deviceIndex][2].toFixed(1)),
                light: parseFloat(deviceStates[deviceIndex][3].toFixed(1))
            });

            client.publish(topic, message, (err) => {
                if (!err) {
                    console.log(`Message sent to ${topic}: ${message}`);
                } else {
                    console.error('Error publishing message:', err);
                }
            });
        }, 5000);
    });

    return client;
}

function getRandomChange(multiplier = 1.0) {
    return (Math.random() - 0.5) * multiplier;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

const virtualDevices = [];

for (let i = 0; i < numDevices; i++) {
    const device = createVirtualDevice(i);
    virtualDevices.push(device);
}

process.on('SIGINT', () => {
    console.log('Caught interrupt signal. Closing MQTT connections...');
    virtualDevices.forEach((device) => {
        device.end();
    });
    process.exit();
});
