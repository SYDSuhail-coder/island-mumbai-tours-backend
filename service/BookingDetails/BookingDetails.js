const mongo = require('../mongo/mongo')
const { ObjectId } = require("mongodb");

class BookingDetails {
    constructor() {
        this.mongo = new mongo();
    }

    createBookingDetails = (payload) => {
        return new Promise((resolve, reject) => {
            this.mongo.add(payload, 'BookingDetails').then((data) => {
                return resolve({ statusCode: 200, result: data })
            })
        })
    }

    getBookingDetails = (playoad) => {
        return new Promise((resolve, reject) => {
            let page = Number(playoad.from);
            let limit = Number(playoad.to);
            let skip = (page - 1) * limit;
            let sort = { createdAt: -1 };
            let query = {};
            this.mongo.findPagenation(query, sort, skip, limit, 'BookingDetails')
                .then((result) => {
                    this.mongo.findCount(query, 'BookingDetails').then((count) => {
                        return resolve({
                            statusCode: 200,
                            message: "success",
                            totalcount: count,
                            count: result?.data.length,
                            data: result.data
                        })
                    })
                })
        })
    }

    getBookingDetailsById = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { _id: new ObjectId(payload.id) };
            this.mongo.findOne(query, "BookingDetails")
                .then((data) => {
                    resolve({
                        statusCode: 200,
                        message: "success",
                        data: data
                    });
                })
        });
    }

    updateBookingDetails = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { _id: new ObjectId(payload.id) };
            this.mongo.update(query, payload, 'BookingDetails')
                .then((data) => resolve({ statusCode: 200, message: "Tour updated successfully!" }))
        })
    }

    deleteBookingDetails = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { _id: new ObjectId(payload.id) };
            this.mongo.delete(query, "BookingDetails")
                .then((data) => {
                    resolve({
                        statusCode: 200,
                        message: "Booking deleted successfully!"
                    });
                })
        });
    }
}
module.exports = BookingDetails;