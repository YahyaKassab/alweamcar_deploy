const express = require('express');
const { createMake, getMakes, updateMake, deleteMake } = require('../controllers/make');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Makes
 *   description: Car makes management
 */

/**
 * @swagger
 * /api/makes:
 *   post:
 *     summary: Create a new car make
 *     tags: [Makes]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name[en]
 *               - name[ar]
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English name of the make
 *                     example: Toyota
 *                   ar:
 *                     type: string
 *                     description: Arabic name of the make
 *                     example: تويوتا
 *                 required: [en, ar]
 *               models:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       description: English model name
 *                       example: Corolla
 *                     ar:
 *                       type: string
 *                       description: Arabic model name
 *                       example: كورولا
 *                 example: [{"en": "Corolla", "ar": "كورولا"}, {"en": "Camry", "ar": "كامري"}]
 *     responses:
 *       201:
 *         description: Make created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Make'
 *       400:
 *         description: Make already exists or invalid input
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, createMake);

/**
 * @swagger
 * /api/makes:
 *   get:
 *     summary: Get all makes with pagination
 *     tags: [Makes]
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
 *         description: A list of makes
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
 *                     $ref: '#/components/schemas/Make'
 */
router.get('/', getMakes);

/**
 * @swagger
 * /api/makes/{id}:
 *   put:
 *     summary: Update an existing make
 *     tags: [Makes]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Make ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                     description: English name of the make
 *                     example: Toyota
 *                   ar:
 *                     type: string
 *                     description: Arabic name of the make
 *                     example: تويوتا
 *               models:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     en:
 *                       type: string
 *                       description: English model name
 *                       example: Corolla
 *                     ar:
 *                       type: string
 *                       description: Arabic model name
 *                       example: كورولا
 *                 example: [{"en": "Corolla", "ar": "كورولا"}, {"en": "Camry", "ar": "كامري"}]
 *     responses:
 *       200:
 *         description: Make updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Make'
 *       400:
 *         description: Invalid input or duplicate name
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Make not found
 */
router.put('/:id', protect, updateMake);

/**
 * @swagger
 * /api/makes/{id}:
 *   delete:
 *     summary: Delete a make
 *     tags: [Makes]

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Make ID
 *     responses:
 *       200:
 *         description: Make deleted successfully
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
 *         description: Make not found
 */
router.delete('/:id', protect, deleteMake);

module.exports = router;
