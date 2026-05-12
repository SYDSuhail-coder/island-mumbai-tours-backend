// controller.js
const Currency = require("../../service/currency/currency");
const AdminLogin = require("../../service/adminLogin/adminLogin");
const roles = require("../../service/roles/roles");
const ToursSection = require("../../service/ToursSection/ToursSection");
const MumbaiPrivateTour = require("../../service/MumbaiPrivateTour/MumbaiPrivateTour");
const MumbaiWalkingTour = require("../../service/MumbaiWalkingTour/MumbaiWalkingTour");

class ContentController {
    constructor() {
        this.Currency = new Currency();
        this.AdminLogin = new AdminLogin();
        this.roles = new roles();
        this.ToursSection = new ToursSection();
        this.MumbaiPrivateTour = new MumbaiPrivateTour();
        this.MumbaiWalkingTour = new MumbaiWalkingTour();
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

    addRoles = (req, res) => {
        let payload = {
            role_name: req.body.name,
            modules: req.body.modules,
        };

        this.roles.addRoles(payload).then(data => {
            return res.status(200).json(data)
        })
    }

    updateRoles = (req, res) => {
        let paylaod = {
            id: req.params.id,
            modules: req.body.modules,
            role_name: req.body.role_name
        }
        this.roles.updateRoles(paylaod).then(data => {
            return res.status(200).json(data)
        })
    }

    getRoles = (req, res) => {
        let paylaod = {
            // id:req.params.id
        }
        this.roles.getRoles(paylaod).then(data => {
            return res.status(200).json(data)
        })
    }

    // ToursSection
    createToursSection = (req, res) => {
        const payload = {
            title: req.body.title,
            coverImage: req.files?.coverImage,
            images: req.files?.images,
            description: req.body.description,
            duration: req.body.duration,
            transport: req.body.transport,
            location: req.body.location,
            maxGuests: req.body.maxGuests,
            pricePerPerson: req.body.pricePerPerson,
            freeCancellation: req.body.freeCancellation,
            rating: req.body.rating,
            reviewsCount: req.body.reviewsCount,
            badge: req.body.badge,
            isActive: req.body.isActive
        };

        this.ToursSection.createToursSection(payload)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(500).json(err));
    };

    getTouresSectionAll = (req, res) => {
        let payload = {
            from: req.query.from,
            to: req.query.to
        }
        this.ToursSection.getTouresSectionAll(payload).then((data) => {
            return res.status(200).json(data);
        }).catch(err => res.status(500).json(err));
    }

    getTouresSectionById = (req, res) => {
        let payload = {
            slug: req.params.slug
        };
        this.ToursSection.getTouresSectionById(payload).then((data) => {
            return res.status(200).json(data)
        }).catch(err => res.status(500).json(err));
    }

    deleteTouresSectionById = (req, res) => {
        let payload = {
            slug: req.params.slug
        };
        this.ToursSection.deleteTouresSectionById(payload)
            .then((data) => { return res.status(200).json(data) })
            .catch((err) => { return res.status(500).json(err) })
    }

    updateToursSectionById = (req, res) => {
        const payload = {
            slug: req.params.slug,
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            transport: req.body.transport,
            location: req.body.location,
            maxGuests: req.body.maxGuests,
            pricePerPerson: req.body.pricePerPerson,
            freeCancellation: req.body.freeCancellation,
            rating: req.body.rating,
            reviewsCount: req.body.reviewsCount,
            badge: req.body.badge,
            isActive: req.body.isActive
        };
        this.ToursSection.updateToursSectionById(payload)
            .then((data) => { return res.status(200).json(data) })
            .catch((err) => { return res.status(500).json(err) });
    }

