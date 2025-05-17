import pool from '../db/Connection.js';
import { generateHmacSha256Hash } from '../utils/helper.js';
import axios from 'axios';

// Initiate Payment
const initiatePayment = async (req, res) => {
  const {
    amount,
    userId,
    paymentGateway,
    productName,
    productId,
    vehicleModel,
  } = req.body;

  if (!amount || !userId || !paymentGateway || !productName || !productId || !vehicleModel) {
    return res.status(400).json({
      message: 'Missing required fields: amount, userId, paymentGateway, productName, productId, vehicleModel',
    });
  }

  try {
    const paymentConfig = {};

    if (paymentGateway === 'esewa') {
      const paymentData = {
        amount,
        failure_url: process.env.FAILURE_URL,
        product_delivery_charge: '0',
        product_service_charge: '0',
        product_code: process.env.ESEWA_MERCHANT_ID,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        success_url: process.env.SUCCESS_URL,
        tax_amount: '0',
        total_amount: amount,
        transaction_uuid: productId,
      };

      const data = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`;
      const signature = generateHmacSha256Hash(data, process.env.ESEWA_SECRET);

      paymentConfig.url = process.env.ESEWA_PAYMENT_URL;
      paymentConfig.data = { ...paymentData, signature };
      paymentConfig.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      paymentConfig.responseHandler = (response) => response.request?.res?.responseUrl;

    } else if (paymentGateway === 'khalti') {
      paymentConfig.url = process.env.KHALTI_PAYMENT_URL;
      paymentConfig.data = {
        return_url: process.env.SUCCESS_URL,
        website_url: 'http://localhost:3000',
        purchase_order_id: productId,
        purchase_order_name: productName,
        amount: amount * 100,
        mobile: '9810205962',
        product_identity: productId,
        product_name: productName,
        failure_url: process.env.FAILURE_URL,
        public_key: process.env.KHALTI_PUBLIC_KEY,
      };
      paymentConfig.headers = {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      };
      paymentConfig.responseHandler = (response) => response.data?.payment_url;
    } else {
      return res.status(400).json({ message: 'Invalid payment gateway' });
    }

    const payment = await axios.post(paymentConfig.url, paymentConfig.data, {
      headers: paymentConfig.headers,
    });

    const paymentUrl = paymentConfig.responseHandler(payment);
    if (!paymentUrl) throw new Error('Payment URL is missing in the response');

    // Insert transaction into DB
    const insertQuery = `
      INSERT INTO transactions (
        userid,
        product_name,
        product_id,
        vehiclemodel,
        amount,
        payment_gateway,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      userId,
      productName,
      productId,
      vehicleModel,
      amount,
      paymentGateway,
      'PENDING',
    ];

    await pool.query(insertQuery, values);

    return res.send({ url: paymentUrl });

  } catch (error) {
    console.error('Error during payment initiation:', error.response?.data || error.message);
    return res.status(500).json({
      message: 'Payment initiation failed',
      error: error.response?.data || error.message,
    });
  }
};

// Payment Status Check
const paymentStatus = async (req, res) => {
  const { product_id, pidx, status } = req.body;

  try {
    const { rows } = await pool.query('SELECT * FROM transactions WHERE product_id = $1', [product_id]);
    const transaction = rows[0];

    if (!transaction) {
      return res.status(400).json({ message: 'Transaction not found' });
    }

    const { payment_gateway, amount } = transaction;
    let gatewayTransactionId = null;
    let newStatus = 'FAILED';

    if (status === 'FAILED') {
      await pool.query(
        `UPDATE transactions SET status = $1, updated_at = NOW() WHERE product_id = $2`,
        ['FAILED', product_id]
      );
      return res.status(200).json({ message: 'Transaction marked as FAILED', status: 'FAILED' });
    }

    if (payment_gateway === 'esewa') {
      const response = await axios.get(process.env.ESEWA_PAYMENT_STATUS_CHECK_URL, {
        params: {
          product_code: process.env.ESEWA_MERCHANT_ID,
          total_amount: amount,
          transaction_uuid: product_id,
        },
      });

      const paymentStatusCheck = response.data;
      newStatus = paymentStatusCheck.status === 'COMPLETE' ? 'COMPLETED' : 'FAILED';
      gatewayTransactionId = paymentStatusCheck.referenceId || null;

    } else if (payment_gateway === 'khalti') {
      const response = await axios.post(
        process.env.KHALTI_VERIFICATION_URL,
        { pidx },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const paymentStatusCheck = response.data;
      newStatus = paymentStatusCheck.status === 'Completed' ? 'COMPLETED' : 'FAILED';
      gatewayTransactionId = paymentStatusCheck.pidx || null;

    } else {
      return res.status(400).json({ message: 'Invalid payment gateway' });
    }

    await pool.query(
      `UPDATE transactions
       SET status = $1, transaction_id = $2, updated_at = NOW()
       WHERE product_id = $3`,
      [newStatus, gatewayTransactionId, product_id]
    );

    return res.status(200).json({
      message: `Transaction updated to ${newStatus}`,
      status: newStatus,
      transaction_id: gatewayTransactionId,
    });

  } catch (error) {
    console.error('Error checking payment status:', error.message);
    return res.status(500).json({
      message: 'Payment status check failed',
      error: error.message,
    });
  }
};

export { initiatePayment, paymentStatus };
