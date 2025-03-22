const express = require('express');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getSimilarCars,
  getMakes,
} = require('../controllers/car');
const { protect } = require('../middleware/auth');
const { uploadCar } = require('../controllers/car');

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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - make
 *               - model[en]
 *               - model[ar]
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
 *                 description: Arabic model name
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
 */
router.route('/').get(getCars).post(protect, uploadCar.array('images'), createCar);

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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the car
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *                 description: Make ID (reference to an existing Make), or leave blank
 *               model[en]:
 *                 type: string
 *                 description: English model name, optional
 *               model[ar]:
 *                 type: string
 *                 description: Arabic model name, optional
 *               year:
 *                 type: integer
 *                 description: Manufacturing year, optional
 *               condition:
 *                 type: string
 *                 enum: [Brand New, Elite Approved]
 *                 description: Condition of the car, optional
 *               mileage:
 *                 type: number
 *                 description: Mileage in kilometers, optional
 *               stockNumber:
 *                 type: string
 *                 description: Unique stock number, optional
 *               exteriorColor[en]:
 *                 type: string
 *                 description: English exterior color, optional
 *               exteriorColor[ar]:
 *                 type: string
 *                 description: Arabic exterior color, optional
 *               interiorColor[en]:
 *                 type: string
 *                 description: English interior color, optional
 *               interiorColor[ar]:
 *                 type: string
 *                 description: Arabic interior color, optional
 *               engine[en]:
 *                 type: string
 *                 description: English engine description, optional
 *               engine[ar]:
 *                 type: string
 *                 description: Arabic engine description, optional
 *               bhp[en]:
 *                 type: string
 *                 description: English brake horsepower, optional
 *               bhp[ar]:
 *                 type: string
 *                 description: Arabic brake horsepower, optional
 *               door:
 *                 type: integer
 *                 description: Number of doors, optional
 *               warranty:
 *                 type: boolean
 *                 description: Warranty status, optional
 *               name[en]:
 *                 type: string
 *                 description: English car name, optional
 *               name[ar]:
 *                 type: string
 *                 description: Arabic car name, optional
 *               price:
 *                 type: number
 *                 description: Price in currency, optional
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Array of image files (select multiple files from file explorer), optional
 *               replaceImages:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 description: Whether to replace existing images or add to them, optional
 *             description: At least one field must be provided to update the car. All fields are optional.
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
 *         description: No fields provided or invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Car not found
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
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Car not found
 */
router
  .route('/:id')
  .get(getCar)
  .put(protect, uploadCar.array('images'), updateCar)
  .delete(protect, deleteCar);

module.exports = router;
