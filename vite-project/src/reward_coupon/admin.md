<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>管理者ページ | クーポン・リワードシステム</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; margin: 20px; background: #f6f8fa; }
    section { background: #fff; padding: 15px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    button { margin-left: 5px; }
    li { margin: 5px 0; }
    a.button-link { display: inline-block; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 8px; }
    a.button-link:hover { background: #0056b3; }
  </style>
</head>
<body>
  <h1>⚙️ 管理者ページ</h1>
  <a href="index.html" class="button-link">🏠 リワード・クーポンページに戻る</a>

  <section>
    <h2>📋 現在のリワード</h2>
    <ul id="reward-list"></ul>
  </section>

  <section>
    <h2>➕ リワード追加</h2>
    <input type="text" id="reward-title" placeholder="リワード名（例：1000歩歩く）">
    <input type="number" id="reward-point" placeholder="ポイント数">
    <button onclick="addReward()">追加</button>
  </section>

  <section>
    <h2>🗑 データ管理</h2>
    <button onclick="resetData()">全データ初期化</button>
  </section>

  <script>
    let rewards = JSON.parse(localStorage.getItem("rewards")) || [];

    function renderRewards() {
      const list = document.getElementById("reward-list");
      list.innerHTML = "";
      rewards.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.title} (${r.point} pt)`;
        const del = document.createElement("button");
        del.textContent = "削除";
        del.onclick = () => deleteReward(r.id);
        list.appendChild(del);
        list.appendChild(li);
      });
    }

    function addReward() {
      const title = document.getElementById("reward-title").value.trim();
      const point = parseInt(document.getElementById("reward-point").value);
      if (!title || isNaN(point)) return alert("リワード名とポイントを入力してください。");

      const newReward = { id: "r" + Date.now(), title, point, done: false };
      rewards.push(newReward);
      localStorage.setItem("rewards", JSON.stringify(rewards));
      alert("リワードを追加しました！");
      renderRewards();
      document.getElementById("reward-title").value = "";
      document.getElementById("reward-point").value = "";
    }

    function deleteReward(id) {
      const r = rewards.find(x => x.id === id);
      if (!r) return;
      if (!confirm(`「${r.title}」を削除しますか？`)) return;
      rewards = rewards.filter(x => x.id !== id);
      localStorage.setItem("rewards", JSON.stringify(rewards));
      renderRewards();
    }

    function resetData() {
      if (confirm("全データを削除しますか？")) {
        localStorage.clear();
        alert("データを初期化しました。");
        location.reload();
      }
    }

    renderRewards();
  </script>
</body>
</html>
