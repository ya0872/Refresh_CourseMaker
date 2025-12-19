import { useState, useEffect, useCallback } from "react";
import './reward_coupon.css'; 

// クーポンと履歴の型定義 (必要に応じて)
interface Reward {
    id: number | string; // Adminページとの互換性のため string | number に変更
    title: string;
    rewardPoint: number;
    cleared: boolean;
}

interface Coupon {
    title: string;
    cost: number;
}

interface HistoryEntry {
    type: 'reward' | 'coupon';
    text: string;
    timestamp: string;
}

const initialCoupons: Coupon[] = [
    { title: "10ポイントでドリンク半額クーポン", cost: 10 },
    { title: "30ポイントでデザート30％割引クーポン", cost: 30 },
    { title: "150ポイントで温泉20％割引クーポン", cost: 150 },
];

// 【修正箇所】localStorageからリワードをロードし、Admin側の構造をHome側に変換する関数
const loadInitialRewards = (): Reward[] => {
    try {
        const storedRewards = localStorage.getItem("rewards");
        if (storedRewards) {
            const adminRewards = JSON.parse(storedRewards);
            return adminRewards.map((r: any) => ({
                id: r.id,
                title: r.title,
                rewardPoint: r.point, // Adminの 'point' を Homeの 'rewardPoint' にマップ
                cleared: r.done || false, // Adminの 'done' を Homeの 'cleared' にマップ
            }));
        }
    } catch (e) {
        console.error("Failed to load or parse rewards from localStorage", e);
    }
    // Fallback: localStorageにデータがない場合の初期値（Adminページで管理されているもの）
    return [
        { id: 1, title: "1000歩達成！", rewardPoint: 10, cleared: false },
        { id: 2, title: "コースを一つクリア", rewardPoint: 15, cleared: false },
    ];
};


export default function CouponReward() {
  // 初期値の取得と状態管理
  const [points, setPoints] = useState(() => Number(localStorage.getItem("points") || 0));

  // 【修正箇所】ハードコードではなく、localStorageからリワードをロードする
  const [rewards, setRewards] = useState<Reward[]>(loadInitialRewards);

  const [usedCoupons, setUsedCoupons] = useState<string[]>(() => {
    const storedUsed = localStorage.getItem("usedCoupons");
    return storedUsed ? JSON.parse(storedUsed) : [];
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const storedHistory = localStorage.getItem("history");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  // ポイント、リワード、クーポン、履歴をローカルストレージに保存する処理
  const saveAll = useCallback((
      newPoints: number,
      newRewards: Reward[],
      newUsedCoupons: string[],
      newHistory: HistoryEntry[]
  ) => {
      localStorage.setItem("points", newPoints.toString());
      
      // 【修正箇所】Home側の構造をAdmin側の構造に戻して保存する
      const adminFormatRewards = newRewards.map(r => ({
          id: r.id,
          title: r.title,
          point: r.rewardPoint, // 'rewardPoint' を 'point' にマップ
          done: r.cleared,      // 'cleared' を 'done' にマップ
      }));
      localStorage.setItem("rewards", JSON.stringify(adminFormatRewards));
      
      localStorage.setItem("usedCoupons", JSON.stringify(newUsedCoupons));
      localStorage.setItem("history", JSON.stringify(newHistory));
  }, []);

  // ポイント・リワードの状態が変更されたらローカルストレージを更新
  useEffect(() => {
    saveAll(points, rewards, usedCoupons, history);
  }, [points, rewards, usedCoupons, history, saveAll]);


  // リワード達成処理
  const handleReward = (id: number | string) => { // 【修正箇所】idの型を Admin 互換に
    const rewardToClear = rewards.find(r => r.id === id);
    if (!rewardToClear || rewardToClear.cleared) return; 

    const newRewards = rewards.map(r =>
      r.id === id ? { ...r, cleared: true } : r
    );

    const newPoint = points + rewardToClear.rewardPoint;

    // 履歴の追加
    const newHistoryEntry: HistoryEntry = {
        type: 'reward',
        text: `+${rewardToClear.rewardPoint}pt：${rewardToClear.title} を達成`,
        timestamp: new Date().toLocaleString()
    };
    const newHistory = [...history, newHistoryEntry];

    // 状態を更新
    setRewards(newRewards);
    setPoints(newPoint);
    setHistory(newHistory);
  };

  // クーポン使用処理
  const handleUseCoupon = (cost: number, couponTitle: string) => {
    if (points < cost) {
      alert("ポイントが足りません！");
      return;
    }

    const newPoint = points - cost;
    const newUsedCoupons = [...usedCoupons, couponTitle];

    // 履歴の追加
    const newHistoryEntry: HistoryEntry = {
        type: 'coupon',
        text: `-${cost}pt：クーポン使用 (${couponTitle})`,
        timestamp: new Date().toLocaleString()
    };
    const newHistory = [...history, newHistoryEntry];

    // 状態を更新
    setPoints(newPoint);
    setUsedCoupons(newUsedCoupons);
    setHistory(newHistory);
  };


  return (
    <div className="container">
      <h1>🏠 ホーム</h1>
      <a href="admin.html" className="button-link" style={{margin: '10px 0', display: 'inline-block'}}>⚙️ 管理者ページへ</a>


      {/* 現在のポイント */}
      <div className="section">
        <h2>🎯 あなたのポイント</h2>
        <p id="points">{points} pt</p>
      </div>

      {/* リワード一覧 */}
      <div className="section">
        <h2>🏆 リワード一覧</h2>
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
      
      {/* クーポン一覧 */}
      <div className="section">
        <h2>🎁 クーポン一覧</h2>
        <ul id="coupon-list">
            {initialCoupons.map((coupon, index) => (
                <li key={index} className="coupon-item">
                    <span>{coupon.title}</span>
                    <button onClick={() => handleUseCoupon(coupon.cost, coupon.title)}>使用 ({coupon.cost} pt)</button>
                </li>
            ))}
        </ul>
      </div>

      {/* 使用済みクーポン */}
      <div className="section">
        <h2>🗂 使用済みクーポン</h2>
        <ul id="used-coupons">
            {usedCoupons.length === 0 ? (
                <li>使用済みのクーポンはありません。</li>
            ) : (
                usedCoupons.map((coupon, index) => (
                    <li key={index} className="used-coupon-item">✅ {coupon}</li>
                ))
            )}
        </ul>
      </div>

      {/* 履歴 */}
      <div className="section">
        <h2>📜 ポイント履歴</h2>
        <ul id="history-list">
          {/* 最新の履歴を上に表示するため反転 */}
          {history.slice().reverse().map((entry, index) => (
            <li key={index} className="history-item">
              {entry.type === 'reward' ? '🏆 ' : '🎁 '}
              {entry.text} ({entry.timestamp})
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}