const fetch = require("node-fetch");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // to parse JSON request body

// Endpoint to verify payment
app.post("/api/payment/verify", async (req, res) => {
  const { token, amount } = req.body;
  
  console.log("Received payment verification request:", req.body);

  try {
    // Send verification request to Khalti's API with the secret key for authorization
    const response = await fetch("http://localhost:5000/api/payment/verify", {
      method: "POST",
      headers: {
        "Authorization": `Bearer d51df0fe139548c1838230e82895db7a`, // Correct secret key here
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        amount,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store payment details in the database (assumed function)
      await storePaymentDetails(token, amount, "success");
      res.json({ success: true });
    } else {
      // Store failed payment
      await storePaymentDetails(token, amount, "failed");
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Example storePaymentDetails function (you would implement this with your database logic)
async function storePaymentDetails(token, amount, status) {
  // Example database logic for storing the payment info
  console.log(`Storing payment details: ${token}, ${amount}, ${status}`);
  // Add your database logic here...
}

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
