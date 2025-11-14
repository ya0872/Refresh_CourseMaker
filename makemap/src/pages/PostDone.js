import React from 'react';
export default function PostDone({ onBack }) {
  return (
    <section className="card">
      <h2>投稿完了画面</h2>
      <p>投稿成功メッセージ：投稿が完了しました！🎉</p>
      <button className="btn" onClick={onBack}>戻る（モード選択）</button>
    </section>
  );
}
