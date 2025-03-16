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
const {uploadCar} = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Car:
 *      type: object
 *      required:
 *        - make
 *        - model
 *        - year
 *        - condition
 *        - mileage
 *        - stockNumber
 *        - name
 *        - price
 *        - images
 *      properties:
 *        _id:
 *          type: string
 *          description: Auto-generated ID of the car
 *        make:
 *          type: string
 *          description: Car manufacturer
 *        model:
 *          type: string
 *          description: Car model
 *        year:
 *          type: integer
 *          description: Manufacturing year
 *        condition:
 *          type: string
 *          enum: [Brand New, Elite Approved]
 *          description: Car condition
 *        mileage:
 *          type: number
 *          description: Car mileage in kilometers/miles
 *        stockNumber:
 *          type: string
 *          description: Unique stock identification number
 *        exteriorColor:
 *          type: string
 *          description: Exterior color of the car
 *        interiorColor:
 *          type: string
 *          description: Interior color of the car
 *        engine:
 *          type: string
 *          description: Engine specifications
 *        bhp:
 *          type: number
 *          description: Brake horsepower
 *        door:
 *          type: integer
 *          description: Number of doors
 *        warranty:
 *          type: boolean
 *          description: Whether the car has warranty
 *        name:
 *          type: string
 *          description: Full name/title of the car listing
 *        price:
 *          type: number
 *          description: Car price
 *        images:
 *          type: array
 *          items:
 *            type: string
 *          description: Array of image paths
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: Date when the entry was created
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: Date when the entry was last updated
 *      example:
 *        make: Toyota
 *        model: Camry
 *        year: 2023
 *        condition: Brand New
 *        mileage: 0
 *        stockNumber: TYT-00123
 *        exteriorColor: White
 *        interiorColor: Beige
 *        engine: 2.5L 4-Cylinder
 *        bhp: 203
 *        door: 4
 *        warranty: true
 *        name: Toyota Camry LE
 *        price: 26520
 *        images: ["/uploads/images/car-1234567890.jpg"]
 */

// /**
//  * @swagger
//  * /api/cars/makes:
//  *   get:
//  *     summary: Get all car makes with their respective models
//  *     tags: [Cars]
//  *     responses:
//  *       200:
//  *         description: List of all car makes with associated models
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 count:
//  *                   type: integer
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       make:
//  *                         type: string
//  *                         example: "Toyota"
//  *                       models:
//  *                         type: array
//  *                         items:
//  *                           type: string
//  *                         example: ["Corolla", "Camry"]
//  */
// router.get('/makes', getMakes);

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
 *         description: Car make to filter by
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Car model to filter by
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
 *               - model
 *               - year
 *               - condition
 *               - mileage
 *               - stockNumber
 *               - name
 *               - price
 *               - images
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
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
 *                 type: string
 *               interiorColor:
 *                 type: string
 *               engine:
 *                 type: string
 *               bhp:
 *                 type: number
 *               door:
 *                 type: integer
 *               warranty:
 *                 type: boolean
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
router.route('/').get(getCars).post(protect, uploadCar.array('images', 10), createCar);

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
 *               model:
 *                 type: string
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
 *                 type: string
 *               interiorColor:
 *                 type: string
 *               engine:
 *                 type: string
 *               bhp:
 *                 type: number
 *               door:
 *                 type: integer
 *               warranty:
 *                 type: boolean
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
 *     security:
 *       - bearerAuth: []
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
    .put(protect, uploadCar.array('images', 10), updateCar)
    .delete(protect, deleteCar);

module.exports = router;
