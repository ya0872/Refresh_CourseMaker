// server/index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import 'dotenv/config';

// --- Config ---
const PORT = Number(process.env.PORT || 5174);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'devtoken';

// --- DB Pool ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'walkapp',
  connectionLimit: 10,
  namedPlaceholders: true,
  timezone: 'Z'
});

// --- App ---
const app = express();
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// --- Static for uploads ---
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- Multer storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const d = new Date();
    const dir = path.join(
      process.cwd(),
      'uploads',
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`
    );
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname || '') || '.bin';
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

// --- Utility: HTML escape ---
function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// --- Health ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ====================================================================
// 公開ビュー（トークン不要）
// ====================================================================

// 一覧ページ（最新が上）
app.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, comment, created_at
         FROM maps
        ORDER BY id DESC
        LIMIT 200`
    );

    // 1枚目の写真を取得（件数多いならJOINにしてもOK）
    const ids = rows.map(r => r.id);
    let thumbs = new Map();
    if (ids.length) {
      const [p] = await pool.query(
        `SELECT map_id, MIN(id) AS pid
           FROM photos
          WHERE map_id IN (?)
          GROUP BY map_id`,
        [ids]
      );
      if (p.length) {
        const pidSet = p.map(x => x.pid);
        const [firstPhotos] = await pool.query(
          `SELECT id, map_id, photo_url
             FROM photos
            WHERE id IN (?)`,
          [pidSet]
        );
        firstPhotos.forEach(fp => thumbs.set(fp.map_id, fp.photo_url));
      }
    }

    const body = rows
      .map(m => {
        const thumb = thumbs.get(m.id);
        const img = thumb
          ? `<img src="${thumb}" style="width:120px;height:90px;object-fit:cover;border:1px solid #ddd;border-radius:8px">`
          : '';
        return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${m.id}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(m.title || '')}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml((m.comment || '').slice(0, 40))}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${m.created_at ? String(m.created_at).replace('T',' ').replace('Z','') : ''}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${img}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">
          <a href="/view/${m.id}">詳細</a> ｜ <a href="/api/maps/${m.id}">JSON</a>
        </td>
      </tr>`;
      })
      .join('');

    const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8">
<title>Walk App 投稿一覧</title>
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans JP",sans-serif;background:#f8fafc;margin:0}
.wrap{max-width:980px;margin:24px auto;padding:0 16px}
h1{font-size:20px;margin:0 0 12px}
.note{color:#64748b;margin:6px 0 16px}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.05)}
th{background:#f1f5f9;text-align:left;font-weight:600;color:#334155;padding:10px}
td{color:#1f2937}
a{color:#0ea5e9;text-decoration:none}
a:hover{text-decoration:underline}
</style></head>
<body><div class="wrap">
  <h1>Walk App 投稿一覧</h1>
  <div class="note">最新が上。詳細は <code>/view/:id</code>、JSONは <code>/api/maps/:id</code>。</div>
  <table>
    <thead><tr><th>ID</th><th>タイトル</th><th>コメント（一部）</th><th>作成日時</th><th>サムネ</th><th>リンク</th></tr></thead>
    <tbody>${body || '<tr><td colspan="6" style="padding:16px">まだ投稿がありません</td></tr>'}</tbody>
  </table>
</div></body></html>`;
    res.set('content-type', 'text/html; charset=utf-8').send(html);
  } catch (e) {
    console.error(e);
    res.status(500).send('server error');
  }
});

