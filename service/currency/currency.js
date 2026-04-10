// service/currency/currency.js
const Mongo = require("../mongo/mongo");

class Currency {
    constructor() {
        this.Mongo = new Mongo();
    }

    // 🔹 API call
    getCurrencyRates = (payload) => {
        return new Promise((resolve) => {

            fetch(`https://api.exchangerate-api.com/v4/latest/${payload.base}`)
                .then(res => res.json())
                .then(data => {
                    return resolve({
                        statusCode: 200,
                        base: data.base,
                        rates: data.rates
                    });
                })
                .catch(err => {
                    return resolve({
                        statusCode: 500,
                        message: "API Error",
                        error: err.message
                    });
                });

        });
    };

    // convert Amount
    convertAmount = (payload) => {
        return new Promise((resolve) => {
            const { amount, from, to } = payload;
            fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
                .then(res => res.json())
                .then(data => {
                    const rate = data.rates[to];
                    if (!rate) {
                        return resolve({
                            statusCode: 400,
                            message: "Invalid currency"
                        });
                    }
                    const converted = Number((amount * rate).toFixed(2));
                    return resolve({
                        statusCode: 200,
                        // from,
                        // to,
                        // amount,
                        convertedAmount: converted
                    });

                })
                .catch(err => {
                    return resolve({
                        statusCode: 500,
                        message: "Conversion error",
                        error: err.message
                    });
                });

        });
    };

    // 🔹 Save DB
    saveRates = (payload) => {
        return new Promise((resolve) => {
            const doc = {
                base: payload.base,
                rates: payload.rates,
                createdAt: new Date()
            };

            this.Mongo.add(doc, "rates")
                .then(data => {
                    return resolve({
                        statusCode: 200,
                        message: "Saved",
                        result: data
                    });
                })
                .catch(err => {
                    return resolve({
                        statusCode: 500,
                        message: "Save Error",
                        error: err.message
                    });
                });

        });
    };

    // 🔹 GET (DB + API fallback + refresh logic)
    getRates = (payload) => {
        return new Promise((resolve) => {
            const query = { base: payload.base };
            this.Mongo.findOne(query, "rates")
                .then(result => {

                    // ✅ agar DB me mil gaya
                    if (result && result.data) {
                        const savedTime = new Date(result.data.createdAt).getTime();
                        const now = Date.now();
                        // ⏱ 12 ghante cache
                        if (now - savedTime < 12 * 60 * 60 * 1000) {
                            return resolve({
                                statusCode: 200,
                                source: "DB",
                                rates: result.data.rates
                            });
                        }
                    }

                    // ❌ fresh API call
                    fetch(`https://api.exchangerate-api.com/v4/latest/${payload.base}`)
                        .then(res => res.json())
                        .then(data => {

                            const doc = {
                                base: payload.base,
                                rates: data.rates,
                                createdAt: new Date()
                            };

                            this.Mongo.add(doc, "rates");

                            return resolve({
                                statusCode: 200,
                                source: "API",
                                rates: data.rates
                            });
                        });

                })
                .catch(err => {
                    return resolve({
                        statusCode: 500,
                        message: "Error",
                        error: err.message
                    });
                });

        });
    };
}

module.exports = Currency;