    // MumbaiPrivateTour
    createMumbaiPrivateTour = (req, res) => {
        const payload = {
            title: req.body.title,
            coverImage: req.files?.coverImage,
            images: req.files?.images,
            description: req.body.description,
            duration: req.body.duration,
            transport: req.body.transport,
            location: req.body.location,
            maxGuests: req.body.maxGuests,
            pricePerPerson: req.body.pricePerPerson,
            freeCancellation: req.body.freeCancellation,
            rating: req.body.rating,
            reviewsCount: req.body.reviewsCount,
            badge: req.body.badge,
            isActive: req.body.isActive
        };

        this.MumbaiPrivateTour.createMumbaiPrivateTour(payload)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(500).json(err));
    };

    getMumbaiPrivateTourAll = (req, res) => {
        let payload = {
            from: req.query.from,
            to: req.query.to
        }
        this.MumbaiPrivateTour.getMumbaiPrivateTourAll(payload).then((data) => {
            return res.status(200).json(data);
        }).catch(err => res.status(500).json(err));
    }

    getMumbaiPrivateTourById = (req, res) => {
        let payload = {
            slug: req.params.slug
        };
        this.MumbaiPrivateTour.getMumbaiPrivateTourById(payload).then((data) => {
            return res.status(200).json(data)
        }).catch(err => res.status(500).json(err));
    }

    deleteMumbaiPrivateTourById = (req, res) => {
        let payload = {
            slug: req.params.slug
        };
        this.MumbaiPrivateTour.deleteMumbaiPrivateTourById(payload)
            .then((data) => { return res.status(200).json(data) })
            .catch((err) => { return res.status(500).json(err) })
    }

    updateMumbaiPrivateTourById = (req, res) => {
        const payload = {
            slug: req.params.slug,
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            transport: req.body.transport,
            location: req.body.location,
            maxGuests: req.body.maxGuests,
            pricePerPerson: req.body.pricePerPerson,
            freeCancellation: req.body.freeCancellation,
            rating: req.body.rating,
            reviewsCount: req.body.reviewsCount,
            badge: req.body.badge,
            isActive: req.body.isActive
        };
        this.MumbaiPrivateTour.updateMumbaiPrivateTourById(payload)
            .then((data) => { return res.status(200).json(data) })
            .catch((err) => { return res.status(500).json(err) });
    }

    // Walking Tour
    createMumbaiWalkingTour = (req, res) => {
        const payload = {
            title: req.body.title,
            coverImage: req.files?.coverImage,
            images: req.files?.images,
            description: req.body.description,
            duration: req.body.duration,
            transport: req.body.transport,
            location: req.body.location,
            maxGuests: req.body.maxGuests,
            pricePerPerson: req.body.pricePerPerson,
            freeCancellation: req.body.freeCancellation,
            rating: req.body.rating,
            reviewsCount: req.body.reviewsCount,
            badge: req.body.badge,
            isActive: req.body.isActive
        };

        this.MumbaiWalkingTour.createMumbaiWalkingTour(payload)
            .then(data => res.status(200).json(data))
            .catch(err => res.status(500).json(err));
    };

    getMumbaiWalkingTourAll = (req, res) => {
        let payload = {
            from: req.query.from,
            to: req.query.to
        }
        this.MumbaiWalkingTour.getMumbaiWalkingTourAll(payload).then((data) => {
            return res.status(200).json(data);
        }).catch(err => res.status(500).json(err));
    }

    getMumbaiWalkingTourById = (req, res) => {
        let payload = {
            slug: req.params.slug
        };
        this.MumbaiWalkingTour.getMumbaiWalkingTourById(payload).then((data) => {
            return res.status(200).json(data)
        }).catch(err => res.status(500).json(err));
    }

    deleteMumbaiWalkingTourById = (req, res) => {
        let payload = {
            slug: req.params.slug
        };
        this.MumbaiWalkingTour.deleteMumbaiWalkingTourById(payload)
            .then((data) => { return res.status(200).json(data) })
            .catch((err) => { return res.status(500).json(err) })
    }

    updateMumbaiWalkingTourById = (req, res) => {
        const payload = {
            slug: req.params.slug,
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            transport: req.body.transport,
            location: req.body.location,
            maxGuests: req.body.maxGuests,
            pricePerPerson: req.body.pricePerPerson,
            freeCancellation: req.body.freeCancellation,
            rating: req.body.rating,
            reviewsCount: req.body.reviewsCount,
            badge: req.body.badge,
            isActive: req.body.isActive
        };
        this.MumbaiWalkingTour.updateMumbaiWalkingTourById(payload)
            .then((data) => { return res.status(200).json(data) })
            .catch((err) => { return res.status(500).json(err) });
    }


}

module.exports = ContentController;