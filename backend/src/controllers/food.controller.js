const foodModel = require('../models/food.model')
const storageService = require('../services/storage.service')


async function addFood(req, res) {
    try {
        const price = req.body.price ? JSON.parse(req.body.price) : null
        const { name, description, category } = req.body

        if (!name || !description || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const files = await Promise.all(
            req.files.map(async (file) => {
                return await storageService.uploadFile(file.buffer);
            })
        );

        const food = await foodModel.create({
            name,
            description,
            category,
            price,
            image: files.map((i) => i.url)
        })
        res.status(201).json({
            success: true,
            message: "Food added successfully",
            food,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }

}

async function getAllFood(req, res) {
    try {
        const food = await foodModel.find()
        res.status(200).json({
            success: true,
            message: "All food fetched successfully",
            data: food

        })
    } catch (error) {
          res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

async function removeFood(req, res) {
    try {
        const { id } = req.params;

        const deletedFood = await foodModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Food removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to remove food" });
    }
}




module.exports = {
    addFood,
    getAllFood,
    removeFood
}