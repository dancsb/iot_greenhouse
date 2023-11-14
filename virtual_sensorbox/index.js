const mqtt = require('mqtt');

const serialNumbers = ['524352', '827233', '327314'];
const numDevices = 3;

const deviceStates = [[25.0, 60.0], [15.0, 34.0], [31.0, 45.0]];

function createVirtualDevice(deviceIndex) {
    const options = {
        clientId: `sensorbox_${serialNumbers[deviceIndex]}`,
        username: 'ESP32',
        password: 'yOjFxF5f42Kjq2X',
        port: 8883
    };

    const client = mqtt.connect('mqtts://mqtt.dancs.org', options);

    client.on('connect', () => {
        console.log(`Connected to MQTT broker for device ${serialNumbers[deviceIndex]}`);

        setInterval(() => {
            deviceStates[deviceIndex][0] += getRandomChange();
            deviceStates[deviceIndex][1] += getRandomChange();

            deviceStates[deviceIndex][0] = clamp(deviceStates[deviceIndex][0], 20.0, 40.0);
            deviceStates[deviceIndex][1] = clamp(deviceStates[deviceIndex][1], 20.0, 80.0);

            const temperatureTopic = `sensorbox/${serialNumbers[deviceIndex]}/temperature`;
            const humidityTopic = `sensorbox/${serialNumbers[deviceIndex]}/humidity`;

            client.publish(temperatureTopic, deviceStates[deviceIndex][0].toFixed(1), (err) => {
                if (!err) {
                    console.log(`Temperature message sent to ${temperatureTopic}: ${deviceStates[deviceIndex][0].toFixed(1)}`);
                } else {
                    console.error('Error publishing temperature message:', err);
                }
            });

            client.publish(humidityTopic, deviceStates[deviceIndex][1].toFixed(1), (err) => {
                if (!err) {
                    console.log(`Humidity message sent to ${humidityTopic}: ${deviceStates[deviceIndex][1].toFixed(1)}`);
                } else {
                    console.error('Error publishing humidity message:', err);
                }
            });
        }, 5000);
    });

    return client;
}

function getRandomChange() {
    return (Math.random() - 0.5) * 0.5;
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
