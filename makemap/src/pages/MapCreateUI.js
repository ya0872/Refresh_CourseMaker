import React, { useEffect, useMemo, useState } from 'react';
import GMap from '../components/GMap'; import MapMock from '../components/MapMock';
export default function MapCreateUI({ draft, setDraft, onBack, onPost }){
  const initialHasGoogle = useMemo(()=>!!(window.google && window.google.maps),[]);
  const [hasGoogle, setHasGoogle] = useState(initialHasGoogle);
  useEffect(()=>{ if(hasGoogle) return; const id = setInterval(()=>{ if(window.google?.maps){ setHasGoogle(true); clearInterval(id);} },100); return ()=>clearInterval(id); },[hasGoogle]);
  const [distance, setDistance] = useState(null);
  const addPoint = (p)=> setDraft(d=>({ ...d, path:[...d.path, p] }));
  const undo = ()=> setDraft(d=>({ ...d, path:d.path.slice(0,-1) }));
  const pointCount = hasGoogle ? draft.path.filter(pt=>'lat'in pt&&'lng'in pt).length : draft.path.filter(pt=>'x'in pt&&'y'in pt).length;
  return (<section className="card">
    <h2>マップ作成画面（UI操作）</h2>
    {hasGoogle ? (<>
      <GMap center={{lat:36.5781,lng:136.6480}} zoom={14} path={draft.path.filter(pt=>'lat'in pt&&'lng'in pt)} onAddPoint={addPoint} onDistance={(m)=>setDistance(m)} />
      <div className="hint" style={{marginTop:6}}>クリックでルートを作成。距離（概算）：{distance!=null?`${(distance/1000).toFixed(2)} km`:'—'}</div>
    </>) : (<MapMock path={draft.path.filter(pt=>'x'in pt&&'y'in pt)} onAddPoint={addPoint} />)}
    <div className="row" style={{marginTop:12}}><button className="btn" onClick={undo} disabled={!draft.path.length}>ひとつ戻す</button></div>
    <div style={{marginTop:16}}><label>タイトル</label>
      <input className="input" value={draft.title} onChange={(e)=>setDraft(d=>({...d,title:e.target.value}))} placeholder="例）公園散歩ルート" /></div>
    <div style={{marginTop:8}}><label>コメント</label>
      <textarea className="textarea" rows={3} value={draft.comment} onChange={(e)=>setDraft(d=>({...d,comment:e.target.value}))} placeholder="気づいたことや見どころを書いてね" /></div>
    <div style={{marginTop:8}}><label>写真追加</label><ImagePicker images={draft.images} setImages={(imgs)=>setDraft(d=>({...d,images:imgs}))} /></div>
    <div className="row" style={{marginTop:16}}>
      <button className="btn" onClick={onBack}>戻る（モード選択）</button>
      <button className="btn primary" onClick={onPost} disabled={pointCount<2}>投稿</button>
    </div>
  </section>);
}
function ImagePicker({ images, setImages }){
  const onFiles = (files)=>{ const arr = Array.from(files||[]); const next = arr.map(f=>({ type:'file', file:f, url:URL.createObjectURL(f) })); setImages(prev=>[...prev, ...next]); };
  return (<div>
    <input type="file" accept="image/*" multiple onChange={(e)=>onFiles(e.target.files)} />
    <div className="preview">{images.map((img,i)=>(<img key={i} src={img.url||img} alt="preview" />))}</div>
  </div>);
}
