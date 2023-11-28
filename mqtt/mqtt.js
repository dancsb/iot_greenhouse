const mqtt = require('mqtt');

const GreeneryModel = require('../models/greenery');
const SensorboxModel = require('../models/sensorbox');
const LogModel = require('../models/log');

const getGreeneryMW = require('../middleware/greenery/getGreeneryMW');
const getSensorboxesMW = require('../middleware/sensorbox/getSensorboxesMW');

module.exports = function(sensorboxRepo) {

    const dummyRes = { locals: {} };
    getSensorboxesMW({ SensorboxModel: SensorboxModel})({}, dummyRes, () => {
        sensorboxRepo.push(...dummyRes.locals.sensorboxes.map(sensorbox => ({
            serialNumber: sensorbox.serialNumber,
            greenery: sensorbox._greenery
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
        });

        client.on('message', (topic, message) => {
            const sliced = topic.toString().split('/');
            if (sliced.length > 2 && sliced[2] === 'readings') {
                if (!sensorboxRepo.some(entry => entry.serialNumber === sliced[1])) {
                    sensorboxRepo.push({ serialNumber: sliced[1], greenery: null });
                    sensorboxRepo.sort((a, b) => a.serialNumber - b.serialNumber);
                }
                else if (sensorboxRepo.find(entry => entry.serialNumber === sliced[1]).greenery) {
                    const parsed = JSON.parse(message.toString());
                    const dummyReq = { params: { greeneryid: sensorboxRepo.find(entry => entry.serialNumber === sliced[1]).greenery } };
                    const constarints = { locals: {} };
                    getGreeneryMW({ GreeneryModel: GreeneryModel})(dummyReq, constarints, () => {
                        if(parsed.hasOwnProperty('temp') && typeof constarints.locals.greenery.tempLowThreshold !== 'undefined'){
                            if(parsed.temp < constarints.locals.greenery.tempLowThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ heater: true }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'heater on';
                                log.save();
                            }
                            if(parsed.temp > constarints.locals.greenery.tempHighThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ heater: false }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'heater off';
                                log.save();
                            }
                        }
                        if(parsed.hasOwnProperty('hum') && typeof constarints.locals.greenery.humLowThreshold !== 'undefined'){
                            if(parsed.hum < constarints.locals.greenery.humLowThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ humidifier: true }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'humidifier on';
                                log.save();
                            }
                            if(parsed.hum > constarints.locals.greenery.humHighThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ humidifier: false }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'humidifier off';
                                log.save();
                            }
                        }
                        if(parsed.hasOwnProperty('CO2') && typeof constarints.locals.greenery.CO2LowThreshold !== 'undefined'){
                            if(parsed.CO2 < constarints.locals.greenery.CO2LowThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ vent: true }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'vent on';
                                log.save();
                            }
                            if(parsed.CO2 > constarints.locals.greenery.CO2HighThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ vent: false }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'vent off';
                                log.save();
                            }
                        }
                        if(parsed.hasOwnProperty('moist') && typeof constarints.locals.greenery.moistLowThreshold !== 'undefined'){
                            if(parsed.moist < constarints.locals.greenery.moistLowThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ water: true }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'water on';
                                log.save();
                            }
                            if(parsed.moist > constarints.locals.greenery.moistHighThreshold){
                                client.publish(`sensorbox/${sliced[1]}/command`, JSON.stringify({ water: false }));
                                log = new LogModel();
                                log.serialNumber = sliced[1];
                                log.action = 'water off';
                                log.save();
                            }
                        }
                    });
                }
            }
            
        });

        client.on('error', (err) => {
            console.error('Error:', err);
        });
    });
};