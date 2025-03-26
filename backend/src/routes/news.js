const express = require('express');
const { getAllNews, getNews, createNews, updateNews, deleteNews } = require('../controllers/news');
const { protect } = require('../middleware/auth');
const { uploadNews } = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: News
 *   description: News management API
 */

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of news per page
 *     responses:
 *       200:
 *         description: List of all news with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f1f77bcf86cd799439011"
 *                       details:
 *                         type: object
 *                         properties:
 *                           en:
 *                             type: string
 *                             example: "A new electric vehicle was launched."
 *                           ar:
 *                             type: string
 *                             example: "تم إطلاق سيارة كهربائية جديدة."
 *                       preview:
 *                         type: object
 *                         properties:
 *                           en:
 *                             type: string
 *                             example: "Driving the Future"
 *                           ar:
 *                             type: string
 *                             example: "قيادة المستقبل"
 *                       image:
 *                         type: string
 *                         example: "news1.jpg"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a new news item
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               details_en:
 *                 type: string
 *                 description: News details in English
 *                 example: "A new electric vehicle was launched."
 *               details_ar:
 *                 type: string
 *                 description: News details in Arabic
 *                 example: "تم إطلاق سيارة كهربائية جديدة."
 *               preview_en:
 *                 type: string
 *                 description: Preview text in English
 *                 example: "Driving the Future"
 *               preview_ar:
 *                 type: string
 *                 description: Preview text in Arabic
 *                 example: "قيادة المستقبل"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: News image file
 *     responses:
 *       201:
 *         description: News item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     details:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "A new electric vehicle was launched."
 *                         ar:
 *                           type: string
 *                           example: "تم إطلاق سيارة كهربائية جديدة."
 *                     preview:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Driving the Future"
 *                         ar:
 *                           type: string
 *                           example: "قيادة المستقبل"
 *                     image:
 *                       type: string
 *                       example: "news1.jpg"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Get news by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     responses:
 *       200:
 *         description: Returns a single news item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     details:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "A new electric vehicle was launched."
 *                         ar:
 *                           type: string
 *                           example: "تم إطلاق سيارة كهربائية جديدة."
 *                     preview:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Driving the Future"
 *                         ar:
 *                           type: string
 *                           example: "قيادة المستقبل"
 *                     image:
 *                       type: string
 *                       example: "news1.jpg"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: News not found
 */

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news item
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               details_en:
 *                 type: string
 *                 description: Updated news details in English
 *                 example: "Updated: A new electric vehicle was launched."
 *               details_ar:
 *                 type: string
 *                 description: Updated news details in Arabic
 *                 example: "محدث: تم إطلاق سيارة كهربائية جديدة."
 *               preview_en:
 *                 type: string
 *                 description: Updated preview text in English
 *                 example: "Updated: Driving the Future"
 *               preview_ar:
 *                 type: string
 *                 description: Updated preview text in Arabic
 *                 example: "محدث: قيادة المستقبل"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Updated news image
 *     responses:
 *       200:
 *         description: News item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     details:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Updated: A new electric vehicle was launched."
 *                         ar:
 *                           type: string
 *                           example: "محدث: تم إطلاق سيارة كهربائية جديدة."
 *                     preview:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Updated: Driving the Future"
 *                         ar:
 *                           type: string
 *                           example: "محدث: قيادة المستقبل"
 *                     image:
 *                       type: string
 *                       example: "news1_updated.jpg"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: News not found
 */

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news item
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     responses:
 *       200:
 *         description: News item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       404:
 *         description: News not found
 */

router.route('/').get(getAllNews).post(protect, uploadNews, createNews);
router.route('/:id').get(getNews).put(protect, uploadNews, updateNews).delete(protect, deleteNews);

module.exports = router;
