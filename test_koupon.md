<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>クーポン機能・特典機能テスト</title>
  <style>
    body {
      font-family: "Yu Gothic", sans-serif;
      background-color: #f6fff6;
      text-align: center;
      padding: 30px;
    }
    h1 {
      color: #2d7a2d;
    }
    .coupon {
      border: 2px dashed #65b765;
      border-radius: 10px;
      background: #eaffea;
      margin: 20px auto;
      width: 250px;
      padding: 15px;
    }
    button {
      background: #4caf50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }
    button:disabled {
      background: #bbb;
    }
  </style>
</head>

<body>
  <h1>🎁 クーポン一覧</h1>

  <div class="coupon" id="coupon1">
    <h3>ジュース無料クーポン</h3>
    <p>地元カフェABC</p>
    <button onclick="useCoupon('coupon1')">使う</button>
  </div>

  <div class="coupon" id="coupon2">
    <h3>アイス半額クーポン</h3>
    <p>スイーツショップXYZ</p>
    <button onclick="useCoupon('coupon2')">使う</button>
  </div>

  <script>
    function useCoupon(id) {
      const coupon = document.getElementById(id);
      const button = coupon.querySelector("button");
      button.disabled = true;
      button.innerText = "使用済み";
      coupon.style.backgroundColor = "#ddd";
      alert("クーポンを使用しました！");
    }
  </script>
</body>
</html>
