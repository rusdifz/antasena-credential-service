"use strict";
const app = require('express')();
module.exports = function makeExpressCallback(controller, camelcaseKeys) {
    return (req, res) => {
        const httpRequest = {
            body: camelcaseKeys(req.body, { deep: true }),
            query: camelcaseKeys(req.query, { deep: true }),
            params: camelcaseKeys(req.params, { deep: true }),
            ip: req.ip,
            method: req.method,
            path: req.path,
            file: req.file,
            token: req.headers.authorization,
            headers: {
                'Content-Type': req.get('Content-Type'),
                Referer: req.get('referer'),
                'User-Agent': req.get('User-Agent')
            }
        };
        controller(httpRequest)
            .then(httpResponse => {
            if (httpResponse.headers) {
                httpResponse.headers.VersionApp = '1.0.18';
                res.set(httpResponse.headers);
            }
            if (httpResponse.downloadfile) {
                console.log('download file', httpResponse.body.nameFile);
                const filename = httpResponse.body.nameFile;
                const basedir = __dirname;
                const dirname = basedir.toString().replace(/call-back/g, "use-case/file");
                res.download(dirname + '/' + filename, function (err) {
                    if (err) {
                        res.status(500).send({ message: "Could not download the file. " + err, });
                    }
                });
            }
            else {
                res.type('json');
                res.status(httpResponse.statusCode).send(httpResponse.body);
            }
        })
            .catch(e => {
            res.status(500).send({ error: 'An unkown error occurred.' });
        });
    };
};
