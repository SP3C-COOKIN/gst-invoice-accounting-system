const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true},
  invoiceDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },

  client: {
    name: { type: String, required: true, trim: true, maxlength: 30 },
    company: { type: String, required: true, trim: true, maxlength: 50 },
    address: { type: String, required: true, trim: true, maxlength: 150 },
    gstin: { type: String, trim: true, uppercase: true, maxlength: 15 },
    contact: { type: String, required: true, trim: true, minlength: 10, maxlength: 10 },
  },

  services: [
    {
      name: { type: String, required: true },
      description: { type: String, trim: true, maxlength: 100 },
      qty: { type: Number, required: true, min: 1 },
      rate: { type: Number, required: true, min: 1 },
      amount: { type: Number, required: true, min: 0 },
    },
  ],

  subtotal: { type: Number, required: true, min: 0 },

  tax: {
    cgst: { type: Number, default: 0, min: 0 },
    sgst: { type: Number, default: 0, min: 0 },
    igst: { type: Number, default: 0, min: 0 },
  },

  total: { type: Number, required: true, min: 0 },

  paymentMode: {type: String, required: true},
  
  pdfPath: {type: String},
}, { timestamps: true })


module.exports = mongoose.model("Invoice", invoiceSchema);