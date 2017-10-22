// process.on('unhandledRejection', (reason, p) => {
//     console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
//     // application specific logging, throwing an error, or other logic here
// });

Promise.resolve()
    .then(require('./setSetter.js'))
    .then(require('./cardCounter.js'))
    .then(require('./flipSetter.js'))
    .then(require('./banApply.js'))
    .then(require('./formatter.js'))
    .catch(function (err) {
        console.log(err)
    });