const Mongo = require('../mongo/mongo');

class Roles {
    constructor() {
        this.mongo = new Mongo();
    }

    addRoles = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { role_name: payload.name }
            this.mongo.find(query, 'roles').then(result => {
                if (result.data.length != 0) {
                    return resolve({ statusCode: 400, message: "already exist" })
                }
                payload.createdAt = new Date(Date.now() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
                if (payload.id == undefined) {
                    let date1 = new Date();
                    let date2 = date1.getTime();
                    let uniqueId = date2.toString().substring(4);
                    let randomNumber = Math.floor(Math.random() * 10000);
                    payload.id = Number(uniqueId) + randomNumber;
                }
                this.mongo.add(payload, 'roles').then(response => {
                    return resolve({ statusCode: 200, message: "success", data: response.Data })
                })
            })
        })
    }


    getRoles = (paylaod) => {
        return new Promise((resolve, reject) => {
            let query = {};
            this.mongo.find(query, 'roles', paylaod).then(result => {
                return resolve({ statusCode: 200, data: result, message: "success" })
            })
        })
    }

    updateRoles = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { id: payload.id }
            payload.updatedAt = new Date(Date.now() + 5 * 60 * 60 * 1000 + 30 * 60 * 60 * 1000);
            this.mongo.update(query, payload, 'roles').then(result => {
                if (result.data.length != 0 && result.data.modifiedCount != 0) {
                    return resolve({ statusCode: 200, message: "roles update successfully" })
                } else {
                    return resolve({ statusCode: 400, message: "roles not updated" })
                }
            })
        })
    }

}

module.exports = Roles;