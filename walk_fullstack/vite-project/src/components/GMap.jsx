import React, { useEffect, useRef } from 'react';
export default function GMap({ center = { lat: 35.681236, lng: 139.767125 }, zoom = 15, path = [], onAddPoint, onDistance }){
  const mapEl = useRef(null); const mapRef = useRef(null); const polyRef = useRef(null);
  useEffect(()=>{
    if(!window.google?.maps) return;
    const google = window.google;
    const map = new google.maps.Map(mapEl.current,{ center, zoom, mapTypeControl:false, streetViewControl:false, fullscreenControl:false });
    const poly = new google.maps.Polyline({ path, map, strokeColor:'#1976d2', strokeWeight:4 });
    map.addListener('click', (e)=> onAddPoint?.({ lat:e.latLng.lat(), lng:e.latLng.lng() }));
    mapRef.current = map; polyRef.current = poly;
  },[]);
  useEffect(()=>{
    if(!polyRef.current || !window.google?.maps) return;
    const google = window.google;
    polyRef.current.setPath(path);
    if(onDistance && path.length>1 && google.maps.geometry){
      const m = google.maps.geometry.spherical.computeLength(polyRef.current.getPath());
      onDistance(Math.round(m));
    }
    if(mapRef.current && path.length>1){
      const b = new google.maps.LatLngBounds(); path.forEach(p=>b.extend(p)); mapRef.current.fitBounds(b,48);
    }
  },[path,onDistance]);
  return <div ref={mapEl} style={{ width:'100%', height:360, borderRadius:12, overflow:'hidden' }} />;
}
