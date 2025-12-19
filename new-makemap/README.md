# Walk App Fullstack (Vite + Express + MySQL)

## ディレクトリ
- `vite-project/` … React (Vite) フロント
- `server/`       … Express API + MySQL + 画像アップロード（multer）

---

## 起動手順（Ubuntu）

### 1) DB準備（MySQL）
```bash
# 既にDB/ユーザーがあればスキップ可
# root のパスワードログインが通る環境ならこの1行でOK
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS walkapp DEFAULT CHARACTER SET utf8mb4;"

# Ubuntu で root のパスワードログインが通らない場合（auth_socket など）はこちら：
sudo mysql <<'SQL'
CREATE DATABASE IF NOT EXISTS walkapp
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'walkapp'@'localhost' IDENTIFIED BY 'walkpass';
GRANT ALL PRIVILEGES ON walkapp.* TO 'walkapp'@'localhost';
FLUSH PRIVILEGES;
SQL
```

### 2) サーバ起動
```bash
cd server
cp .env.example .env   # 値を自分の環境に合わせて編集
# 例:
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_USER=walkapp
# DB_PASSWORD=walkpass
# DB_NAME=walkapp
# AUTH_TOKEN=devtoken
# PORT=5174
# CORS_ORIGIN=http://localhost:5173

npm install
npm run init:db        # スキーマ作成（IF NOT EXISTS なので再実行OK）
npm run dev            # 5174番で起動

```

### 3) フロント起動
```bash
cd ../vite-project
npm install
# 必要に応じて API 設定（無ければ作成）
printf "VITE_API_BASE=http://localhost:5174\nVITE_AUTH=devtoken\n" > .env.local
npm run dev            # 5173番で起動（APIは http://localhost:5174）

```

## 送信データ
- `POST /api/maps` (multipart/form-data)
  - fields: `user_id` (任意), `title`, `comment`, `duration` (任意), `path_data` (JSON文字列)
  - files: `photos[]`
- 保存先: `maps`, `photos`, `comments` テーブル。画像は `server/uploads/yyyy-mm-dd/` に保存。
