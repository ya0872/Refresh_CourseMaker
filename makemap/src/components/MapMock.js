import React, { useEffect, useRef, useState } from 'react';
export default function MapMock({ path, onAddPoint }){
  const ref = useRef(null); const [, setSize] = useState({w:0,h:0});
  useEffect(()=>{ const el = ref.current; if(!el) return; const ro = new ResizeObserver(()=>setSize({w:el.clientWidth,h:el.clientHeight})); ro.observe(el); return ()=>ro.disconnect(); },[]);
  const click = (e)=>{ const r = e.currentTarget.getBoundingClientRect(); onAddPoint({ x:e.clientX-r.left, y:e.clientY-r.top }); };
  return (<div>
    <div className="hint">※ GoogleMap未読込のため擬似キャンバスで動作中（クリックで線を追加）</div>
    <div ref={ref} onClick={click} className="mock">
      <div className="badge">Google Map フレーム</div>
      <svg width="100%" height="100%" style={{position:'absolute', inset:0}}>
        {path.length>1 && (<polyline fill="none" stroke="#1976d2" strokeWidth={3} points={path.map(p=>`${p.x},${p.y}`).join(' ')} />)}
        {path.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r={4} fill="#0d47a1" />))}
      </svg>
    </div>
    <div className="hint">クリックで頂点を追加 / 「ひとつ戻す」で直前の点を削除</div>
  </div>);
}
