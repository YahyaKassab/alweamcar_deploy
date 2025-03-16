const Car = require('../models/Car');
const Make = require('../models/Make');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const messages = require('../locales/messages');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all cars with pagination and filtering
// @route   GET /api/cars
// @access  Public
exports.getCars = asyncHandler(async (req, res) => {
  const { make, model, year, condition, page = 1, limit = 10 } = req.query;
  
  const query = {};
  if (make) query.make = make;
  if (model) query.model = model;
  if (year) query.year = year;
  if (condition) query.condition = condition;

  const skip = (page - 1) * limit;
  
  const total = await Car.countDocuments(query);
  const cars = await Car.find(query).populate('make',
    'name'
  )
    .skip(skip)
    .limit(parseInt(limit, 10))
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: cars.length,
    total,
    pagination: {
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      pageSize: parseInt(limit, 10)
    },
    data: cars
  });
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id).populate('make','name');
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }
  
  res.status(200).json({ success: true, data: car });
});

// @desc    Get similar cars (same make)
// @route   GET /api/cars/:id/similar
// @access  Public
exports.getSimilarCars = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }
  
  const similarCars = await Car.find({ make: car.make, _id: { $ne: car._id } }).limit(6);
  
  res.status(200).json({ success: true, count: similarCars.length, data: similarCars });
});

// @desc    Get all makes
// @route   GET /api/cars/makes
// @access  Public
exports.getMakes = asyncHandler(async (req, res) => {
  const makes = await Make.find({},'name models');
  res.status(200).json({ success: true, count: makes.length, data: makes });
});

// @desc    Create new car
// @route   POST /api/cars
// @access  Private
exports.createCar = asyncHandler(async (req, res, next) => {
  const carData = { ...req.body };

  if (!isValidObjectId(carData.make)) {
    const { make: makeName, model } = carData;
    if (!makeName || !model) {
      return next(new ErrorResponse(messages.make_model_required, 400));
    }

    const normalizedMakeName = makeName.trim().toLowerCase();
    const normalizedModel = model.trim();

    let make = await Make.findOne({ name: { $regex: new RegExp(`^${normalizedMakeName}$`, 'i') } });

    if (!make) {
      make = await Make.create({ name: makeName, models: [normalizedModel] });
    } else if (!make.models.some(m => m.toLowerCase() === normalizedModel.toLowerCase())) {
      make.models.push(normalizedModel);
      await make.save();
    }

    carData.make = make._id;
  }

  if (req.files && req.files.length > 0) {
    carData.images = req.files.map(file => `/uploads/images/cars/${file.filename}`);
  }

  const car = await Car.create(carData);
  
  res.status(201).json({ success: true, data: car });
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
exports.updateCar = asyncHandler(async (req, res, next) => {
  let car = await Car.findById(req.params.id);
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  const carData = { ...req.body };

  if (!isValidObjectId(carData.make)) {
    const { make: makeName, model } = carData;
    if (!makeName || !model) {
      return next(new ErrorResponse(messages.make_model_required, 400));
    }

    const normalizedMakeName = makeName.trim().toLowerCase();
    const normalizedModel = model.trim();

    let make = await Make.findOne({ name: { $regex: new RegExp(`^${normalizedMakeName}$`, 'i') } });

    if (!make) {
      make = await Make.create({ name: makeName, models: [normalizedModel] });
    } else if (!make.models.some(m => m.toLowerCase() === normalizedModel.toLowerCase())) {
      make.models.push(normalizedModel);
      await make.save();
    }

    carData.make = make._id;
  }

  if (req.files && req.files.length > 0) {
    const newImagePaths = req.files.map(file => `/uploads/images/cars/${file.filename}`);

    if (req.body.replaceImages === 'true') {
      car.images.forEach(image => {
        const imagePath = path.join(__dirname, '/uploads/images/cars', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      carData.images = newImagePaths;
    } else {
      carData.images = [...car.images, ...newImagePaths];
    }
  }

  car = await Car.findByIdAndUpdate(req.params.id, carData, { new: true, runValidators: true });

  res.status(200).json({ success: true, data: car });
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private
exports.deleteCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  car.images.forEach(image => {
    const imagePath = path.join(__dirname, '/uploads/images/cars', image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });

  await car.remove();

  res.status(200).json({ success: true, data: {} });
});
