import { useState, useEffect } from "react"; 
import './reward_coupon.css';


interface AdminReward {
    id: number | string;
    title: string;
    point: number;
}

const loadRewards = (): AdminReward[] => {
    try {
        const storedRewards = localStorage.getItem("rewards");
        if (storedRewards) {
            
            return JSON.parse(storedRewards);
        }
    } catch (e) {
        console.error("Failed to parse rewards from localStorage", e);
    }
   
    return [
        { id: 1, title: "1000歩達成！", point: 10 },
        { id: 2, title: "5キロ歩いた", point: 15 },
    ];
};

// localStorageにリワードを保存する関数
const saveRewards = (rewards: AdminReward[]) => {
    localStorage.setItem("rewards", JSON.stringify(rewards));
};

export default function Admin() {
  const [rewardList, setRewardList] = useState<AdminReward[]>(loadRewards);
  const [title, setTitle] = useState("");
  const [point, setPoint] = useState("");
  
  // rewardListが変更されるたびにlocalStorageを更新する
  useEffect(() => {
    saveRewards(rewardList);
  }, [rewardList]);


  const addReward = () => {
    if (!title || !point) return alert("リワード名とポイントを入力してください。");

    const newReward: AdminReward = {
      // HTMLファイルに合わせてIDに文字列を含める（衝突防止のため）
      id: "r" + Date.now(), 
      title, 
      point: Number(point)
      // @ts-ignore: doneプロパティを追加 (Homeページとの互換性のため)
      , done: false 
    };

    setRewardList([
      ...rewardList,
      newReward
    ]);

    setTitle("");
    setPoint("");
    alert("リワードを追加しました！");
  };

  const deleteReward = (id: number | string) => {
    const r = rewardList.find(x => x.id === id);
    if (!r) return;
    if (!window.confirm(`「${r.title}」を削除しますか？`)) return;

    setRewardList(rewardList.filter(r => r.id !== id));
  };


  return (
    <div className="container">
      <h1>⚙️ 管理者ページ</h1>
      
      {/* リワード・クーポンページに戻るボタン */}
      <a href="./couponreward" className="button-link" style={{margin: '10px 0', display: 'inline-block'}}>
        🏠 リワード・クーポンページに戻る
      </a>
      
      <div className="section">
        <h2>➕ リワード追加</h2>
        <input
          placeholder="リワード名（例：1000歩歩く）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="ポイント数"
          value={point}
          onChange={(e) => setPoint(e.target.value)}
          type="number"
        />
        <button onClick={addReward}>追加</button>
      </div>
      
      <div className="section">
        <h2>📋 現在のリワード</h2>
        <ul id="reward-list">
          {rewardList.map(r => (
            <li key={r.id}>
              {r.title}（{r.point}pt）
              <button onClick={() => deleteReward(r.id)}>削除</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 🗑 データ管理セクション (全データ初期化) は削除されました。 */}

    </div>
  );
}