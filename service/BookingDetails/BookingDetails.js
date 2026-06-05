const mongo = require('../mongo/mongo')

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

    getBookingDetails = () => {
        return new Promise((resolve, reject) => {
            this.mongo.find({}, 'BookingDetails')
                .then((data) => {
                    return resolve({ statusCode: 200, result: data})
                })
        })
    }
    

    updateBookingDetails = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { tourName: payload.tourName };
            this.mongo.update(query, payload, 'BookingDetails')
                .then((data) => resolve({ statusCode: 200, message: "Tour updated successfully!"}))
        })
    }
}
module.exports = BookingDetails;