// 詳細ページ
app.get('/view/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).send('bad id');
  try {
    const [[map]] = await pool.query(`SELECT * FROM maps WHERE id = ?`, [id]);
    if (!map) return res.status(404).send('Not found');

    const [photos] = await pool.query(`SELECT * FROM photos WHERE map_id = ? ORDER BY id`, [id]);
    const [comments] = await pool.query(`SELECT * FROM comments WHERE map_id = ? ORDER BY id`, [id]);

    const imgs = photos
      .map(
        u =>
          `<img src="${u.photo_url}" style="width:200px;height:150px;object-fit:cover;border:1px solid #ddd;border-radius:10px;margin:6px">`
      )
      .join('');

    const com = comments
      .map(c => `<li>${escapeHtml(c.text || '')} <span style="color:#94a3b8">(${c.created_at})</span></li>`)
      .join('');

    const pathLen = Array.isArray(map.path_data) ? map.path_data.length : 0;

    const html = `<!doctype html>
<html lang="ja"><head><meta charset="utf-8">
<title>投稿 #${map.id}</title>
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans JP",sans-serif;background:#f8fafc;margin:0}
.wrap{max-width:860px;margin:24px auto;padding:0 16px}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;box-shadow:0 8px 24px rgba(0,0,0,.05)}
.kv{display:grid;grid-template-columns:140px 1fr;gap:8px;row-gap:12px}
.kv b{color:#334155}
.imgs{margin:10px -6px}
a{color:#0ea5e9;text-decoration:none}
a:hover{text-decoration:underline}
</style></head>
<body><div class="wrap">
  <p><a href="/">← 一覧に戻る</a></p>
  <div class="card">
    <h2 style="margin:0 0 12px">投稿 #${map.id}</h2>
    <div class="kv">
      <b>タイトル</b><div>${escapeHtml(map.title || '')}</div>
      <b>コメント</b><div>${escapeHtml(map.comment || '')}</div>
      <b>作成日時</b><div>${map.created_at ?? ''}</div>
      <b>経路ポイント</b><div>${pathLen} 点</div>
      <b>APIリンク</b><div><a href="/api/maps/${map.id}">/api/maps/${map.id}</a></div>
    </div>
    <div class="imgs">${imgs || '<div>画像なし</div>'}</div>
    <div style="margin-top:12px">
      <b>コメント一覧</b>
      <ul>${com || '<li>なし</li>'}</ul>
    </div>
  </div>
</div></body></html>`;
    res.set('content-type', 'text/html; charset=utf-8').send(html);
  } catch (e) {
    console.error(e);
    res.status(500).send('server error');
  }
});

// ====================================================================
// API（JSON）
// ====================================================================

// POST /api/maps ・・・ 投稿（認証必要）
app.post('/api/maps', upload.array('photos', 10), async (req, res) => {
  try {
    // 認証（Authorization: Bearer <token>）
    const auth = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (AUTH_TOKEN && auth !== AUTH_TOKEN) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const { user_id, title, comment, duration, path_data } = req.body;
    if (!title) return res.status(400).json({ error: 'title_required' });
    if (!path_data) return res.status(400).json({ error: 'path_required' });

    let pathJson;
    try {
      pathJson = JSON.parse(path_data);
    } catch {
      return res.status(400).json({ error: 'invalid_path_json' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [r] = await conn.execute(
        `INSERT INTO maps (user_id, title, comment, path_data, duration)
         VALUES (?, ?, ?, CAST(? AS JSON), ?)`,
        [user_id || null, title, comment || null, JSON.stringify(pathJson), duration ? Number(duration) : null]
      );
      const map_id = r.insertId;

      // photos
      const files = req.files || [];
      for (const f of files) {
        const rel = '/uploads/' + path.basename(path.dirname(f.path)) + '/' + path.basename(f.path);
        await conn.execute(`INSERT INTO photos (map_id, photo_url) VALUES (?, ?)`, [map_id, rel]);
      }

      // comments: 画面の単一コメントも履歴に1件として保存
      if (comment && comment.trim()) {
        await conn.execute(`INSERT INTO comments (map_id, text) VALUES (?, ?)`, [map_id, comment.trim()]);
      }

      await conn.commit();
      res.json({ status: 'success', map_id });
    } catch (e) {
      await conn.rollback();
      console.error(e);
      res.status(500).json({ error: 'server_error' });
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// GET /api/maps/:id ・・・ JSONで詳細（公開にしておく）
app.get('/api/maps/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'bad_id' });
  try {
    const conn = await pool.getConnection();
    try {
      const [[map]] = await conn.query(`SELECT * FROM maps WHERE id = ?`, [id]);
      if (!map) return res.status(404).json({ error: 'not_found' });
      const [photos] = await conn.query(`SELECT * FROM photos WHERE map_id = ? ORDER BY id`, [id]);
      const [comments] = await conn.query(`SELECT * FROM comments WHERE map_id = ? ORDER BY id`, [id]);
      res.json({ map, photos, comments });
    } finally {
      conn.release();
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// （任意）一覧APIが必要ならコメントアウト解除
// app.get('/api/maps', async (req, res) => {
//   const [rows] = await pool.query(`SELECT id, title, comment, created_at FROM maps ORDER BY id DESC LIMIT 200`);
//   res.json({ maps: rows });
// });

// --- Boot ---
app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
