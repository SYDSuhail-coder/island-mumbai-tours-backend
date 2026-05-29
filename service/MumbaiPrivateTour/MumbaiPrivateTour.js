const Mongo = require('../mongo/mongo');
const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");
const ObjectId = require("mongodb").ObjectId;

class MumbaiPrivateTour {
    constructor() {
        this.mongo = new Mongo();
    }

    // Cloudinary upload helper
    uploadToCloudinary(buffer) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "mumbai-tours-private" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            streamifier.createReadStream(buffer).pipe(stream);
        });
    }

    createMumbaiPrivateTour(payload) {
        return new Promise(async (resolve, reject) => {
            let coverImageUrl = "";
            if (
                payload.coverImage &&
                Array.isArray(payload.coverImage) &&
                payload.coverImage.length > 0
            ) {
                const upload = await this.uploadToCloudinary(
                    payload.coverImage[0].buffer
                );
                coverImageUrl = upload.secure_url;
            }
            else if (typeof payload.coverImage === "string") {
                coverImageUrl = payload.coverImage;
            }
            let imagesUrls = [];
            if (
                payload.images &&
                Array.isArray(payload.images) &&
                payload.images.length > 0 &&
                payload.images[0].buffer
            ) {
                for (const file of payload.images) {
                    const upload = await this.uploadToCloudinary(
                        file.buffer
                    );
                    imagesUrls.push(upload.secure_url);
                }
            }
            else if (Array.isArray(payload.images)) {
                imagesUrls = payload.images;
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
                child: payload.child,
                freeCancellation: payload.freeCancellation,
                rating: payload.rating,
                reviewsCount: payload.reviewsCount,
                badge: payload.badge,
                isActive: payload.isActive
            };
            // save data
            this.mongo.add(data, 'Private-Tours')
                .then((response) => {
                    resolve({
                        statusCode: 200,
                        message: "success",
                        data: response.data
                    });

                })
                .catch((err) => {
                    // duplicate slug error
                    if (err.code === 11000) {
                        return resolve({
                            statusCode: 400,
                            message: "Your data already exists"
                        });
                    }
                })
        });

    }

    getMumbaiPrivateTourAll(payload) {
        return new Promise((resolve, reject) => {
            let page = Number(payload.from);
            let limit = Number(payload.to);
            let skip = (page - 1) * limit;
            let sort = { createdAt: -1 };
            let query = {};
            this.mongo.findPagenation(query, sort, skip, limit, 'Private-Tours')
                .then((result) => {
                    this.mongo.findCount(query, 'Private-Tours').then((count) => {
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

    getMumbaiPrivateTourById = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { slug: payload.slug };
            this.mongo.findOne(query, 'Private-Tours')
                .then((data) => {
                    resolve({
                        statusCode: 200,
                        message: "success",
                        result: data
                    });
                })
        });
    }

    deleteMumbaiPrivateTourById = (payload) => {
        return new Promise((resolve, reject) => {
            let query = { slug: payload.slug };
            this.mongo.delete(query, 'Private-Tours')
                .then((data) => {
                    resolve({
                        statusCode: 200,
                        message: "success",
                        result: data
                    });
                })
        });
    }

    updateMumbaiPrivateTourById(payload) {
        return new Promise(async (resolve, reject) => {
            let query = { slug: payload.slug };
            let coverImageUrl = "";
            if (
                payload.coverImage &&
                Array.isArray(payload.coverImage) &&
                payload.coverImage.length > 0 &&
                payload.coverImage[0].buffer
            ) {
                // Nai file upload karo
                const upload = await this.uploadToCloudinary(payload.coverImage[0].buffer);
                coverImageUrl = upload.secure_url;
            } else if (typeof payload.coverImage === "string" && payload.coverImage) {
                coverImageUrl = payload.coverImage;
            }

            // ── Gallery Images ──
            const existingImages = Array.isArray(payload.existingImages)
                ? payload.existingImages
                : payload.existingImages
                    ? [payload.existingImages]  // single string → array
                    : [];

            // Nai files cloudinary par upload karo
            let newImageUrls = [];
            if (
                payload.images &&
                Array.isArray(payload.images) &&
                payload.images.length > 0 &&
                payload.images[0].buffer
            ) {
                newImageUrls = await Promise.all(
                    payload.images.map(async (file) => {
                        const upload = await this.uploadToCloudinary(file.buffer);
                        return upload.secure_url;
                    })
                );
            }

            // Existing + New merge
            const imagesUrls = [...existingImages, ...newImageUrls];

            // ── Update Data ──
            const updateData = {
                title: payload.title,
                slug: payload.title
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-"),
                description: payload.description,
                duration: payload.duration,
                transport: payload.transport,
                location: payload.location,
                maxGuests: payload.maxGuests,
                pricePerPerson: payload.pricePerPerson,
                child: payload.child,
                freeCancellation: payload.freeCancellation,
                rating: payload.rating,
                reviewsCount: payload.reviewsCount,
                badge: payload.badge,
                isActive: payload.isActive,
                images: imagesUrls,  //  hamesha update hoga
            };

            // Cover image — sirf tab update karo jab URL mile
            if (coverImageUrl) {
                updateData.coverImage = coverImageUrl;
            }

            // ── MongoDB Update ──
            this.mongo.update(query, updateData, 'Private-Tours')
                .then((response) => {
                    resolve({
                        statusCode: 200,
                        message: "Updated successfully",
                        data: response.data
                    });
                })
                .catch((err) => {
                    reject({
                        statusCode: 500,
                        message: err.message
                    });
                });
        });
    }


}

module.exports = MumbaiPrivateTour;