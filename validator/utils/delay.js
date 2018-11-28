/**
    return Promise.resolve()
        .then(() => delay(3000, 'ok'))

 */
const delay = (time, data) =>
    new Promise(
        resolve => time ? setTimeout(resolve, time, data) : resolve(data)
    )
;
/**
    return Promise.resolve()
        .then(
            () => delay(3000, 'ok')
            () => delay.reject(3000, 'error')
        )

 */
const reject = (time, data) =>
    new Promise(
        (resolve, reject) => time ? setTimeout(reject, time, data) : reject(data)
    )
;

/**
 * Promise.reject('test')
 *     .then(...then(1000))
 *     .catch(data => console.log(data))
 * ;
 * Promise.resolve('test')
 *     .then(...then(1000))
 *     .then(data => console.log(data))
 * ;
 * @param time
 */

const then = time => ([
    data => delay(time, data),
    data => delay.reject(time, data)
]);

delay.reject    = reject;

delay.then      = then;

module.exports = delay;
