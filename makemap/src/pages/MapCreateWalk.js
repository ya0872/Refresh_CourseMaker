import React, { useState } from 'react';

export default function MapCreateWalk({ draft, setDraft, onBack, onFinish }) {
  const [tracking, setTracking] = useState(false);
  const start = () => setTracking(true);
  const stop  = () => setTracking(false);

  const addPhoto = (files) => {
    const arr = Array.from(files || []);
    const next = arr.map(f => ({ type:'file', file:f, url:URL.createObjectURL(f) }));
    setDraft(d => ({ ...d, images: [...d.images, ...next] }));
  };

  return (
    <section className="card">
      <h2>マップ作成画面（歩行モード）</h2>
      <div className="hint">※ 現在地追跡はフレームのみ（測位・ルート記録は未実装）</div>
      <div className="walk">
        <div className="badge">現在地追跡フレーム</div>
        <div className="statechip">状態: {tracking ? '記録中' : '停止中'}</div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn" onClick={start} disabled={tracking}>開始</button>
        <button className="btn" onClick={stop}  disabled={!tracking}>停止</button>
        <label style={{ marginLeft: 'auto' }}>
          撮影（画像追加）
          <input type="file" accept="image/*" multiple
            onChange={(e) => addPhoto(e.target.files)} style={{ display: 'block', marginTop: 6 }} />
        </label>
      </div>
      <div className="preview">
        {draft.images.map((img, i) => (<img key={i} src={img.url || img} alt="preview" />))}
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn" onClick={onBack}>戻る（モード選択）</button>
        <button className="btn primary" onClick={onFinish}>コース作成終了</button>
      </div>
    </section>
  );
}
