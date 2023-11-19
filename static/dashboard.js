var initialData = {
    labels: [],
    datasets: [{
        label: 'Temperature',
        data: [],
        backgroundColor: 'rgba(191, 78, 78, 0.2)',
        borderColor: 'rgba(191, 78, 78, 1)',
        borderWidth: 1
    }]
};

var options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};

var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'line',
    data: initialData,
    options: options
});

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    myChart.update();
}

function removeOldData(chart) {
    if (chart.data.labels.length > 30) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
        myChart.update();
    }
}
var xd = 0;

const topics = ['sensorbox/327314/#'];

const mqtt_options = {
    clientId: `dashboard-${Math.random().toString(16).substring(2, 10)}`,
    username: 'Monitoring',
    password: '8aT239aV6A3MNa5',
    port: 8084,
    protocolVersion: 5
};

const client = mqtt.connect('wss://mqtt.dancs.org/mqtt', mqtt_options);
console.log(client);

client.on('connect', () => {
    client.subscribe(topics, (err) => {
        if (err)
            console.error('Error subscribing to topics:', err);
    });
});

client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
    addData(myChart, xd++, message.toString());
    removeOldData(myChart);
});

client.on('error', (err) => {
    console.error('Error:', err);
});
