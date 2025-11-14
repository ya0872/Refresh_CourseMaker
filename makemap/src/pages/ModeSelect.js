import React from 'react';
export default function ModeSelect({ onUI, onWalk }){
  return (<section className="card">
    <h2>モード選択画面</h2>
    <div className="row">
      <button className="btn" onClick={onUI}>UI操作で作成</button>
      <button className="btn" onClick={onWalk}>歩行モードで作成</button>
    </div>
  </section>);
}
