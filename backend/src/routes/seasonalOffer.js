const express = require('express');
const {
    getSeasonalOffers,
    getSeasonalOffer,
    createSeasonalOffer,
    updateSeasonalOffer,
    deleteSeasonalOffer,
} = require('../controllers/seasonalOffer');
const { protect } = require('../middleware/auth');
const {uploadOffer} = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seasonal Offers
 *   description: API endpoints for managing seasonal offers
 */

/**
 * @swagger
 * /api/seasonal-offers:
 *   get:
 *     summary: Get all seasonal offers
 *     tags: [Seasonal Offers]
 *     parameters:
 *       - in: query
 *         name: show
 *         schema:
 *           type: boolean
 *         description: Filter offers by visibility
 *     responses:
 *       200:
 *         description: List of seasonal offers
 */
router.route('/').get(getSeasonalOffers);

/**
 * @swagger
 * /api/seasonal-offers:
 *   post:
 *     summary: Create a new seasonal offer
 *     tags: [Seasonal Offers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: The title of the seasonal offer in English
 *                   ar:
 *                     type: string
 *                     description: The title of the seasonal offer in Arabic
 *               details:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: Details about the seasonal offer in English
 *                   ar:
 *                     type: string
 *                     description: Details about the seasonal offer in Arabic
 *               show:
 *                 type: boolean
 *                 description: Whether the offer is visible
 *     responses:
 *       201:
 *         description: Seasonal offer created successfully
 *       400:
 *         description: Bad request (missing or invalid data)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.route('/').post(protect, uploadOffer.single('image'), createSeasonalOffer);

/**
 * @swagger
 * /api/seasonal-offers/{id}:
 *   get:
 *     summary: Get a single seasonal offer by ID
 *     tags: [Seasonal Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: Seasonal offer data
 */
router.route('/:id').get(getSeasonalOffer);

/**
 * @swagger
 * /api/seasonal-offers/{id}:
 *   put:
 *     summary: Update an existing seasonal offer
 *     tags: [Seasonal Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the seasonal offer to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: The updated title of the seasonal offer in English
 *                   ar:
 *                     type: string
 *                     description: The updated title of the seasonal offer in Arabic
 *               details:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: Updated details about the seasonal offer in English
 *                   ar:
 *                     type: string
 *                     description: Updated details about the seasonal offer in Arabic
 *               show:
 *                 type: boolean
 *                 description: Whether the offer should be visible
 *     responses:
 *       200:
 *         description: Seasonal offer updated successfully
 *       400:
 *         description: Bad request (invalid data)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Seasonal offer not found
 */
router.route('/:id').put(protect, uploadOffer.single('image'), updateSeasonalOffer);

/**
 * @swagger
 * /api/seasonal-offers/{id}:
 *   delete:
 *     summary: Delete a seasonal offer
 *     tags: [Seasonal Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: Seasonal offer deleted
 */
router.route('/:id').delete(protect, deleteSeasonalOffer);

module.exports = router;