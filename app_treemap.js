// backend/app.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

console.log('📦 App 啟動中...');

const app = express();
app.use(cors());
app.use(express.json());

let pool; // MySQL 連線池

// 將資料庫連線建立與 server 啟動包在 async 函式中
(async () => {
  try {
    pool = await mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: 'visTor0630',
      database: 'vistor',
      waitForConnections: true,
      connectionLimit: 10,
    });

    await pool.query('SELECT 1'); // 測試連線
    console.log('✅ MySQL 連線成功');

    // 啟動後端伺服器
    app.listen(3001, () => {
      console.log('✅ Backend running at http://localhost:3001');
    });
  } catch (err) {
    console.error('❌ 無法連接 MySQL：', err);
    process.exit(1); // 出錯直接結束
  }
})();

app.get('/api/d3', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.re_a_id, r.a_id, r.vote_like, r.vote_love, a.name_zh, a.category, a.photo, r.who_like, r.who_love,
             (r.vote_like + r.vote_love) AS total_votes
      FROM re_attractions r
      JOIN attractions a ON r.a_id = a.a_id
      ORDER BY total_votes DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/d3 錯誤：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});


