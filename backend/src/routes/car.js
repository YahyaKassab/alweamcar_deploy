const express = require('express');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getSimilarCars,
} = require('../controllers/car');
const { protect } = require('../middleware/auth');
const { uploadCar } = require('../middleware/upload'); // Import uploadCar from uploads.js

const router = express.Router();

/**
 * @swagger
 * /api/cars/{id}/similar:
 *   get:
 *     summary: Get similar cars of the same make
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the car
 *     responses:
 *       200:
 *         description: List of similar cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 */
router.get('/:id/similar', getSimilarCars);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars with optional filtering
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *         description: Car make ID to filter by
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Car model (English) to filter by
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Car year to filter by
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [Brand New, Elite Approved]
 *         description: Car condition to filter by
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 */

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - make
 *               - model[en]
 *               - year
 *               - condition
 *               - mileage
 *               - stockNumber
 *               - name[en]
 *               - name[ar]
 *               - price
 *             properties:
 *               make:
 *                 type: string
 *                 description: Make ID (reference to an existing Make)
 *               model[en]:
 *                 type: string
 *                 description: English model name
 *               model[ar]:
 *                 type: string
 *                 description: Arabic model name (optional)
 *               year:
 *                 type: integer
 *                 description: Manufacturing year
 *               condition:
 *                 type: string
 *                 enum: [Brand New, Elite Approved]
 *                 description: Condition of the car
 *               mileage:
 *                 type: number
 *                 description: Mileage in kilometers
 *               stockNumber:
 *                 type: string
 *                 description: Unique stock number
 *               exteriorColor[en]:
 *                 type: string
 *                 description: English exterior color
 *               exteriorColor[ar]:
 *                 type: string
 *                 description: Arabic exterior color
 *               interiorColor[en]:
 *                 type: string
 *                 description: English interior color
 *               interiorColor[ar]:
 *                 type: string
 *                 description: Arabic interior color
 *               engine[en]:
 *                 type: string
 *                 description: English engine description
 *               engine[ar]:
 *                 type: string
 *                 description: Arabic engine description
 *               bhp[en]:
 *                 type: string
 *                 description: English brake horsepower
 *               bhp[ar]:
 *                 type: string
 *                 description: Arabic brake horsepower
 *               door:
 *                 type: integer
 *                 description: Number of doors
 *               warranty:
 *                 type: boolean
 *                 description: Warranty status
 *               name[en]:
 *                 type: string
 *                 description: English car name
 *               name[ar]:
 *                 type: string
 *                 description: Arabic car name
 *               price:
 *                 type: number
 *                 description: Price in currency
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files (select multiple files from file explorer)
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Missing required field or invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Make not found
 */
router.route('/').get(getCars).post(protect, uploadCar, createCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the car
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 *
 *   put:
 *     summary: Update a car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the car
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *                 description: Make ID (reference to an existing Make)
 *               model[en]:
 *                 type: string
 *                 description: English model name
 *               model[ar]:
 *                 type: string
 *                 description: Arabic model name (optional)
 *               year:
 *                 type: integer
 *                 description: Manufacturing year
 *               condition:
 *                 type: string
 *                 enum: [Brand New, Elite Approved]
 *                 description: Condition of the car
 *               mileage:
 *                 type: number
 *                 description: Mileage in kilometers
 *               stockNumber:
 *                 type: string
 *                 description: Unique stock number
 *               exteriorColor[en]:
 *                 type: string
 *                 description: English exterior color
 *               exteriorColor[ar]:
 *                 type: string
 *                 description: Arabic exterior color
 *               interiorColor[en]:
 *                 type: string
 *                 description: English interior color
 *               interiorColor[ar]:
 *                 type: string
 *                 description: Arabic interior color
 *               engine[en]:
 *                 type: string
 *                 description: English engine description
 *               engine[ar]:
 *                 type: string
 *                 description: Arabic engine description
 *               bhp[en]:
 *                 type: string
 *                 description: English brake horsepower
 *               bhp[ar]:
 *                 type: string
 *                 description: Arabic brake horsepower
 *               door:
 *                 type: integer
 *                 description: Number of doors
 *               warranty:
 *                 type: boolean
 *                 description: Warranty status
 *               name[en]:
 *                 type: string
 *                 description: English car name
 *               name[ar]:
 *                 type: string
 *                 description: Arabic car name
 *               price:
 *                 type: number
 *                 description: Price in currency
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files (select multiple files from file explorer)
 *               replaceImages:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 description: Whether to replace existing images or add to them
 *     responses:
 *       200:
 *         description: Car updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Car'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Car or Make not found
 *
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the car
 *     responses:
 *       200:
 *         description: Car deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Car not found
 */
router.route('/:id').get(getCar).put(protect, uploadCar, updateCar).delete(protect, deleteCar);

module.exports = router;
