// const getMidPoint = (latlng1: L.LatLng, latlng2: L.LatLng) => {
//    return new L.LatLng(
//       (latlng1.lat + latlng2.lat) / 2,
//       (latlng1.lng + latlng2.lng) / 2
//    );
// }

// {trackings
//          .filter(track =>
//                typeof track.latitude === 'number' &&
//                typeof track.longitude === 'number')
//             .map((track, index) => {
//                if(index === trackings.length - 1) return null;

//                const from = L.latLng(trackings[index].latitude, trackings[index].longitude);
//                const to = L.latLng(trackings[index + 1].latitude, trackings[index + 1].longitude);
//                const distance = from.distanceTo(to); // in meters
//                const midPoint = getMidPoint(from, to);

//                console.log(index);
//                return (
//                   <>
//                      <Marker 
//                      key={track.id} 
//                      position={[track.latitude, track.longitude]}
//                      icon={deviceMarkerIcon}
//                   >
//                      <Popup>
//                         <div className="flex flex-col gap-1">
//                            <h3 className="text-lg font-semibold">
//                               {track.devices.name}
//                            </h3>
//                            <span>
//                               Device Holder: {track.holder_name}
//                            </span>
//                            <span>
//                               Coordinate: {`${track.latitude}, ${track.longitude}`}
//                            </span>
//                            <span>
//                               RSSI: {track.rssi}
//                            </span>
//                            <span>
//                               SNR: {track.snr}
//                            </span>
//                            <span>
//                               Status: {track.is_emergency ? 'Emergency' : 'Normal'}
//                            </span>
//                         </div>
//                      </Popup>
//                   </Marker>

//                   <Polyline
//                      key={`line-${index}`}
//                      positions={[[from.lat, from.lng], [to.lat, to.lng]]}
//                      color="blue"
//                   >
//                      <Tooltip
//                         direction="top"
//                         offset={[0, -10]}
//                         permanent
//                         className="text-xs bg-white p-1 rounded shadow"
//                         position={midPoint}
//                      >
//                         {(distance / 1000).toFixed(2)} km
//                      </Tooltip>
//                   </Polyline>
//                   </>
//                );
//             })}