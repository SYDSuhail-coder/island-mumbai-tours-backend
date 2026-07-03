const mongo = require('../mongo/mongo');

class BookingSection {
    constructor() {
        this.mongo = new mongo();
    }

    createBookingSection = (payload) => {
        return new Promise(async (resolve, reject) => {
            // Duplicate check
            const existing = await this.mongo.findOne(
                {
                    email: payload.email,
                    tour: payload.tour,
                    date: new Date(payload.date)
                },
                'bookingSection'
            );

            if (existing && existing.data) {
                return reject({
                    statusCode: 409,
                    message: "You've already booked this tour for the selected date."
                });
            }

            let totalAmount = 0;

            if (payload.bookingType === "book-now-page") {
                const tourData = await this.mongo.findOne({ tourName: payload.tour }, 'BookingDetails');
                const tour = tourData.data;
                if (!tour) return reject({ statusCode: 400, message: "Invalid tour selected" });
                totalAmount = tour.adultPrice * Number(payload.adults) + tour.childPrice * Number(payload.children);

            } else if (payload.bookingType === "walking-tour") {
                const tourData = await this.mongo.findOne({ slug: payload.slug }, 'Walking-Tours');
                const tour = tourData.data;
                if (!tour) return reject({ statusCode: 400, message: "Invalid tour selected" });
                const childPrice = Number(String(tour.child).replace(/\D/g, "")) || 500;
                totalAmount = tour.pricePerPerson * Number(payload.adults) + childPrice * Number(payload.children);

            } else if (payload.bookingType === "private-tour") {
                const tourData = await this.mongo.findOne({ slug: payload.slug }, 'Private-Tours');
                const tour = tourData.data;
                if (!tour) return reject({ statusCode: 400, message: "Invalid tour selected" });
                const childPrice = Number(String(tour.child).replace(/\D/g, "")) || 500;
                totalAmount = tour.pricePerPerson * Number(payload.adults) + childPrice * Number(payload.children);

            } else if (payload.bookingType === "tours") {
                const tourData = await this.mongo.findOne({ slug: payload.slug }, 'Tours');
                const tour = tourData.data;
                if (!tour) return reject({ statusCode: 400, message: "Invalid tour selected" });
                const childPrice = Number(String(tour.child).replace(/\D/g, "")) || 500;
                totalAmount = tour.pricePerPerson * Number(payload.adults) + childPrice * Number(payload.children);

            } else {
                return reject({ statusCode: 400, message: "Invalid booking type" });
            }

            const finalPayload = { ...payload, totalAmount };

            this.mongo.add(finalPayload, 'bookingSection')
                .then((data) => resolve({ statusCode: 200, message: "success", result: data }))

        });
    }

    getBookingSection = (payload) => {
        return new Promise((resolve, reject) => {
            let page = Number(payload.from) || 1;
            let limit = Number(payload.to) || 10;
            let skip = (page - 1) * limit;
            let sort = { createdAt: -1 };
            let query = {};
            this.mongo.findPagenation(
                query,
                sort,
                skip,
                limit,
                "bookingSection"
            )
                .then((result) => {
                    this.mongo.findCount(
                        query,
                        "bookingSection"
                    )
                        .then((count) => {
                            resolve({
                                statusCode: 200,
                                message: "success",
                                totalcount: count,
                                count: result?.data?.length || 0,
                                data: result.data
                            });
                        });
                })
        });
    }

    getBookingById = (payload) => {
        return new Promise((resolve, reject) => {
            const query = ({ bookingId: payload.bookingId });
            this.mongo.findOne(query, 'bookingSection')
                .then((data) => {
                    if (!data || !data.data) return reject({ statusCode: 404, message: "Booking not found" });
                    resolve({ statusCode: 200, message: "success", result: data.data });
                })
        });
    }

    updateBookingStatus = (payload) => {
        return new Promise((resolve, reject) => {
            const updateFields = {
                bookingStatus: payload.bookingStatus,
                updatedAt: new Date()
            };

            if (payload.guideName !== undefined) {
                updateFields.guideName = payload.guideName;
            }

            if (payload.bookingStatus === "Cancelled") {
                updateFields.guideName = "";
            }

            if (payload.bookingStatus === "Confirmed") {
                updateFields.confirmedAt = new Date();
            }

            this.mongo.findOneAndUpdate(
                { bookingId: payload.bookingId },
                updateFields,
                "bookingSection"
            )
                .then((data) => {
                    if (!data || !data.data) {
                        return reject({
                            statusCode: 404,
                            message: "Booking not found"
                        });
                    }

                    resolve({
                        statusCode: 200,
                        message: "Booking status updated successfully",
                        result: data.data
                    });
                })
                .catch((err) => reject(err));
        });
    };

}

module.exports = BookingSection;