const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5174';

export async function uploadDraft(draft, { token='devtoken', user_id=1 } = {}){
  // 画像以外のフィールド
  const fd = new FormData();
  fd.append('user_id', String(user_id));
  fd.append('title', draft.title || '');
  fd.append('comment', draft.comment || '');
  // path はそのまま送る（lat/lng モード or x/y モードを許容）
  fd.append('path_data', JSON.stringify(draft.path || []));
  if (draft.duration != null) fd.append('duration', String(draft.duration));

  // 画像
  (draft.images || []).forEach((img, i) => {
    if (img?.file) fd.append('photos', img.file, img.file.name || `photo-${i}.jpg`);
  });

  const res = await fetch(`${API_BASE}/api/maps`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`upload failed: ${res.status}`);
  return res.json();
}
