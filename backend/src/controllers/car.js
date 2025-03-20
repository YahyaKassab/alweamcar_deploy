const Car = require('../models/Car');
const Make = require('../models/Make');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const messages = require('../locales/messages');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getCars = asyncHandler(async (req, res) => {
  const { make, model, year, condition, page = 1, limit = 10 } = req.query;

  const query = {};
  if (make && isValidObjectId(make)) {
    query.make = make;
  }
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

exports.getCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  res.status(200).json({ success: true, data: car });
});

exports.getSimilarCars = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

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

exports.getMakes = asyncHandler(async (req, res) => {
  const total = await Make.countDocuments();
  const makes = await Make.find({}, 'name models').sort('name.en'); // Sort by English name

  res.status(200).json({
    success: true,
    count: makes.length,
    total,
    data: makes,
  });
});
exports.createCar = asyncHandler(async (req, res, next) => {
  const carData = { ...req.body };

  // Handle make/model creation (unchanged)
  if (!isValidObjectId(carData.make)) {
    const { make, model } = carData;
    if (!make?.en || !make?.ar || !model?.en || !model?.ar) {
      return next(new ErrorResponse(messages.make_model_required, 400));
    }

    const normalizedMakeNameEn = make.en.trim().toLowerCase();
    const normalizedMakeNameAr = make.ar.trim().toLowerCase();
    const normalizedModelEn = model.en.trim();
    const normalizedModelAr = model.ar.trim();

    let makeDoc = await Make.findOne({
      'name.en': { $regex: new RegExp(`^${normalizedMakeNameEn}$`, 'i') },
    });

    if (!makeDoc) {
      makeDoc = await Make.create({
        name: { en: make.en, ar: make.ar },
        models: [{ en: normalizedModelEn, ar: normalizedModelAr }],
      });
    } else {
      const modelExists = makeDoc.models.some(
        (m) => m.en.toLowerCase() === normalizedModelEn.toLowerCase()
      );
      if (!modelExists) {
        makeDoc.models.push({ en: normalizedModelEn, ar: normalizedModelAr });
        await makeDoc.save();
      }
    }

    carData.make = makeDoc._id;
    carData.model = { en: normalizedModelEn, ar: normalizedModelAr };
  }

  // Handle Cloudinary image upload
  if (req.files && req.files.length > 0) {
    carData.images = req.files.map((file, index) => ({
      url: file.path,
      main: index === 0, // First image is always main
    }));
  } else if (carData.images && carData.images.length > 0) {
    // If images are provided in body, set first as main by default
    carData.images = carData.images.map((img, index) => ({
      url: img.url || img, // Handle string or object input
      main: index === 0, // First image is always main, overrides any provided main flags
    }));
  }

  const car = await Car.create(carData);

  res.status(201).json({ success: true, data: car });
});

exports.updateCar = asyncHandler(async (req, res, next) => {
  let car = await Car.findById(req.params.id);
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  const carData = { ...req.body };

  // Handle make/model updates (unchanged)
  if (!isValidObjectId(carData.make)) {
    const { make, model } = carData;
    if (!make?.en || !make?.ar || !model?.en || !model?.ar) {
      return next(new ErrorResponse(messages.make_model_required, 400));
    }

    const normalizedMakeNameEn = make.en.trim().toLowerCase();
    const normalizedMakeNameAr = make.ar.trim().toLowerCase();
    const normalizedModelEn = model.en.trim();
    const normalizedModelAr = model.ar.trim();

    let makeDoc = await Make.findOne({
      'name.en': { $regex: new RegExp(`^${normalizedMakeNameEn}$`, 'i') },
    });

    if (!makeDoc) {
      makeDoc = await Make.create({
        name: { en: make.en, ar: make.ar },
        models: [{ en: normalizedModelEn, ar: normalizedModelAr }],
      });
    } else {
      const modelExists = makeDoc.models.some(
        (m) => m.en.toLowerCase() === normalizedModelEn.toLowerCase()
      );
      if (!modelExists) {
        makeDoc.models.push({ en: normalizedModelEn, ar: normalizedModelAr });
        await makeDoc.save();
      }
    }

    carData.make = makeDoc._id;
    carData.model = { en: normalizedModelEn, ar: normalizedModelAr };
  }

  // Handle Cloudinary image upload
  if (req.files && req.files.length > 0) {
    const newImagePaths = req.files.map((file, index) => ({
      url: file.path,
      main: index === 0, // First new image is main
    }));

    if (req.body.replaceImages === 'true') {
      // Delete existing images from Cloudinary
      for (const image of car.images) {
        try {
          const publicId = image.url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`Alweam/cars/${publicId}`);
        } catch (error) {
          console.error('Failed to delete image from Cloudinary:', error);
        }
      }
      carData.images = newImagePaths;
    } else {
      // Append new images, keeping first of new set as main if no existing main
      const combinedImages = [...car.images, ...newImagePaths];
      carData.images = combinedImages.map((img, index) => ({
        url: img.url,
        main: index === 0, // First image in combined list is main
      }));
    }
  } else if (carData.images && carData.images.length > 0) {
    // If images are provided in body, set first as main
    carData.images = carData.images.map((img, index) => ({
      url: img.url || img, // Handle string or object input
      main: index === 0, // First image is always main
    }));
  }

  car = await Car.findByIdAndUpdate(req.params.id, carData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: car });
});
exports.deleteCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) {
    return next(new ErrorResponse(messages.notFound, 404));
  }

  for (const imageUrl of car.images) {
    try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`Alweam/cars/${publicId}`);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }

  await Car.deleteOne({ _id: req.params.id });

  res.status(200).json({ success: true, message: messages.deleted });
});
