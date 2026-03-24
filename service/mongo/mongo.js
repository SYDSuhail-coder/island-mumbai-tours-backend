const mongoose = require('mongoose');

class Mongo {
    constructor() { }

    addBulk = (params, modelName) => {
        let model = mongoose.model(modelName)
        return new Promise((resolve, reject) => {
            model.insertMany(params).then(result => {
                resolve(result);
            }).catch(err => {
                console.log('Addition Error: ' + err)
                if (err.name == 'ValidationError') {
                    reject({ error: err.message });
                } else {
                    reject('Something went wrong');
                }
            });
        });
    }

    add = (payload, modelName) => {
        let Model = mongoose.model(modelName)
        let model = new Model(payload);
        return new Promise((resolve, reject) => {
            model.save().then(result => {
                resolve({ data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    update = (query, payload, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.updateOne(query, payload).then(result => {
                resolve({ data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    updateMany = (query, payload, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.updateMany(query, payload).then(result => {
                resolve({ data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    find = (query, modelName) => {
        
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.find(query).then(result => {
                resolve({ identifier: 'mongo', data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    findCount = (query, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            // Model.find(query).count().then(result => {
                Model.countDocuments(query).then(result => {
                resolve(result);
            }).catch(err => {
                reject({ error: err.message });
            });
        });
    }

    findOne = (query, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.findOne(query).then(result => {
                resolve({ identifier: 'mongo', data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    distinct = (query, name, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.find(query).distinct(name).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

    findPagenation = (query, sort, skip, limit, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.find(query).sort(sort).skip(skip).limit(limit).then(result => {
                resolve({ identifier: 'mongo', data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    paginationFind = (query, skip, limit, modelName) => {
        let Model =  mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.find(query).skip(skip).limit(limit).then(result => {
                if (result.length == 0) {
                    resolve({ message: 'Data not found!!!!', data: result });
                } else {
                    resolve({ data: result });
                }
            }).catch(err => {
                reject({ message: 'Something went wrong', error: err });
            });
        });
    }

    findAndSort = (query, sort, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.find(query).sort(sort).then(result => {
                resolve({ identifier: 'mongo', data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    aggregate = (query, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.aggregate(query).then(result => {
                resolve({ identifier: 'mongo', data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    findProject = (query,project,modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.find(query).select(project).then(result => {
                resolve({ identifier: 'mongo', data: result });
            }).catch(err => {
                reject({ error: err.message });
            });
        });
    }

    delete = (query, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.deleteOne(query).then(result => {
                resolve({ data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }

    deleteMany = (query, modelName) => {
        let Model = mongoose.model(modelName);
        return new Promise((resolve, reject) => {
            Model.deleteMany(query).then(result => {
                resolve({ data: result });
            }).catch(err => {
                reject(err);
            });
        });
    }
}
module.exports = Mongo;