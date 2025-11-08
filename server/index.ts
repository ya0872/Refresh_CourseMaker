import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/api/check', (req, res) => {
    console.log('receive data from frontend');
    res.json({success: true, message: 'Data received successfully'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});