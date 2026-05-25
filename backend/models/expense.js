const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    expenseType: {type: String, required: true},
    description: {type: String, trim: true},
    amount: {type: Number, required: true, min: 1},
    paidTo: {type: String, required: true, trim: true},
    mode: {
        type: String,
        required: true, 
        enum: ["Cash", "UPI", "Bank Transfer", "Credit Card"]}
});

module.exports = mongoose.model("Expense", expenseSchema);
