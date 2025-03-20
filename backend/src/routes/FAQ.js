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

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
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
 *             required:
 *               - question
 *               - answer
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FAQ'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Update an FAQ
 *     tags: [FAQs]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FAQ'
 *       400:
 *         description: Invalid ID format or validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: FAQ not found
 */

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Delete an FAQ item
 *     tags: [FAQs]  # Fixed typo from "Faqs" to "FAQs"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ item deleted successfully
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
 *         description: FAQ not found
 */

router.route('/').get(getFAQs).post(protect, createFAQ);
router.route('/:id').get(getFAQ).put(protect, updateFAQ).delete(protect, deleteFAQ);

module.exports = router;
