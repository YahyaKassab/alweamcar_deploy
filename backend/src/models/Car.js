const mongoose = require('mongoose');
const messages = require('../locales/messages');

const CarSchema = new mongoose.Schema(
  {
    make: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Make',
      required: [true, messages.makeRequired?.en || 'Make is required'],
    },
    model: {
      en: {
        type: String,
        required: [true, messages.modelRequired?.en || 'Model is required'],
        trim: true,
        index: true,
      },
      ar: {
        type: String,
        required: [true, messages.modelRequired?.ar || 'Model is required'],
        trim: true,
        index: true,
      },
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
      en: {
        type: String,
        trim: true,
      },
      ar: {
        type: String,
        trim: true,
      },
    },
    interiorColor: {
      en: {
        type: String,
        trim: true,
      },
      ar: {
        type: String,
        trim: true,
      },
    },
    engine: {
      en: {
        type: String,
        trim: true,
      },
      ar: {
        type: String,
        trim: true,
      },
    },
    bhp: {
      en: {
        type: String,
        trim: true,
      },
      ar: {
        type: String,
        trim: true,
      },
    },
    door: {
      type: Number,
    },
    warranty: {
      type: Boolean,
      default: false,
    },
    name: {
      en: {
        type: String,
        required: [true, messages.nameRequired?.en || 'Name is required'],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, messages.nameRequired?.ar || 'Name is required'],
        trim: true,
      },
    },
    price: {
      type: Number,
      required: [true, messages.priceRequired?.en || 'Price is required'],
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: [true, 'Image URL is required'],
          },
          main: {
            type: Boolean,
            default: false,
          },
        },
      ],
      validate: {
        validator: function (images) {
          // Ensure exactly one image is marked as main
          const mainCount = images.filter((img) => img.main).length;
          return mainCount === 1;
        },
        message: 'Exactly one image must be marked as main',
      },
    },
  },
  {
    timestamps: true, // This automatically creates createdAt and updatedAt fields
  }
);

CarSchema.pre(/^find/, function (next) {
  this.populate('make', 'name');
  next();
});

module.exports = mongoose.model('Car', CarSchema);
