const pool = require("../db/Connection");

// Controller to fetch all transactions
const getAllTransactions = async (req, res) => {
  try {
    const query = `
      SELECT 
        transactions.id,
        transactions.userid,
        transactions.product_name,
        transactions.product_id,
        transactions.vechilemodel,
        transactions.amount,
        transactions.payment_gateway,
        transactions.status,
        transactions.created_at,
        transactions.updated_at,
        users.name AS user_name,  -- Correct column for name
        users.contact_number AS user_contact_number  -- Correct column for contact number
      FROM transactions
      JOIN users ON transactions.userid = users.id
    `;
    
    const { rows: transactions } = await pool.query(query);
    res.json(transactions); // Send the transaction data as a response
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTransactions,
};
