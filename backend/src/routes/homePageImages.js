const express = require('express');
const { getHomePageImages, updateHomePageImages } = require('../controllers/homePageImages');
const { protect } = require('../middleware/auth');
const { uploadHome } = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HomePageImages
 *   description: Home page images management API
 */

/**
 * @swagger
 * /api/home-page-images:
 *   get:
 *     summary: Get home page images
 *     tags: [HomePageImages]
 *     responses:
 *       200:
 *         description: Returns the home page images document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     whatWeDo:
 *                       type: string
 *                       description: URL of the What We Do image
 *                     brands:
 *                       type: string
 *                       description: URL of the Brands image
 *                     news:
 *                       type: string
 *                       description: URL of the News image
 *                     showroom:
 *                       type: string
 *                       description: URL of the Showroom image
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.route('/').get(getHomePageImages);

/**
 * @swagger
 * /api/home-page-images:
 *   put:
 *     summary: Update home page images
 *     tags: [HomePageImages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               whatWeDo:
 *                 type: string
 *                 format: binary
 *                 description: Image file for What We Do section
 *               brands:
 *                 type: string
 *                 format: binary
 *                 description: Image file for Brands section
 *               news:
 *                 type: string
 *                 format: binary
 *                 description: Image file for News section
 *               showroom:
 *                 type: string
 *                 format: binary
 *                 description: Image file for Showroom section
 *     responses:
 *       200:
 *         description: Home page images updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     whatWeDo:
 *                       type: string
 *                     brands:
 *                       type: string
 *                     news:
 *                       type: string
 *                     showroom:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Home page images document not found
 *       401:
 *         description: Unauthorized
 */
router.route('/').put(protect, uploadHome, updateHomePageImages);

module.exports = router;
