// import * as React from 'react';
// import * as ol from 'ol';
// import OSM from 'ol/source/OSM';
//
// import MapContext from './context';
// import TileLayer from 'ol/layer/Tile';
//
// export type IMapCenter = {
//     latitude: number;
//     longitude: number;
// };
//
// type IMapProps = {
//     center: IMapCenter;
//     setCenter: (center: IMapCenter) => void;
//     zoom: number;
//     setZoom: (zoom: number) => void;
// };
//
// const Map: React.FC<IMapProps> = props => {
//     const mapRef = React.useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
//     const [map, setMap] = React.useState<ol.Map>();
//
//     React.useEffect(() => {
//         const map = new ol.Map({
//             view: new ol.View({
//                 zoom: props.zoom,
//                 center: [props.center.latitude, props.center.longitude],
//             }),
//             layers: [
//                 new TileLayer({
//                     source: new OSM(),
//                 })
//             ],
//             controls: [],
//             overlays: [],
//         });
//
//         map.setTarget(mapRef.current);
//
//         setMap(map);
//
//         return () => map.setTarget(undefined);
//     }, []);
//
//     React.useEffect(() => {
//         if (!map) return;
//
//         map.getView().setZoom(props.zoom);
//     }, [props.zoom]);
//
//     React.useEffect(() => {
//         if (!map) return;
//
//         const { latitude, longitude } = props.center;
//
//         map.getView().setCenter([latitude, longitude]);
//     }, [props.center]);
//
//     return (
//         <MapContext.Provider value={map as ol.Map}>
//             <div ref={mapRef} />
//         </MapContext.Provider>
//     );
// };
//
// export default Map;
