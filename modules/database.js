/**
 * Created by milosberka on 24.4.2017.
 */
'use strict';
class Database {
    constructor() {
        this.mongoose.require('mongoose');
        this.mongoose.Promise = global.Promise;
    };

    connect(url, resolve, reject) {
        this.url = url;
        this.mongoose.connect(this.url).then(() => {
            resolve('Connected to DB');
        }, (err) => {
            reject('Error connecting to DB with message: ' + err.message);
        });
    };

    getModelFromSchema(name, schema) {
        const s = new this.mongoose.Schema(schema);
        return this.mongoose.model(name, s);
    }
}
module.exports = new Database();
