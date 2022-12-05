import React, { useState } from 'react';
import ReactMapGl, { Marker } from "react-map-gl";
import mapboxgl from 'mapbox-gl';
import './App.css';
import Maps from './components/Maps/Maps';
import Switch from '@mui/material/Switch';

mapboxgl.accessToken = process.env.REACT_APP_VAISALA_MAP_TOKEN || "";


interface Viewport {
  latitude: number,
  longitude: number,
  zoom: number
}

interface Location {
  city: string,
  lat: number,
  lon: number,
  temp: number
}

interface Locations extends Array<Location>{};

export default function App() {
  const [viewport, setViewport] = useState<Viewport>({
    latitude: 39.961944,
    longitude: -105.510556,
    zoom: 10
  })

  
  const [jSONFile, setJSONFile]= useState<Locations>([]);
  const [currentTemp, setTemp] = useState({temp: 0});
  const [celsius, setCelsius] = useState(true);
  
  // Function to read the JSON from a file - returns a promise containing the parsed JSON
  async function readJSONFile(file: any) {
    // Function will return a new Promise which will resolve or reject based on whether the JSON file is read and parsed successfully
    return new Promise((resolve, reject) => {
        // Define a FileReader Object to read the file
        let fileReader = new FileReader();
        // Specify what the FileReader should do on the successful read of a file
        fileReader.onload = event => {

            // If successfully read, resolve the Promise with JSON parsed contents of the file
          if (event && event.target && event.target.result) {resolve(JSON.parse(JSON.stringify(event.target.result)))}
        };
        // If the file is not successfully read, reject with the error
        fileReader.onerror = error => reject(error);
        // Read from the file, which will kick-off the onload or onerror events defined above based on the outcome
        fileReader.readAsText(file);
    });
}

function updateLocations(locationArr: Array<any>){
  locationArr.map(loc => {
    let location: Location = {
      city: loc.city,
      lat: loc.lat,
      lon: loc.lon,
      temp: loc.temp
    }
    setJSONFile((prevState) => [...prevState, location]);
    
  })
}
let maps: any;
if (!jSONFile.length){ 
  maps = <h2>There is no data to display</h2>;
} else {
  maps = <Maps celsius={celsius} setCelsius={setCelsius} setTemp={setTemp} setViewport={setViewport} json={jSONFile}/>
}

const handleUploadFile = (e: any) => {  

  readJSONFile(e.target.files[0])
  .then((json: any) => {let parsedJSON = JSON.parse(json); updateLocations(parsedJSON);})
}

function convertTemp (t: number) {
  const num = ((t*(9/5))+32);
  return Math.round(num);
}

let temp: any;
if (celsius) {
  temp = <h3>{currentTemp.temp}&#8451;</h3>
} else {
  temp = <h3>{convertTemp(currentTemp.temp)}&#8457;</h3>
}
let marker;
if (jSONFile.length) {
  marker = <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
    <div className='marker-container'>
      <img className='map-marker' src="assets/marker.png" alt="map marker" />
      {temp}
    </div>
  </Marker>
}
  return (
    <div className="App">
      <div className='side-menu'>

       <img className='logo' src="/vaisala_logo.png" alt="" />
        <input type="file" onChange={handleUploadFile} />
        <div className='temp-switch'>
          <h3>&#8451;</h3>
          <Switch
            onChange={() => setCelsius(!celsius)}
          />
          <h3>&#8457;</h3>
        </div>
      </div>
      {maps}
      <ReactMapGl 
      style={{height: "50vh", width: "50vw"}}
        {...viewport}
        mapboxAccessToken={process.env.REACT_APP_VAISALA_MAP_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        >
          {marker}
      </ReactMapGl>
      
    </div>
  );

}
