const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người tạo (admin)
});

module.exports = mongoose.model('Employee', employeeSchema);
