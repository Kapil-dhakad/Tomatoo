const express = require('express')
const foodController = require('../controllers/food.controller')
const multer = require('multer')

const router = express.Router()
const upload = multer({storage: multer.memoryStorage()})

//- /api/food/add
router.post('/add',upload.array("images", 5),  foodController.addFood)
router.get('/list', foodController.getAllFood)
router.delete('/remove/:id', foodController.removeFood)


module.exports = router