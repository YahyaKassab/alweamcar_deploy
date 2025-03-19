const express = require('express');
const { getTermsAndConditions , updateTermsAndConditions } = require('../controllers/terms');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/terms:
 *   get:
 *     summary: Get the "Terms & Conditions" content
 *     description: Retrieves the current "Terms & Conditions" section content in both English and Arabic.
 *     tags: [Terms & Conditions]
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
 *                     content:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Our mission is to provide..."
 *                         ar:
 *                           type: string
 *                           example: "مهمتنا هي تقديم..."
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *   put:
 *     summary: Update the "Terms & Conditions" content
 *     description: Updates the "Terms & Conditions" section content in both English and Arabic.
 *     tags: [Terms & Conditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     example: "Updated content in English."
 *                   ar:
 *                     type: string
 *                     example: "المحتوى المحدث باللغة العربية."
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
 *                     content:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Updated English content."
 *                         ar:
 *                           type: string
 *                           example: "تم تحديث المحتوى العربي."
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized, authentication required
 *       400:
 *         description: Bad request, validation error
 */
router.route('/').get(getTermsAndConditions).put(protect, updateTermsAndConditions);

module.exports = router;
