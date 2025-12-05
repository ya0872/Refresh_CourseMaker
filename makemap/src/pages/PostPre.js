import React from 'react';

export default function PostPre({ draft, setDraft, onBack, onPost }) {
  return (
    <section className="card">
      <h2>投稿前画面</h2>
      <div>
        <label>タイトル</label>
        <input className="input" value={draft.title}
          onChange={(e)=>setDraft(d=>({ ...d, title:e.target.value }))}/>
      </div>
      <div style={{marginTop:8}}>
        <label>コメント</label>
        <textarea className="textarea" rows={3} value={draft.comment}
          onChange={(e)=>setDraft(d=>({ ...d, comment:e.target.value }))}/>
      </div>
      <div style={{marginTop:8}}>
        <label>写真プレビュー</label>
        <div className="preview">
          {draft.images.map((img,i)=>(<img key={i} src={img.url||img} alt="preview" />))}
        </div>
      </div>
      <div className="row" style={{marginTop:16}}>
        <button className="btn" onClick={onBack}>戻る（歩行モード）</button>
        <button className="btn primary" onClick={onPost}>投稿</button>
      </div>
    </section>
  );
}
