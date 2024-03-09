const mongoose = require('mongoose');

// Define the schema for NFTs
const nftSchema = new mongoose.Schema({
    imageUrl: String,
    name: String,
    price: Number
});

// Export the NFT model
module.exports = mongoose.model('NFT', nftSchema);
