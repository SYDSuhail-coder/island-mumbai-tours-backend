const Mongo = require('../mongo/mongo');
const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");
const ObjectId = require("mongodb").ObjectId;

class ToursSection {
    constructor() {
        this.mongo = new Mongo();
    }

    // Cloudinary upload helper
    uploadToCloudinary(buffer) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "mumbai-tours" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    }

    createToursSection(payload) {
        return new Promise(async (resolve, reject) => {
            // coverImage upload
            let coverImageUrl = "";
            if (payload.coverImage && payload.coverImage.length > 0) {
                const upload = await this.uploadToCloudinary(payload.coverImage[0].buffer);
                coverImageUrl = upload.secure_url;
            }

            // images[] upload
            let imagesUrls = [];
            if (payload.images && payload.images.length > 0) {
                for (const file of payload.images) {
                    const upload = await this.uploadToCloudinary(file.buffer);
                    imagesUrls.push(upload.secure_url);
                }
            }
            const data = {
                title: payload.title,
                coverImage: coverImageUrl,
                images: imagesUrls,
                description: payload.description,
                duration: payload.duration,
                transport: payload.transport,
                location: payload.location,
                maxGuests: payload.maxGuests,
                pricePerPerson: payload.pricePerPerson,
                freeCancellation: payload.freeCancellation,
                rating: payload.rating,
                reviewsCount: payload.reviewsCount,
                badge: payload.badge,
                isActive: payload.isActive
            };

            this.mongo.add(data, 'Tours')
                .then(response => {
                    resolve({
                        statusCode: 200,
                        message: "success",
                        data: response.data
                    });
                })
        });
    }

    getTouresSectionAll(payload) {
        return new Promise((resolve, reject) => {
            let page = Number(payload.from);
            let limit = Number(payload.to);
            let skip = (page - 1) * limit;
            let sort = { createdAt: -1 };
            let query = {};
            this.mongo.findPagenation(query, sort, skip, limit, 'Tours')
                .then((result) => {
                    this.mongo.findCount(query, 'Tours').then((count) => {
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

    getTouresSectionById = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { slug: payload.slug };
            this.mongo.findOne(query, 'Tours')
                .then((data) => {
                    resolve({
                        statusCode: 200,
                        message: "success",
                        result: data
                    });
                })
        });
    }

    deleteTouresSectionById = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { slug: payload.slug };
            this.mongo.delete(query, 'Tours')
                .then((data) => {
                    resolve({
                        statusCode: 200,
                        message: "success",
                        result: data
                    });
                })
        });
    }



}

module.exports = ToursSection;