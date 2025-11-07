<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>ホーム | クーポン・リワードシステム</title>
  <style>
    body { font-family: "Segoe UI", sans-serif; margin: 20px; background: #f6f8fa; }
    section { background: #fff; padding: 15px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    button { margin-left: 5px; }
    li { margin: 5px 0; }
    .done { color: gray; text-decoration: line-through; }
    a.button-link { display: inline-block; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 8px; }
    a.button-link:hover { background: #0056b3; }
  </style>
</head>
<body>
  <h1>🏠 リワード・クーポンページ</h1>
  <a href="admin.html" class="button-link">⚙️ 管理者ページへ</a>

  <!-- 現在のポイント -->
  <section>
    <h2>🎯 あなたのポイント</h2>
    <p id="points">0 pt</p>
  </section>

  <!-- リワード一覧 -->
  <section>
    <h2>🏆 リワード一覧</h2>
    <ul id="reward-section"></ul>
  </section>

  <!-- クーポン一覧 -->
  <section>
    <h2>🎁 クーポン一覧</h2>
    <ul id="coupon-list">
      <li>🎫 10ポイントでドリンク半額クーポン <button onclick="useCoupon(10, this)">使用</button></li>
      <li>🍰 30ポイントでデザート30％割引クーポン <button onclick="useCoupon(30, this)">使用</button></li>
      <li> ♨150ポイントで温泉20％割引クーポン <button onclick="useCoupon(150, this)">使用</button></li>

</ul>
  </section>

  <!-- 使用済みクーポン -->
  <section>
    <h2>🗂 使用済みクーポン</h2>
    <ul id="used-coupons"></ul>
  </section>

  <!-- 履歴 -->
  <section>
    <h2>📜 ポイント履歴</h2>
    <ul id="history-list"></ul>
  </section>

  <script>
    let points = parseInt(localStorage.getItem("points")) || 0;
    let rewards = JSON.parse(localStorage.getItem("rewards")) || [];
    let usedCoupons = JSON.parse(localStorage.getItem("usedCoupons")) || [];
    let history = JSON.parse(localStorage.getItem("history")) || [];

    document.getElementById("points").textContent = points + " pt";

    // リワード一覧を表示
    function renderRewards() {
      const list = document.getElementById("reward-section");
      list.innerHTML = "";
      rewards.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `🏃 ${r.title} (${r.point} pt)`;
        if (r.done) {
          li.classList.add("done");
          li.textContent += " ✅ 達成済";
        } else {
          const btn = document.createElement("button");
          btn.textContent = "達成！";
          btn.onclick = () => completeReward(r.id);
          li.appendChild(btn);
        }
        list.appendChild(li);
      });
    }

    // リワード達成処理
    function completeReward(id) {
      const reward = rewards.find(r => r.id === id);
      if (!reward || reward.done) return alert("すでに達成済みです。");
      reward.done = true;
      points += reward.point;
      history.push(`+${reward.point}pt：${reward.title} を達成 (${new Date().toLocaleString()})`);
      saveAll();
      renderRewards();
      renderUsedCoupons();
      renderHistory();
      document.getElementById("points").textContent = points + " pt";
    }

    // クーポン使用処理
    function useCoupon(cost, button) {
      if (points < cost) return alert("ポイントが足りません！");
      points -= cost;
      const text = button.parentElement.textContent.trim();
      usedCoupons.push(text);
      history.push(`-${cost}pt：クーポン使用 (${new Date().toLocaleString()})`);
      saveAll();
      renderUsedCoupons();
      renderHistory();
      document.getElementById("points").textContent = points + " pt";
    }

    function renderUsedCoupons() {
      const list = document.getElementById("used-coupons");
      list.innerHTML = "";
      usedCoupons.forEach(c => {
        const li = document.createElement("li");
        li.textContent = c;
        list.appendChild(li);
      });
    }

    function renderHistory() {
      const list = document.getElementById("history-list");
      list.innerHTML = "";
      history.slice().reverse().forEach(h => {
        const li = document.createElement("li");
        li.textContent = h;
        list.appendChild(li);
      });
    }

    function saveAll() {
      localStorage.setItem("points", points);
      localStorage.setItem("rewards", JSON.stringify(rewards));
      localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
      localStorage.setItem("history", JSON.stringify(history));
    }

    renderRewards();
    renderUsedCoupons();
    renderHistory();
  </script>
</body>
</html>
