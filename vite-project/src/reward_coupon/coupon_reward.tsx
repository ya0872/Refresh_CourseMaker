import { useState } from "react";

export default function Home() {
  const [points, setPoints] = useState(() => Number(localStorage.getItem("points") || 0));

  const [rewards, setRewards] = useState([
    { id: 1, title: "1000歩達成！", rewardPoint: 10, cleared: false },
    { id: 2, title: "コースを一つクリア", rewardPoint: 15, cleared: false },
  ]);

  const handleReward = (id: number) => {
    const updated = rewards.map(r =>
      r.id === id ? { ...r, cleared: true } : r
    );

    setRewards(updated);

    const reward = rewards.find(r => r.id === id);
    if (reward && !reward.cleared) {
      const newPoint = points + reward.rewardPoint;
      setPoints(newPoint);
      localStorage.setItem("points", newPoint.toString());
    }
  };

  return (
    <div className="container">
      <h1>ホーム</h1>
      <h2>現在のポイント：{points} pt</h2>

      <h3>リワード一覧</h3>
      {rewards.map(r => (
        <div key={r.id} className="reward-card">
          <div>
            <p>{r.title}</p>
            <p>+{r.rewardPoint}pt</p>
          </div>
          <button
            onClick={() => handleReward(r.id)}
            disabled={r.cleared}
          >
            {r.cleared ? "達成済み" : "達成"}
          </button>
        </div>
      ))}
    </div>
  );
}
