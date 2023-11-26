var initialData = {
    datasets: [{
        borderWidth: 1
    }]
};

var options = {
    scales: {
        x: {
            display: false,
        },
        y: {
            beginAtZero: true
        }
    }
};

function createChart(serialNumber, label, color) {
    var ctx = document.getElementById(serialNumber + '-' + label).getContext('2d');

    const [red, green, blue] = color;

    switch(label) {
        case 'temp':
            initialData.datasets[0].label = 'Temperature';
            break;
        case 'hum':
            initialData.datasets[0].label = 'Humidity';
            break;
        case 'CO2':
            initialData.datasets[0].label = 'CO2';
            break;
        case 'moist':
            initialData.datasets[0].label = 'moist';
            break;
    }

    initialData.datasets[0].backgroundColor = `rgba(${red}, ${green}, ${blue}, 0.2)`;
    initialData.datasets[0].borderColor = `rgba(${red}, ${green}, ${blue}, 1)`;

    return myChart = new Chart(ctx, {
        type: 'line',
        data: JSON.parse(JSON.stringify(initialData)),
        options: options
    });
}

const charts = {};

sensorboxes.forEach(serialNumber => {
    const tempChart = createChart(serialNumber, 'temp', [191, 78, 78]);
    const humChart = createChart(serialNumber, 'hum', [78, 191, 78]);
    const CO2Chart = createChart(serialNumber, 'CO2', [215, 215, 215]);
    const moistChart = createChart(serialNumber, 'moist', [78, 78, 191]);

    charts[serialNumber] = {
        temp: tempChart,
        hum: humChart,
        CO2: CO2Chart,
        moist: moistChart
    };
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
    removeOldData(chart);
}

function removeOldData(chart) {
    if (chart.data.labels.length > 15) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
        chart.update();
    }
}

const mqtt_options = {
    clientId: `dashboard_${Math.random().toString(16).substring(2, 10)}`,
    username: 'Monitoring',
    password: '8aT239aV6A3MNa5',
    port: 8084,
    protocolVersion: 5
};

const client = mqtt.connect('wss://mqtt.dancs.org/mqtt', mqtt_options);

client.on('connect', () => {
    client.subscribe(sensorboxes.map(element => `sensorbox/${element}/#`), (err) => {
        if (err)
            console.error('Error subscribing to topics:', err);
    });
});

client.on('message', (topic, message) => {
    const sliced = topic.toString().split('/');
    const parsed = JSON.parse(message.toString());
    const date = new Date().toLocaleString();
    if (sliced.length > 2 && sliced[0] === 'sensorbox' && charts.hasOwnProperty(sliced[1]) && sliced[2] === 'readings') {
        if (parsed.hasOwnProperty('temp'))
            addData(charts[sliced[1]].temp, date, parsed.temp);
        if (parsed.hasOwnProperty('hum'))
            addData(charts[sliced[1]].hum, date, parsed.hum);
        if (parsed.hasOwnProperty('CO2'))
            addData(charts[sliced[1]].CO2, date, parsed.CO2);
        if (parsed.hasOwnProperty('moist'))
            addData(charts[sliced[1]].moist, date, parsed.moist);
    }
});

client.on('error', (err) => {
    console.error('Error:', err);
});
