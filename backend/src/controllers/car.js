const fs = require('fs');
const path = require('path');
const Car = require('../models/Car');
const Make = require('../models/Make');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const messages = require('../locales/messages');

// Utility function to check if an ID is valid
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all cars
exports.getCars = asyncHandler(async (req, res) => {
  const { make, model, year, condition, page = 1, limit = 10 } = req.query;

  const query = {};
  if (make && isValidObjectId(make)) query.make = make;
  if (model) query['model.en'] = model;
  if (year) query.year = year;
  if (condition) query.condition = condition;

  const skip = (page - 1) * limit;

  const total = await Car.countDocuments(query);
  const cars = await Car.find(query).skip(skip).limit(parseInt(limit, 10)).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: cars.length,
    total,
    pagination: {
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      pageSize: parseInt(limit, 10),
    },
    data: cars,
  });
});

// Get a single car by ID
exports.getCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) return next(new ErrorResponse(messages.notFound, 404));
  res.status(200).json({ success: true, data: car });
});

// Get similar cars
exports.getSimilarCars = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) return next(new ErrorResponse(messages.notFound, 404));

  const similarCars = await Car.find({
    make: car.make,
    _id: { $ne: car._id },
  }).limit(6);

  res.status(200).json({
    success: true,
    count: similarCars.length,
    data: similarCars,
  });
});

// Get all makes
exports.getMakes = asyncHandler(async (req, res) => {
  const total = await Make.countDocuments();
  const makes = await Make.find({}, 'name models').sort('name.en');

  res.status(200).json({
    success: true,
    count: makes.length,
    total,
    data: makes,
  });
});

// Create a new car
exports.createCar = asyncHandler(async (req, res, next) => {
  const carData = { ...req.body };

  // Verify make is a valid ObjectId
  if (!carData.make || !isValidObjectId(carData.make)) {
    return next(new ErrorResponse('Valid make ID is required', 400));
  }

  // Check if the make exists
  const makeExists = await Make.findById(carData.make);
  if (!makeExists) {
    return next(new ErrorResponse('Make not found', 404));
  }

  // Ensure model.en is provided
  if (!carData.model?.en) {
    return next(new ErrorResponse('Model name in English is required', 400));
  }

  // Create model object with just en if ar is not provided
  carData.model = {
    en: carData.model.en,
    ar: carData.model.ar || '',
  };

  // Handle image uploads if files are present
  if (req.files && req.files.length > 0) {
    try {
      carData.images = req.files.map((file, index) => ({
        url: file.url, // Use the processed URL from middleware
        main: index === 0,
      }));
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  } else if (carData.images && carData.images.length > 0) {
    carData.images = carData.images.map((img, index) => ({
      url: img.url || img,
      main: index === 0,
    }));
  }

  const car = await Car.create(carData);
  res.status(201).json({ success: true, data: car });
});

// Update a car
exports.updateCar = asyncHandler(async (req, res, next) => {
  let car = await Car.findById(req.params.id);
  if (!car) return next(new ErrorResponse(messages.notFound, 404));

  const carData = { ...req.body };

  // If make is provided, verify it's a valid ObjectId
  if (carData.make) {
    if (!isValidObjectId(carData.make)) {
      return next(new ErrorResponse('Valid make ID is required', 400));
    }

    // Check if the make exists
    const makeExists = await Make.findById(carData.make);
    if (!makeExists) {
      return next(new ErrorResponse('Make not found', 404));
    }
  }

  // If model is provided, ensure model.en exists
  if (carData.model) {
    if (!carData.model.en) {
      return next(new ErrorResponse('Model name in English is required when updating model', 400));
    }

    // Create model object with just en if ar is not provided
    carData.model = {
      en: carData.model.en,
      ar: carData.model.ar || '',
    };
  }

  // Handle image updates if files are uploaded
  if (req.files && req.files.length > 0) {
    try {
      const newImagePaths = req.files.map((file, index) => ({
        url: file.url, // Use the processed URL from middleware
        main: index === 0,
      }));

      if (req.body.replaceImages === 'true') {
        for (const image of car.images) {
          try {
            const filePath = path.join(__dirname, '..', '..', '..', image.url);
            if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
          } catch (error) {
            console.error('Failed to delete image from local storage:', error);
          }
        }
        carData.images = newImagePaths;
      } else {
        const combinedImages = [...car.images, ...newImagePaths];
        carData.images = combinedImages.map((img, index) => ({
          url: img.url,
          main: index === 0,
        }));
      }
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }
  } else if (carData.images && Array.isArray(carData.images)) {
    carData.images = carData.images.map((img, index) => ({
      url: img.url || img,
      main: index === 0,
    }));
  }

  car = await Car.findByIdAndUpdate(req.params.id, carData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: car });
});

// Delete a car
exports.deleteCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) return next(new ErrorResponse(messages.notFound, 404));

  for (const image of car.images) {
    try {
      const filePath = path.join(__dirname, '..', '..', '..', image.url);
      if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
    } catch (error) {
      console.error('Failed to delete image from local storage:', error);
    }
  }

  await Car.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, message: messages.deleted });
});
