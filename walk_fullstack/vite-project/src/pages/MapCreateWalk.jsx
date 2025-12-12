import React, { useState, useEffect, useRef } from 'react';
export default function MapCreateWalk({ draft, setDraft, onBack, onFinish }){
  const [tracking, setTracking] = useState(false);
  const watchIdRef = useRef(null);

  useEffect(()=>()=>{ if(watchIdRef.current!=null) navigator.geolocation.clearWatch(watchIdRef.current); },[]);

  const start = () => {
    if (!navigator.geolocation) return alert('Geolocation未対応');
    setTracking(true);
    const id = navigator.geolocation.watchPosition((pos)=>{
      const { latitude, longitude, accuracy } = pos.coords;
      if (accuracy && accuracy > 60) return; // 粗すぎる測位は無視
      setDraft(d=>({ ...d, path:[...d.path, { lat: latitude, lng: longitude }] }));
    }, (err)=>{
      console.error(err); alert('位置情報の取得に失敗');
    }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
    watchIdRef.current = id;
  };

  const stop  = () => {
    setTracking(false);
    if (watchIdRef.current!=null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
  };

  const addPhoto = (files) => {
    const arr = Array.from(files||[]);
    const next = arr.map(f=>({ type:'file', file:f, url:URL.createObjectURL(f) }));
    setDraft(d=>({ ...d, images:[...d.images, ...next] }));
  };

  return (<section className="card">
    <h2>マップ作成画面（歩行モード）</h2>
    <div className="hint">現在地追跡フレーム（記録/停止のみ）。測位が荒い場合は自動で間引きます。</div>
    <div className="row" style={{marginTop:12}}>
      <button className="btn" onClick={start} disabled={tracking}>開始</button>
      <button className="btn" onClick={stop}  disabled={!tracking}>停止</button>
      <label style={{marginLeft:'auto'}}>
        撮影（画像追加）
        <input type="file" accept="image/*" multiple onChange={(e)=>addPhoto(e.target.files)} style={{display:'block', marginTop:6}} />
      </label>
    </div>
    <div className="preview">{draft.images.map((img,i)=>(<img key={i} src={img.url||img} alt="preview" />))}</div>
    <div className="row" style={{marginTop:16}}>
      <button className="btn" onClick={onBack}>戻る（モード選択）</button>
      <button className="btn primary" onClick={onFinish}>コース作成終了</button>
    </div>
  </section>);
}
