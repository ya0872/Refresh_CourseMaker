import React from 'react';

export default function AppHeader(){
  return (
    <header className="appbar">
      <div className="appbar-inner">
        <div className="brand">
          <span className="brand-badge">🌸</span>
          <span className="brand-title">さんぽマップ</span>
        </div>
        <span className="badge" style={{marginLeft:'auto'}}>beta</span>
      </div>
    </header>
  );
}
