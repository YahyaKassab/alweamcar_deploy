const mongoose = require('mongoose');
const messages = require('../locales/messages');

const CarSchema = new mongoose.Schema({
    make: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Make',
        required: [true, messages.makeRequired?.en || 'Make is required']
    },
    model: {
        type: String,
        required: [true, messages.modelRequired?.en || 'Model is required'],
        trim: true,
        index: true,
    },
    year: {
        type: Number,
        required: [true, messages.yearRequired?.en || 'Year is required'],
    },
    condition: {
        type: String,
        enum: ['Brand New', 'Elite Approved'],
        required: [true, messages.conditionRequired?.en || 'Condition is required'],
    },
    mileage: {
        type: Number,
        required: [true, messages.mileageRequired?.en || 'Mileage is required'],
    },
    stockNumber: {
        type: String,
        required: [true, messages.stockNumberRequired?.ar || 'Stock number is required'],
        unique: true,
        trim: true,
    },
    exteriorColor: {
        type: String,
        trim: true,
    },
    interiorColor: {
        type: String,
        trim: true,
    },
    engine: {
        type: String,
        trim: true,
    },
    bhp: {
        type: Number,
    },
    door: {
        type: Number,
    },
    warranty: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: [true, messages.nameRequired?.en || 'Name is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, messages.priceRequired?.en || 'Price is required'],
    },
    images: {
        type: [String],
        // required: [true, messages.imagesRequired.en],
    }
}, {
    timestamps: true // This automatically creates createdAt and updatedAt fields
});

CarSchema.pre(/^find/, function (next) {
    this.populate('make','name')
    next();
  });

module.exports = mongoose.model('Car', CarSchema);