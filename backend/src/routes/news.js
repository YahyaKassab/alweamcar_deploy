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
 */
router.route('/').get(getAllNews);
/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Create a new news item
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_en:
 *                 type: string
 *                 description: News title in English
 *               title_ar:
 *                 type: string
 *                 description: News title in Arabic
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: News image file
 *               details_en:
 *                 type: string
 *                 description: News details in English
 *               details_ar:
 *                 type: string
 *                 description: News details in Arabic
 *     responses:
 *       201:
 *         description: News item created successfully
 *       400:
 *         description: Validation error
 */

router.route('/').post(protect, uploadNews.single('image'), createNews);

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
 *       404:
 *         description: News not found
 */
router.route('/:id').get(getNews);

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news item
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: News ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title_en:
 *                 type: string
 *                 description: Updated news title in English
 *               title_ar:
 *                 type: string
 *                 description: Updated news title in Arabic
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Updated news image
 *               details_en:
 *                 type: string
 *                 description: Updated news details in English (Markdown format)
 *               details_ar:
 *                 type: string
 *                 description: Updated news details in Arabic (Markdown format)
 *     responses:
 *       200:
 *         description: News item updated successfully
 *       404:
 *         description: News not found
 */
router.route('/:id').put(protect, uploadNews.single('image'), updateNews);

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news item
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
 *         description: News item deleted successfully
 *       404:
 *         description: News not found
 */
router.route('/:id').delete(protect, deleteNews);

module.exports = router;
