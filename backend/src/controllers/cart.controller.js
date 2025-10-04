const userModel = require('../models/user.model');

//add item to user cart
async function addToCart(req, res) {
     try {
        const userData = await userModel.findById(req.userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const cartData = userData.cartData;
        if(!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }  else {   
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.userId, { cartData });
        res.status(200).json({ success: true, message: 'Item added to cart', cartData });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }

}

//get items in user cart
async function removeFromCart(req, res) {
   try {
    const userData = await userModel.findById(req.userId);
    const cartData = userData.cartData;
    if(cartData[req.body.itemId]>0) {
        cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.status(200).json({ success: true, message: 'Item removed from cart', cartData });
   } catch (error) {
    console.log(error)
    return res.status(500).json({success: false, message: 'Error'})
   }
}

// fetch user cart data
async function getCart(req, res) {
    try {
        const userData = await userModel.findById(req.userId);
        const cartData = userData.cartData;
        res.status(200).json({ success: true, cartData });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Error' });
    }
}


module.exports = {
    addToCart,
    removeFromCart,
    getCart
};