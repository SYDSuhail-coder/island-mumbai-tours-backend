const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema({
    id: {
        type: Number,
        index: true
    },
    modules: {
        type: Array,
        index: true
    }
}, {strict:false});

const roles = mongoose.model('roles', rolesSchema);

module.exports = roles;