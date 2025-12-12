import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let storedData: { email: string; password: string }[] = [];

app.post('/api/check', (req, res) => {
    console.log('receive data from frontend');
    res.json({success: true, message: 'Data received successfully'});
});

app.post('/api/data', (req, res) => {
    // ① フロントエンドから送られてくるキー名に合わせて受け取る
    const { email, password } = req.body;

    // ② emailとpasswordの両方があるかチェック
    if (email && password) {
        // 保存するデータをまとめる
        const newData = { email, password };
        
        storedData.push(newData);
        console.log(`データを保存しました:`, storedData); // 配列の中身を見るならテンプレートリテラルよりカンマ区切りが見やすいです
        
        // ③ レスポンスは1回だけ！
        res.status(200).json({ success: true, message: '保存完了' });
    } else {
        res.status(400).json({ success: false, message: 'データが足りません' });
    }
});

app.get('/api/data', (req, res) => {
    // 保存されたデータを返す
    res.json({ 
        success: true, 
        data: storedData 
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});