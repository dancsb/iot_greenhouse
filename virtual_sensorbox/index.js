const mqtt = require('mqtt');

const serialNumbers = ['524352', '827233', '327314'];
const numDevices = 3;

const deviceStates = [[25.0, 60.0, 700.0, 20.0], [15.0, 34.0, 600.0, 35.5], [31.0, 45.0, 1000.0, 10.0]];

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
            deviceStates[deviceIndex][3] += getRandomChange(5);

            deviceStates[deviceIndex][0] = clamp(deviceStates[deviceIndex][0], 20.0, 40.0);
            deviceStates[deviceIndex][1] = clamp(deviceStates[deviceIndex][1], 20.0, 80.0);
            deviceStates[deviceIndex][2] = clamp(deviceStates[deviceIndex][2], 500.0, 1500.0);
            deviceStates[deviceIndex][3] = clamp(deviceStates[deviceIndex][3], 0.0, 80.0);

            const temperatureTopic = `sensorbox/${serialNumbers[deviceIndex]}/temp`;
            const humidityTopic = `sensorbox/${serialNumbers[deviceIndex]}/hum`;
            const CO2Topic = `sensorbox/${serialNumbers[deviceIndex]}/CO2`;
            const moistureTopic = `sensorbox/${serialNumbers[deviceIndex]}/moist`;

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

            client.publish(CO2Topic, deviceStates[deviceIndex][2].toFixed(1), (err) => {
                if (!err) {
                    console.log(`CO2 message sent to ${CO2Topic}: ${deviceStates[deviceIndex][2].toFixed(1)}`);
                } else {
                    console.error('Error publishing pressure message:', err);
                }
            });

            client.publish(moistureTopic, deviceStates[deviceIndex][3].toFixed(1), (err) => {
                if (!err) {
                    console.log(`Moisture message sent to ${moistureTopic}: ${deviceStates[deviceIndex][3].toFixed(1)}`);
                } else {
                    console.error('Error publishing moisture message:', err);
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
