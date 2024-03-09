const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const nftmodel = require("./models/nftmode");
const paymentmodel = require("./models/paymentmodel");
const connectToDatabase = require("./dbconnect");

connectToDatabase();
app.use(express.json());
// Use CORS middleware
app.use(cors());

// Initialize Razorpay instance with your API key
const razorpay = new Razorpay({
  key_id: "rzp_test_KwRs2aPGT9pNJ9",
  key_secret: "NUTTunxxMNFXPWZQt6xfpc18",
});
app.get("/", (req, res) => {
  res.send("Hello World! magickart");
});

app.get("/nft", async (req, res) => {
  try {
    let nfts = await nftmodel.find({});
    return res.status(200).json({ success: true, data: nfts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

async function validatingitems(req, res, next) {
  let cartitems = req.body.items;
  let validproducts = [];
  let total = 0;

  try {
    if (req.body.total <= 0 || cartitems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart does not have valid items",
      });
    }

    // Define a function to check if the product exists
    async function isproductexist(item) {
     
        let nft = await nftmodel.findOne({ _id: item.id });
        if (!nft) {
          
          throw Error("item not found")


        }

        let validitem = { quantity: item.quantity, ...nft._doc };
        total += validitem.price * validitem.quantity;
        validproducts.push(validitem);
      
    }

    // Use Promise.all to wait for all asynchronous operations to complete
    try {
     await Promise.all(cartitems.map((item) => isproductexist(item)));
      req.body = {
        total,
        items: validproducts,
      };
      
  next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
      
    }

   

  
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

app.post("/order/nft/create-payment", validatingitems, (req, res) => {
  console.log("payment order created");
  const options = {
    amount: req.body.total * 100, // Amount in paise (INR 500.00)
    currency: "INR",
    receipt: "order_receipt_" + Date.now(),
    payment_capture: 1, // Auto capture payment
  };

  razorpay.orders.create(options, async (err, order) => {
    if (err) {
      console.error("Error creating order:", err);
      return res.status(500).send("Error creating order");
    } else {
      console.log("Order created:", order);
      const payment = new paymentmodel({
        paymentId: "PAYMENT_ID_FROM_RAZORPAY",
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      });

      // Save the payment document to the database
      payment
        .save()
        .then((savedPayment) => {
          console.log("Payment saved:", savedPayment);
          return res.status(200).json({ success: true, order });
        })
        .catch((error) => {
          console.error("Error saving payment:", error);

          return res
            .status(500)
            .json({ success: false, message: error.message });
        });
    }
  });
});

app.post("/order/nft/paymentfailed", async(req, res) => {
  console.log("cacled flow")
  if (!req.body.order_id.length > 0 && req.body.payment_id.length > 0) {
    return res.status(400).json({success:false,message:"invalid paymentdetails"})

  }
  try {
    let payment = await paymentmodel.findOneAndUpdate({ orderId: req.body.order_id }, { paymentId: req.body.payment_id, status: "failed" })
    if (!payment) {
      return res.status(404).json({success:true,message:"order id not found"})
    }
    console.log("found",payment)
    return res.status(404).json({success:true,message:"payment failed"})

  } catch (error) {
    return res.status(500).json({success:false,message:error.message})

  }
})

// Route for handling payment response
app.post("/payment/response", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  // Verify payment signature
  const generatedSignature = generateSignature(
    razorpay_order_id,
    razorpay_payment_id
  );
  if (generatedSignature === razorpay_signature) {
    // Payment signature is valid, handle payment success
    console.log("Payment successful:", razorpay_payment_id);
    try {
      const orderdetail = await paymentmodel.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id, status: "success" }
      );
      if (!orderdetail) {
        return res
          .status(403)
          .json({ success: false, message: "payment order not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Payment successful" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
  } else {
    // Payment signature is invalid, handle payment failure
    console.error("Payment failed:", razorpay_payment_id);
    res.status(400).json({ success: false, message: "Payment failed" });
  }
});

// Generate Razorpay signature
function generateSignature(orderId, paymentId) {
  const hmac = crypto.createHmac("sha256", "NUTTunxxMNFXPWZQt6xfpc18");
  hmac.update(orderId + "|" + paymentId);
  return hmac.digest("hex");
}
//   saveNFTs()
app.listen(port, () => {
  console.log(`magickart app listening on port ${port}`);
});
