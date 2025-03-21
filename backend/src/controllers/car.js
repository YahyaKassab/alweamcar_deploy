const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Car = require('../models/Car');
const Make = require('../models/Make');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const messages = require('../locales/messages');

// Set image directory
const uploadsBaseDir = path.join(__dirname, '..', '..', '..', 'uploads');
const imagesDestDirCars = path.join(uploadsBaseDir, 'cars');

// Ensure cars directory exists
const ensureDirectory = () => {
  if (!fs.existsSync(imagesDestDirCars)) {
    fs.mkdirSync(imagesDestDirCars, { recursive: true });
  }
};

// Utility to validate and resize image
const processImage = async (file) => {
  const fileSizeInMB = file.size / (1024 * 1024);
  const destPath = path.join(imagesDestDirCars, file.filename);

  if (fileSizeInMB > 1) {
    const resizedBuffer = await sharp(file.path)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const resizedSizeInMB = resizedBuffer.length / (1024 * 1024);
    if (resizedSizeInMB > 1) {
      throw new Error(
        `Image ${file.filename} could not be resized below 1MB (${resizedSizeInMB.toFixed(2)}MB)`
      );
    }

    fs.writeFileSync(destPath, resizedBuffer);
    fs.unlinkSync(file.path); // Remove temp file
  } else {
    fs.renameSync(file.path, destPath);
  }

  return `/uploads/cars/${file.filename}`;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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

exports.getCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) return next(new ErrorResponse(messages.notFound, 404));
  res.status(200).json({ success: true, data: car });
});

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

exports.createCar = asyncHandler(async (req, res, next) => {
  ensureDirectory();
  const carData = { ...req.body };

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

  if (req.files && req.files.length > 0) {
    try {
      carData.images = await Promise.all(
        req.files.map(async (file, index) => ({
          url: await processImage(file),
          main: index === 0,
        }))
      );
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

exports.updateCar = asyncHandler(async (req, res, next) => {
  ensureDirectory();
  let car = await Car.findById(req.params.id);
  if (!car) return next(new ErrorResponse(messages.notFound, 404));

  const carData = { ...req.body };

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

  if (req.files && req.files.length > 0) {
    let newImagePaths;
    try {
      newImagePaths = await Promise.all(
        req.files.map(async (file, index) => ({
          url: await processImage(file),
          main: index === 0,
        }))
      );
    } catch (error) {
      return next(new ErrorResponse(error.message, 400));
    }

    if (req.body.replaceImages === 'true') {
      for (const image of car.images) {
        try {
          const filePath = path.join(__dirname, '..', '..', image.url);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
  } else if (carData.images && carData.images.length > 0) {
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

exports.deleteCar = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  if (!car) return next(new ErrorResponse(messages.notFound, 404));

  for (const image of car.images) {
    try {
      const filePath = path.join(__dirname, '..', '..', image.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Failed to delete image from local storage:', error);
    }
  }

  await Car.deleteOne({ _id: req.params.id });
  res.status(200).json({ success: true, message: messages.deleted });
});
