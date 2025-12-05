import React, { useState } from 'react';
import './App.css';
import ModeSelect from './pages/ModeSelect';
import MapCreateUI from './pages/MapCreateUI';
import MapCreateWalk from './pages/MapCreateWalk';
import PostPre from './pages/PostPre';
import PostDone from './pages/PostDone';

const INIT_DRAFT = { path: [], title: '', comment: '', images: [] };

export default function App() {
  const [screen, setScreen] = useState('mode');
  const [draft, setDraft] = useState(INIT_DRAFT);
  const go = (to) => setScreen(to);
  const reset = () => { setDraft(INIT_DRAFT); setScreen('mode'); };

  return (
    <div className="container">
      {screen === 'mode' && (<ModeSelect onUI={() => go('ui')} onWalk={() => go('walk')} />)}
      {screen === 'ui' && (
        <MapCreateUI draft={draft} setDraft={setDraft} onBack={() => go('mode')} onPost={() => go('done')} />
      )}
      {screen === 'walk' && (
        <MapCreateWalk draft={draft} setDraft={setDraft} onBack={() => go('mode')} onFinish={() => go('pre')} />
      )}
      {screen === 'pre' && (
        <PostPre draft={draft} setDraft={setDraft} onBack={() => go('walk')} onPost={() => go('done')} />
      )}
      {screen === 'done' && (<PostDone onBack={reset} />)}
    </div>
  );
}
