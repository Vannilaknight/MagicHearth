var magicbus = require('magicbus');

var broker = magicbus.createBroker('domainTwo', 'UI', 'amqp://guest:guest@localhost/');
var subscriber = magicbus.createSubscriber(broker);


module.exports = function (server) {
    var io = require('socket.io')(3029);

    io.on('connection', function (socket) {
        console.log("io connected");

        subscriber.on('metrics', function (eventName, data, rawMessage) {
            console.log('Metrics Collected!');
            socket.emit('metrics', data.data);
        });

        subscriber.startSubscription();
        console.log("Subscriber started")
    });
};

function parseMetrics(data) {

    return metrics;
}