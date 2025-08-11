// backend/app.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

console.log('📦 App 啟動中...');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

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
      SELECT r.re_a_id, r.a_id, r.vote_like, r.vote_love, a.name_zh, a.category, a.photo, r.who_like, r.who_love, r.t_id,
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

app.post('/api/switchvote', async (req, res) => {
  const { t_id, a_id, user_id, type } = req.body;

  if (!t_id || !a_id || !user_id || !['like', 'heart'].includes(type)) {
    return res.status(400).json({ error: '資料不正確' });
  }

  const currentVoteCol = type === 'like' ? 'vote_like' : 'vote_love';
  const currentWhoCol = type === 'like' ? 'who_like' : 'who_love';
  const otherVoteCol = type === 'like' ? 'vote_love' : 'vote_like';
  const otherWhoCol = type === 'like' ? 'who_love' : 'who_like';

  try {
    const [rows] = await pool.query(
      `SELECT who_like, who_love FROM re_attractions WHERE t_id = ? AND a_id = ?`,
      [t_id, a_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: '找不到符合的景點資料 (t_id + a_id)' });
    }

    const current = rows[0];

    let who_like = [];
    let who_love = [];

    try {
      who_like = JSON.parse(current?.who_like || '[]');
      if (!Array.isArray(who_like)) who_like = [];
    } catch {
      who_like = [];
    }

    try {
      who_love = JSON.parse(current?.who_love || '[]');
      if (!Array.isArray(who_love)) who_love = [];
    } catch {
      who_love = [];
    }

    const inCurrent = (type === 'like' ? who_like : who_love).includes(user_id);
    const inOther = (type === 'like' ? who_love : who_like).includes(user_id);

    if (inCurrent) {
      await pool.query(
        `UPDATE re_attractions
         SET ${currentVoteCol} = ${currentVoteCol} - 1,
             ${currentWhoCol} = JSON_REMOVE(${currentWhoCol}, JSON_UNQUOTE(JSON_SEARCH(${currentWhoCol}, 'one', ?)))
         WHERE t_id = ? AND a_id = ?`,
        [user_id, t_id, a_id]
      );
      return res.json({ success: true, action: 'removed' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      if (inOther) {
        await conn.query(
          `UPDATE re_attractions
           SET ${otherVoteCol} = ${otherVoteCol} - 1,
               ${otherWhoCol} = JSON_REMOVE(${otherWhoCol}, JSON_UNQUOTE(JSON_SEARCH(${otherWhoCol}, 'one', ?)))
           WHERE t_id = ? AND a_id = ?`,
          [user_id, t_id, a_id]
        );
      }

      await conn.query(
        `UPDATE re_attractions
         SET ${currentVoteCol} = ${currentVoteCol} + 1,
             ${currentWhoCol} = JSON_ARRAY_APPEND(${currentWhoCol}, '$', ?)
         WHERE t_id = ? AND a_id = ?`,
        [user_id, t_id, a_id]
      );

      await conn.commit();
      res.json({ success: true, action: 'switched' });
    } catch (err) {
      await conn.rollback();
      console.error('❌ Transaction 錯誤:', err);
      res.status(500).json({ error: '資料庫錯誤，已回滾' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('❌ switchvote 發生錯誤:', err);
    res.status(500).json({ error: '伺服器內部錯誤' });
  }
});

app.post('/api/users-info', async (req, res) => {
  const { user_ids } = req.body;
  if (!Array.isArray(user_ids) || user_ids.length === 0) {
    return res.status(400).json({ error: 'user_ids 必須是非空陣列' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT user_id, u_img FROM users WHERE user_id IN (?)`,
      [user_ids]
    );
    const map = {};
    for (const row of rows) {
      map[row.user_id] = row.u_img;
    }
    res.json(map);
  } catch (err) {
    console.error('❌ /api/users-info 錯誤：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

