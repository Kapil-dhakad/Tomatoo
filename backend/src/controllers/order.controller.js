const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");
const Stripe = require('stripe')

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY in environment');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order
async function placeOrder(req, res) {
    // Determine frontend URL: prefer env, fall back to request origin or forwarded proto
    let frontend_url = process.env.FRONTEND_URL;
    if (!frontend_url) {
        // req.get('origin') may provide full origin
        frontend_url = req.get('origin') || null;
    }
    if (!frontend_url) {
        // try building from forwarded proto or req.protocol
        const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'https').split(',')[0];
        frontend_url = `${proto}://${req.get('host')}`;
    }
    // Ensure explicit scheme (http or https)
    if (!/^https?:\/\//i.test(frontend_url)) {
        console.warn('Derived frontend_url missing scheme, forcing https:', frontend_url);
        frontend_url = `https://${frontend_url}`;
    }
    console.log('Using frontend_url for Stripe redirect:', frontend_url);
    const { items, amount, address } = req.body
    try {
        // Basic validation to avoid runtime errors (map on undefined etc.)
        if (!req.userId) {
            console.warn('placeOrder called without authenticated user');
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            console.warn('placeOrder called with invalid items:', items);
            return res.status(400).json({ success: false, message: 'No items provided' });
        }

        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            console.warn('placeOrder called with invalid amount:', amount);
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }
        // Log some request context to help debugging in deployed logs
        console.log(`placeOrder request: userId=${req.userId}, items=${items.length}, amount=${amount}`);
        const order = await orderModel.create({
            userId: req.userId,
            items,
            address,
            amount: amountNum
        })
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} })

        // Build Stripe line items safely: coerce numbers and filter invalid entries
        const line_items = req.body.items
            .map((item) => {
                const priceNum = Number(item.price);
                const qty = Number(item.quantity) || 0;
                if (isNaN(priceNum) || priceNum <= 0 || qty <= 0) {
                    return null;
                }

                return {
                    price_data: {
                        currency: "INR",
                        product_data: { name: item.name || 'Item' },
                        unit_amount: Math.round(priceNum * 100) // rupees to paisa
                    },
                    quantity: qty
                };
            })
            .filter(Boolean);

        if (line_items.length === 0) {
            console.warn('No valid line items for Stripe session, items:', req.body.items);
            return res.status(400).json({ success: false, message: 'No valid items to charge' });
        }
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
        // Log detailed error to help debugging on deploy
        console.error("Stripe placeOrder error:", error && error.message ? error.message : error);
        // If Stripe returned an error object with statusCode, forward it
        if (error && error.statusCode) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        res.status(500).json({
            success: false,
            message: "Internal server error while creating Stripe session"
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
        const orders = await orderModel.find({ userId: req.userId });
        res.status(200).json({ success: true, orders })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" })
    }
}

//Listing orders for admin panel
async function listOrders(req, res) {
    try {
        const orders = await orderModel.find();
        res.status(200).json({ success: true, data: orders })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" })
    }
}

//api for updating order status
async function updateStatus(req, res) {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.status(200).json({ success: true, message: "Status updated" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Error" })
    }
}


module.exports = {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus
}