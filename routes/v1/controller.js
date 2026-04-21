// controller.js
const Currency = require("../../service/currency/currency");
const AdminLogin = require("../../service/adminLogin/adminLogin")

class ContentController {
    constructor() {
        this.Currency = new Currency();
        this.AdminLogin = new AdminLogin();
    }

    // Health check
    health = (req, res) => {
        return res.status(200).json({ statusCode: 200, data: "ok" });
    };

    // 🔹 Get Rates (Smart → DB + API fallback)
    getCurrencyRates = (req, res) => {
        let payload = {
            base: req.query.base || "INR"
        };
        this.Currency.getCurrencyRates(payload)
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => {
                return res.status(500).json({
                    statusCode: 500,
                    message: "Server Error",
                    error: err.message
                });
            });
    };

    // convertCurrency
    convertCurrency = (req, res) => {
        let payload = {
            amount: Number(req.query.amount),
            from: req.query.from || "INR",
            to: req.query.to || "USD"
        };

        this.Currency.convertAmount(payload)
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => {
                return res.status(500).json({
                    statusCode: 500,
                    message: "Server Error",
                    error: err.message
                });
            });
    };

    // 🔹 Save Rates manually
    saveCurrencyRates = (req, res) => {
        let payload = {
            base: req.body.base,
            rates: req.body.rates
        };
        this.Currency.saveRates(payload)
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => {
                return res.status(500).json({
                    statusCode: 500,
                    message: "Save Error",
                    error: err.message
                });
            });
    };

    // 🔹 Get Rates from DB only
    getRates = (req, res) => {
        let payload = {
            base: req.query.base || "INR"
        };

        this.Currency.getRates(payload)
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => {
                return res.status(500).json({
                    statusCode: 500,
                    message: "DB Fetch Error",
                    error: err.message
                });
            });
    };

    createAdminLogin = (req, res) => {
        let paylaod = {
            userName: req.body.userName,
            password: req.body.password,
            roleId: req.body.roleId,
        };
        this.AdminLogin.createAdminLogin(paylaod).then((data) => {
            return res.status(200).json(data);
        }).catch(err => {
            return res.status(500).json(err)
        })
    }


    getAdminLogin = (req, res) => {
        const payload = {
            userName: req.body.userName,
            password: req.body.password
        };
        this.AdminLogin.getAdminLogin(payload).then((data) => {
            return res.status(200).json(data);
        }).catch(err => {
            return res.status(500).json(err)
        })
    }

    listAdminLogin = (req, res) => {
        let payload = {
            from: req.query.from,
            to: req.query.to
        };
        this.AdminLogin.listAdminLogin(payload).then((data) => {
            return res.status(200).json(data);
        }).catch(err => {
            return res.status(500).json(err)
        })
    }

    deleteAdminLoginById = (req, res) => {
        let payload = {
            id: req.params.id,
        }
        this.AdminLogin.deleteAdminLoginById(payload).then((data) => {
            return res.status(200).json(data);
        }).catch((err) => {
            return res.status(500).json(err);
        })
    }



}

module.exports = ContentController;