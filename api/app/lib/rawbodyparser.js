exports.rawParser = function (req, res, next) {
    let data = new Buffer('');
    req.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
    });
    req.on('end', () => {
        req.body = data;
        next();
    });
};
