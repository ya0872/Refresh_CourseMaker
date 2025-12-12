import { useState } from "react";
import './reward_coupon.css';

export default function Admin() {
  const [rewardList, setRewardList] = useState([
    { id: 1, title: "1000歩達成！", point: 10 },
    { id: 2, title: "コースクリア", point: 15 },
  ]);

  const [title, setTitle] = useState("");
  const [point, setPoint] = useState("");

  const addReward = () => {
    if (!title || !point) return;

    setRewardList([
      ...rewardList,
      { id: Date.now(), title, point: Number(point) }
    ]);

    setTitle("");
    setPoint("");
  };

  const deleteReward = (id: number) => {
    setRewardList(rewardList.filter(r => r.id !== id));
  };

  return (
    <div className="container">
      <h1>管理者ページ</h1>

      <input
        placeholder="リワード名"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="ポイント"
        value={point}
        onChange={(e) => setPoint(e.target.value)}
        type="number"
      />

      <button onClick={addReward}>追加</button>

      <h3>リワード一覧</h3>
      <ul>
        {rewardList.map(r => (
          <li key={r.id}>
            {r.title}（{r.point}pt）
            <button onClick={() => deleteReward(r.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
