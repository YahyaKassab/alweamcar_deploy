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
const { uploadCar } = require('../middleware/upload');

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
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English name of the make
 *                   ar:
 *                     type: string
 *                     description: Arabic name of the make
 *                 description: Make object or existing Make ID
 *               model:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English model name
 *                   ar:
 *                     type: string
 *                     description: Arabic model name
 *                 required: [en, ar]
 *               year:
 *                 type: integer
 *               condition:
 *                 type: string
 *                 enum: [Brand New, Elite Approved]
 *               mileage:
 *                 type: number
 *               stockNumber:
 *                 type: string
 *               exteriorColor:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English exterior color
 *                   ar:
 *                     type: string
 *                     description: Arabic exterior color
 *               interiorColor:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English interior color
 *                   ar:
 *                     type: string
 *                     description: Arabic interior color
 *               engine:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English engine description
 *                   ar:
 *                     type: string
 *                     description: Arabic engine description
 *               bhp:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English brake horsepower
 *                   ar:
 *                     type: string
 *                     description: Arabic brake horsepower
 *               door:
 *                 type: integer
 *               warranty:
 *                 type: boolean
 *               name:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English car name
 *                   ar:
 *                     type: string
 *                     description: Arabic car name
 *                 required: [en, ar]
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: binary
 *                       description: Image file or URL
 *                     main:
 *                       type: boolean
 *                       description: Whether this is the main image (first image is set as main by default)
 *                   example: { "url": "image1.jpg", "main": true }
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
router.route('/').get(getCars).post(protect, createCar);

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
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English name of the make
 *                   ar:
 *                     type: string
 *                     description: Arabic name of the make
 *                 description: Make object or existing Make ID
 *               model:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English model name
 *                   ar:
 *                     type: string
 *                     description: Arabic model name
 *               year:
 *                 type: integer
 *               condition:
 *                 type: string
 *                 enum: [Brand New, Elite Approved]
 *               mileage:
 *                 type: number
 *               stockNumber:
 *                 type: string
 *               exteriorColor:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English exterior color
 *                   ar:
 *                     type: string
 *                     description: Arabic exterior color
 *               interiorColor:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English interior color
 *                   ar:
 *                     type: string
 *                     description: Arabic interior color
 *               engine:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English engine description
 *                   ar:
 *                     type: string
 *                     description: Arabic engine description
 *               bhp:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English brake horsepower
 *                   ar:
 *                     type: string
 *                     description: Arabic brake horsepower
 *               door:
 *                 type: integer
 *               warranty:
 *                 type: boolean
 *               name:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English car name
 *                   ar:
 *                     type: string
 *                     description: Arabic car name
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: binary
 *                       description: Image file or URL
 *                     main:
 *                       type: boolean
 *                       description: Whether this is the main image (first image is set as main by default)
 *                   example: { "url": "image1.jpg", "main": true }
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
router.route('/:id').get(getCar).put(protect, updateCar).delete(protect, deleteCar);

module.exports = router;
