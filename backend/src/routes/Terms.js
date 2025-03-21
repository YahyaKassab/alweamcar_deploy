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
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "Terms & Conditions"
 *                               ar:
 *                                 type: string
 *                                 example: "الشروط والأحكام"
 *                           details:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "Our mission is to provide the best services..."
 *                               ar:
 *                                 type: string
 *                                 example: "مهمتنا هي تقديم أفضل الخدمات..."
 *                           order:
 *                             type: number
 *                             example: 1
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
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Updated Terms & Conditions"
 *                         ar:
 *                           type: string
 *                           example: "الشروط والأحكام المحدثة"
 *                     details:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                           example: "Updated details about our terms..."
 *                         ar:
 *                           type: string
 *                           example: "تفاصيل محدثة حول الشروط..."
 *                     order:
 *                       type: number
 *                       example: 2
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
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "Updated Terms & Conditions"
 *                               ar:
 *                                 type: string
 *                                 example: "الشروط والأحكام المحدثة"
 *                           details:
 *                             type: object
 *                             properties:
 *                               en:
 *                                 type: string
 *                                 example: "Updated details about our terms..."
 *                               ar:
 *                                 type: string
 *                                 example: "تفاصيل محدثة حول الشروط..."
 *                           order:
 *                             type: number
 *                             example: 2
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
