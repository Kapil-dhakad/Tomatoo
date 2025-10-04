const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order
async function placeOrder(req, res) {
    const frontend_url = "http://localhost:5173"
    const { items, amount, address } = req.body
    try {
        const order = await orderModel.create({
            userId: req.userId,
            items,
            address,
            amount
        })
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} })

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "INR",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100) // rupees to paisa
            },
            quantity: item.quantity // typo fix
        }));
        line_items.push({
            price_data: {
                currency: "INR",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 50 * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${order._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${order._id}`,

        })

        res.status(200).json({
            success: true,
            session_url: session.url
        })
    } catch (error) {
        console.error("Stripe placeOrder error:", error);
        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
}

async function verifyOrder(req, res) {
    const { orderId, success } = req.body;

    try {
        if (success === "true") {
            const order = await orderModel.findByIdAndUpdate(
                orderId,
                { payment: true },
                { new: true } // updated document return karega
            );

            return res.status(200).json({ success: true, message: "paid", order });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return res.status(200).json({ success: false, message: "payment failed" });
        }
    } catch (error) {
        console.error("Stripe verifyOrder error:", error);
        return res.status(500).json({
            success: false,
            message: "Error",
        });
    }
}

async function userOrders(req, res) {

    try {
        const orders = await orderModel.find({userId: req.userId});
        res.status(200).json({success: true, orders})
    } catch (error) {
        res.status(500).json({success: false, message: "Error"})
    }
}

//Listing orders for admin panel
async function listOrders(req, res){
    try {
        const orders = await orderModel.find();
        res.status(200).json({success: true, data:orders})
    } catch (error) {
        res.status(500).json({success: false, message: "Error"})
    }
}

//api for updating order status
async function updateStatus(req, res){
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
        res.status(200).json({success: true, message: "Status updated"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Error"})
    }
}
    

module.exports = {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus
}