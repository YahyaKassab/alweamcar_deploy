const express = require('express');
const { getSocial, updateSocial } = require('../controllers/social');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Social
 *   description: Social media and contact information management API
 */

/**
 * @swagger
 * /api/social:
 *   get:
 *     summary: Get social media and contact information
 *     tags: [Social]
 *     responses:
 *       200:
 *         description: Returns the social media and contact information document
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
 *                     mobile:
 *                       type: string
 *                       description: Mobile phone number
 *                     insta:
 *                       type: string
 *                       description: Instagram URL or handle
 *                     tiktok:
 *                       type: string
 *                       description: TikTok URL or handle
 *                     youtube:
 *                       type: string
 *                       description: YouTube URL
 *                     snapchat:
 *                       type: string
 *                       description: Snapchat URL or handle
 *                     location:
 *                       type: string
 *                       description: Physical location or address
 *                     email:
 *                       type: string
 *                       description: Contact email address
 *                     whatsapp:
 *                       type: string
 *                       description: WhatsApp phone number
 *                     salesNumbers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of sales contact numbers
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.route('/').get(getSocial);

/**
 * @swagger
 * /api/social:
 *   put:
 *     summary: Update social media and contact information
 *     tags: [Social]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: Description in English
 *                   ar:
 *                     type: string
 *                     description: Description in Arabic
 *               mobile:
 *                 type: string
 *                 description: Mobile phone number
 *               insta:
 *                 type: string
 *                 description: Instagram URL or handle
 *               tiktok:
 *                 type: string
 *                 description: TikTok URL or handle
 *               youtube:
 *                 type: string
 *                 description: YouTube URL
 *               snapchat:
 *                 type: string
 *                 description: Snapchat URL or handle
 *               location:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: Location in English
 *                   ar:
 *                     type: string
 *                     description: Location in Arabic
 *               locationLink:
 *                 type: string
 *                 description: Google Maps or other location link
 *               email:
 *                 type: string
 *                 description: Contact email address
 *               whatsapp:
 *                 type: string
 *                 description: WhatsApp phone number
 *               salesNumbers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of sales contact numbers
 *     responses:
 *       200:
 *         description: Social info updated successfully
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
 *                     description:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                         ar:
 *                           type: string
 *                     mobile:
 *                       type: string
 *                     insta:
 *                       type: string
 *                     tiktok:
 *                       type: string
 *                     youtube:
 *                       type: string
 *                     snapchat:
 *                       type: string
 *                     location:
 *                       type: object
 *                       properties:
 *                         en:
 *                           type: string
 *                         ar:
 *                           type: string
 *                     locationLink:
 *                       type: string
 *                     email:
 *                       type: string
 *                     whatsapp:
 *                       type: string
 *                     salesNumbers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Social document not found
 *       401:
 *         description: Unauthorized
 */

router.route('/').put(protect, updateSocial);

module.exports = router;
