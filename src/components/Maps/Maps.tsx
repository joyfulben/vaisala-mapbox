import './maps.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Maps(props: any) {
    
    function setViewport(location: any) {
        props.setViewport({
            latitude: location.lat,
            longitude: location.lon,
            zoom: 10
        })
    }
    function setTemp(location: any) {
        props.setTemp({
            temp: location.temp
        })
    }
    return (
        <div>
            <div className='maps-btn-container'>
                <Stack direction="row" spacing={2}>

                { props.json.map((location:any, key: number) => {
                    return <Button key={key} variant="text" size="small" onClick={() => {setViewport(location); setTemp(location)}}>{location.city}</Button> 
                })}
                </Stack>
                
            </div>
        </div>
    )
}