const mongo = require('../mongo/mongo');

class BookingSection {
    constructor() {
        this.mongo = new mongo();
    }

    createBookingSection = (payload) => {
        return new Promise(async (resolve, reject) => {
            try {
                const existing = await this.mongo.findOne(
                    {
                        email: payload.email,
                        tour: payload.tour,
                        date: new Date(payload.date)  // date compare ke liye
                    },
                    'bookingSection'
                );

                if (existing && existing.data) {
                    return reject({
                        statusCode: 409,
                        message: "You've already booked this tour for the selected date."
                    });
                }

                // Tour price fetch karo
                const tourData = await this.mongo.findOne({ tourName: payload.tour }, 'BookingDetails');
                const tour = tourData.data;

                if (!tour) {
                    return reject({ statusCode: 400, message: "Invalid tour selected" });
                }

                // totalAmount calculate karo
                const totalAmount =
                    tour.adultPrice * Number(payload.adults) +
                    tour.childPrice * Number(payload.children);

                const finalPayload = { ...payload, totalAmount };

                this.mongo.add(finalPayload, 'bookingSection')
                    .then((data) => resolve({ statusCode: 200, result: data }))
                    .catch((err) => reject(err));

            } catch (err) {
                return reject(err);
            }
        });
    }

    getBookingSection = () => {
        return new Promise((resolve, reject) => {
            this.mongo.find({}, 'bookingSection')
                .then((data) => resolve({ statusCode: 200, result: data }))
                .catch((err) => reject(err))
        })
    }
}

module.exports = BookingSection;