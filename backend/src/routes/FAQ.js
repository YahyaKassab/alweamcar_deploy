// routes/faq.js
const express = require('express');
const { getFAQs, getFAQ, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/FAQ');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: FAQ management API
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of all FAQs
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       question:
 *                         type: object
 *                         properties:
 *                           en:
 *                             type: string
 *                           ar:
 *                             type: string
 *                       answer:
 *                         type: object
 *                         properties:
 *                           en:
 *                             type: string
 *                           ar:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */
router.route('/').get(getFAQs);

/**
 * @swagger
 * /api/faqs/{id}:
 *   get:
 *     summary: Get a single FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: Returns a single FAQ
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
 *                     question:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                         ar:
 *                           type: string
 *                     answer:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                         ar:
 *                           type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: FAQ not found
 */
router.route('/:id').get(getFAQ);

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   ar:
 *                     type: string
 *                 required:
 *                   - en
 *                   - ar
 *               answer:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   ar:
 *                     type: string
 *                 required:
 *                   - en
 *                   - ar
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       400:
 *         description: Validation error
 */
router.route('/').post(protect, createFAQ);
/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Update an FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: FAQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   ar:
 *                     type: string
 *               answer:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   ar:
 *                     type: string
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       400:
 *         description: Invalid ID format or validation error
 *       404:
 *         description: FAQ not found
 */
router.route('/:id').put(protect, updateFAQ);
/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Delete a faqs item
 *     tags: [Faqs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: faqs ID
 *     responses:
 *       200:
 *         description: faqs item deleted successfully
 *       404:
 *         description: faqs not found
 */
router.route('/:id').delete(protect, deleteFAQ);

module.exports = router;
