const pool = require('../config/db');

exports.postHelpRequest = async (req, res) => {
  const userId = req.user.id;
  const { title, description, latitude, longitude } = req.body;

  try {
    await pool.promise().query(
      'INSERT INTO help_requests (user_id, title, description, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, latitude, longitude]
    );

    res.status(201).json({ msg: 'Help request submitted successfully' });
  } catch (error) {
    console.error("Help request error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.getHelpRequests = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let query = 'SELECT * FROM help_requests';
    let params = [];

    // If victim, show only their requests
    if (role === 'victim') {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }

    const [rows] = await pool.promise().query(query, params);

    res.json(rows);
  } catch (error) {
    console.error("Get help requests error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.updateHelpRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log("Status received:", status);

  const validStatuses = ['open', 'accepted', 'resolved'];
  

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }

  try {
    const [result] = await pool.promise().query(
      'UPDATE help_requests SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Help request not found' });
    }

    res.json({ msg: `Help request status updated to '${status}'` });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};
