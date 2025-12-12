import React, { useState } from 'react';
import './App.css';
import AppHeader from './components/AppHeader.jsx';
import ModeSelect from './pages/ModeSelect.jsx';
import MapCreateUI from './pages/MapCreateUI.jsx';
import MapCreateWalk from './pages/MapCreateWalk.jsx';
import PostPre from './pages/PostPre.jsx';
import PostDone from './pages/PostDone.jsx';

const INIT_DRAFT = { path: [], title: '', comment: '', images: [] };

export default function App() {
  const [screen, setScreen] = useState('mode');
  const [draft, setDraft] = useState(INIT_DRAFT);
  const [lastMapId, setLastMapId] = useState(null);

  const go = (to) => setScreen(to);
  const reset = () => {
    setDraft(INIT_DRAFT);
    setLastMapId(null);
    setScreen('mode');
  };

  return (
    <>
      <AppHeader />
      <div className="container">
        {screen === 'mode' && (
          <ModeSelect onUI={() => go('ui')} onWalk={() => go('walk')} />
        )}

        {screen === 'ui' && (
          <MapCreateUI
            draft={draft}
            setDraft={setDraft}
            onBack={() => go('mode')}
            onPostSuccess={(id) => {
              setLastMapId(id);
              go('done');
            }}
            onPostFail={() => alert('投稿に失敗しました')}
          />
        )}

        {screen === 'walk' && (
          <MapCreateWalk
            draft={draft}
            setDraft={setDraft}
            onBack={() => go('mode')}
            onFinish={() => go('pre')}
          />
        )}

        {screen === 'pre' && (
          <PostPre
            draft={draft}
            setDraft={setDraft}
            onBack={() => go('walk')}
            onPostSuccess={(id) => {
              setLastMapId(id);
              go('done');
            }}
            onPostFail={() => alert('投稿に失敗しました')}
          />
        )}

        {screen === 'done' && <PostDone onBack={reset} mapId={lastMapId} />}
      </div>
    </>
  );
}
