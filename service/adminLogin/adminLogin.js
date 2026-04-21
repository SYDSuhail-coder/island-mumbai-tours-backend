const Mongo = require('../mongo/mongo');
class adminLogin {
    constructor() {
        this.Mongo = new Mongo();
    }

    createAdminLogin = (payload) => {
        return new Promise(async (resolve, reject) => {
            if (payload.createdAt == undefined) {
                payload.createdAt = new Date(Date.now() + (5 * 60 * 60 * 1000) + (30 * 60 * 1000));
            }
            this.Mongo.findOne({ userName: payload.userName }, 'adminLogin').then(result => {
                if (result && result.data) {
                    return resolve({
                        statusCode: 409,
                        errorType: "userName_EXISTS",
                        message: "userName already exists"
                    });
                }
                this.Mongo.add(payload, 'adminLogin').then((data) => {
                    return resolve({ statusCode: 200, message: "success", result: data });
                })
            })
        });
    };

    getAdminLogin = (payload) => {
        return new Promise(async (resolve, reject) => {
            const Query = { userName: payload.userName, isDeleted: 0 };
            this.Mongo.find(Query, 'adminLogin')
                .then(result => {
                    if (result.data.length === 0) {
                        return resolve({
                            statusCode: 401,
                            errorType: "userName",
                            message: "Invalid userName"
                        });
                    }
                    const passwordQuery = { userName: payload.userName, password: payload.password, isDeleted: 0 };
                    this.Mongo.find(passwordQuery, 'adminLogin')
                        .then(result2 => {
                            if (result2.data.length === 0) {
                                return resolve({
                                    statusCode: 401,
                                    errorType: "PASSWORD",
                                    message: "Invalid password"
                                });
                            }
                            const user = result2.data[0];
                            let roleQuery = { id: user.roleId };
                            this.Mongo.findOne(roleQuery, "roles").then(roleData => {
                                return resolve({
                                    statusCode: 200,
                                    userInfo: user,
                                    roleInfo: roleData.data,
                                });
                            })
                        });
                })
        });
    };


    listAdminLogin = (payload) => {
        return new Promise((resolve, reject) => {
            let page = Number(payload.from);
            let limit = Number(payload.to);
            let skip = (page - 1) * limit;
            let sort = { createdAt: -1 };
            let query = {};
            this.Mongo.findPagenation(query, sort, skip, limit, 'adminLogin')
                .then((result) => {
                    this.Mongo.findCount(query, 'adminLogin').then((count) => {
                        return resolve({
                            statusCode: 200,
                            message: "success",
                            totalcount: count,
                            count: result?.data.length,
                            data: result.data
                        });
                    })
                })
        });
    };

    deleteAdminLoginById = (paylaod) => {
        return new Promise((resolve, reject) => {
            let query = { _id: paylaod.id }
            this.Mongo.delete(query, "adminLogin").then((data) => {
                return resolve({ result: data, statusCode: 200 });
            }).catch(err => {
                return reject(err)
            })
        })
    }
}

module.exports = adminLogin;