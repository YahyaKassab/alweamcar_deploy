const express = require('express');
const { getWhatWeDo, updateWhatWeDo } = require('../controllers/whatWeDo');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/what-we-do:
 *   get:
 *     summary: Get the "What We Do" content
 *     description: Retrieves the current "What We Do" section content in both English and Arabic.
 *     tags: [What We Do]
 *     responses:
 *       200:
 *         description: Successfully retrieved content
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
 *                     title:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Default Title in English"
 *                         ar:
 *                           type: string
 *                           example: "العنوان الافتراضي بالعربية"
 *                     details:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Default details in English."
 *                         ar:
 *                           type: string
 *                           example: "تفاصيل افتراضية بالعربية."
 *                     image:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-22T12:00:00Z"
 *   put:
 *     summary: Update the "What We Do" content
 *     description: Updates the "What We Do" section content in both English and Arabic.
 *     tags: [What We Do]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: "Updated Title in English"
 *                   ar:
 *                     type: string
 *                     example: "العنوان المحدث بالعربية"
 *               details:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: "Updated details in English."
 *                   ar:
 *                     type: string
 *                     example: "التفاصيل المحدثة بالعربية."
 *               image:
 *                 type: string
 *                 example: "https://example.com/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Successfully updated content
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
 *                     title:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Updated Title in English"
 *                         ar:
 *                           type: string
 *                           example: "العنوان المحدث بالعربية"
 *                     details:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Updated details in English."
 *                         ar:
 *                           type: string
 *                           example: "التفاصيل المحدثة بالعربية."
 *                     image:
 *                       type: string
 *                       example: "https://example.com/updated-image.jpg"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-22T12:00:00Z"
 *       401:
 *         description: Unauthorized, authentication required
 *       400:
 *         description: Bad request, validation error
 */
router.route('/').get(getWhatWeDo).put(protect, updateWhatWeDo);

module.exports = router;
