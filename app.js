import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'visTor0630',
  database: 'vistor',
  waitForConnections: true,
  connectionLimit: 10,
});

/* 模糊搜尋飯店 ---------------------------------------------------- */
app.get('/api/hotels', async (req, res) => {
  const { query = '' } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT h_id   AS id,
              name_zh AS name
       FROM   hotels
       WHERE  name_zh LIKE ?
       LIMIT  20`,
      [`%${query}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error('❗ DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/* 新增行程 + 對應飯店 -------------------------------------------- */
app.post('/api/a', async (req, res) => {
  console.log('收到資料:', req.body);

  const {
    country,
    title,
    arrivalDate,
    departureDate,
    hotels = [], // 前端請傳陣列 ["飯店A","飯店B",…]
  } = req.body;

  let conn;
  
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* 3-1 寫入 trips */
    const [tripRes] = await conn.execute(
      `INSERT INTO trips (country, title, s_date, e_date)
       VALUES (?, ?, ?, ?)`,
      [country, title, arrivalDate, departureDate]
    );
    const tripId = tripRes.insertId; // 取得 t_id

    /* 3-2 批次寫入 trip_hotels */
    if (hotels.length) {
      const values = hotels.map((name) => [tripId, name]);
      await conn.query(
        `INSERT INTO trip_hotels (t_id, h_name_zh)
         VALUES ?`,
        [values] // 二維陣列
      );
    }

    await conn.commit();
    res.json({ success: true, tripId });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('❗ 資料庫錯誤:', err);
    res
      .status(500)
      .json({ success: false, message: 'Database error', error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

/* 啟動伺服器 ------------------------------------------------------ */
app.listen(3001, () => {
  console.log('Backend server running at http://localhost:3001');
});
