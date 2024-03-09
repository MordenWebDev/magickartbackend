const mongoose = require('mongoose');

// Define the Payment schema
const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: 'pending' // You can set default status as 'pending' or any other appropriate value
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
