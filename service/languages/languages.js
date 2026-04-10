// const mongo = require("../service/mongo/mongo");
// const defaultLanguages = [
//     { code: "en-IN", label: "English (India)", nativeLabel: "English (India)" },
//     { code: "en-US", label: "English (US)", nativeLabel: "English (US)" },
//     { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
//     { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
//     { code: "es", label: "Spanish", nativeLabel: "Español" },
//     { code: "fr", label: "French", nativeLabel: "Français" },
// ];

const mongo = require("../mongo/mongo");

class Languages {
    constructor() {
        this.mongo = new mongo();
    }

    addLanguage = (payload) => {
        return new Promise((resolve, reject) => {
            let data = {
                code: payload.code,
                label: payload.label,
                nativeLabel: payload.nativeLabel || payload.label,
                createdAt: new Date()
            };
            this.mongo.add(data, "languages")
                .then(result => {
                    return resolve({
                        statusCode: 200,
                        message: "Language added successfully",
                        data: result
                    });
                })
                .catch(err => reject({
                    statusCode: 500,
                    message: "Error adding language",
                    error: err
                }));
        });
    };


    getLanguages = () => {
        return new Promise((resolve, reject) => {
            let query = {};
            this.mongo.find(query, { createdAt: -1 }, "languages")
                .then((data) => {
                    return resolve({
                        statusCode: 200,
                        message: "success",
                        data: data
                    });
                })
                .catch(err => reject({
                    statusCode: 500,
                    message: "Error fetching languages",
                    error: err
                }));
        });
    };
}

module.exports = Languages;