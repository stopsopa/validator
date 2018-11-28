
module.exports = (function () {
    try {
        return (...args) => {

            args = [
                (new Date()).toISOString().substring(0, 19).replace('T', ' '),
                ': ',
                ...args,
                "\n"
            ];

            process.stdout.write(args.join(''));
        }
    }
    catch (e) {
        return () => {};
    }
}());