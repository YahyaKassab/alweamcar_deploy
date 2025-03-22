const express = require('express');
const {
  createPartner,
  getPartners,
  updatePartner,
  deletePartner,
} = require('../controllers/partner');
const { protect } = require('../middleware/auth');
const { uploadPartner } = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Partners
 *   description: Partner management
 */

/**
 * @swagger
 * /api/partners:
 *   post:
 *     summary: Create a new partner
 *     tags: [Partners]

 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - url
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: Partner name (English)
 *                 example: AutoZone
 *               url:
 *                 type: string
 *                 description: Partner website URL
 *                 example: https://www.autozone.com
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Partner image file
 *     responses:
 *       201:
 *         description: Partner created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Partner'
 *       400:
 *         description: Missing required fields or invalid input
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, uploadPartner, createPartner);

/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: Get all partners with pagination
 *     tags: [Partners]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of partners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Partner'
 */
router.get('/', getPartners);

/**
 * @swagger
 * /api/partners/{id}:
 *   put:
 *     summary: Update a partner
 *     tags: [Partners]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Partner name (English)
 *                 example: AutoZone
 *               url:
 *                 type: string
 *                 description: Partner website URL
 *                 example: https://www.autozone.com
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New partner image file (replaces existing)
 *     responses:
 *       200:
 *         description: Partner updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Partner'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Partner not found
 */
router.put('/:id', protect, uploadPartner, updatePartner);

/**
 * @swagger
 * /api/partners/{id}:
 *   delete:
 *     summary: Delete a partner
 *     tags: [Partners]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner ID
 *     responses:
 *       200:
 *         description: Partner deleted successfully
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
 *         description: Partner not found
 */
router.delete('/:id', protect, deletePartner);

module.exports = router;
