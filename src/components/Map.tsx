import { useRef, useEffect, useState } from 'react';
import MapView, { MapMarkerProps, Marker, Polyline } from "react-native-maps";

import { useLocation } from "../hooks/useLocation";
import { LoadingScreen } from "../screens/LoadingScreen";
import { Fab } from "./Fab";


interface Props {
    markers?: MapMarkerProps[];
}

export const Map = ( { markers }: Props ) => {

    const [ showPolyline, setShowPolyline ] = useState<boolean>(true);

    const {
        hasLocation,
        initialPosition,
        userLocation,
        routeLines,
        getCurrentLocation,
        followUserLocation,
        stopFollowUserLocation
    } = useLocation();
    
    //? Se crea una ref del objeto MapView para poder usar sus prompiedades y métodos de forma dinámica
    const mapViewRef = useRef<MapView>();

    const following = useRef<boolean>( true );


    //? Locates the screen in the user's position
    useEffect(() => {
        followUserLocation();
    
        return () => {
            stopFollowUserLocation();
        }
    }, []);


    //? Makes the camera follow the user in real time (device)
    useEffect(() => {

        if ( !following.current ) return; 

        const { latitude, longitude } = userLocation;

        mapViewRef.current?.animateCamera({
            center: { latitude, longitude }
        });
    }, [ userLocation ]);



    const centerPosition = async () => {

        const { latitude, longitude } = await getCurrentLocation();

        mapViewRef.current?.animateCamera({
            center: { latitude, longitude }
        });

        following.current = true;
    }

    if ( !hasLocation ) {
        return <LoadingScreen />
    }

    console.log(initialPosition);
    
    
    return (
        <>
            <MapView
                ref={ ( element ) => mapViewRef.current = element!}
                // provider={  PROVIDER_GOOGLE }
                style={{ flex: 1 }}
                showsUserLocation
                initialRegion={{
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onTouchStart={ () => following.current = false }
            >
                
                {/* <Marker
                    image={ require('../assets/custom-marker.png') }
                    coordinate={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                    }}
                    title="This is a title"
                    description="This is a description"
                /> */}

                {
                    ( showPolyline ) && (
                        <Polyline 
                            coordinates={ routeLines }
                            strokeColor='black'
                            strokeWidth={ 3 }
                        />
                    )
                }

            </MapView>

            <Fab
                iconName="compass-outline"
                onPress={ centerPosition }
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: 20,
                }}

            />

            <Fab
                iconName="brush-outline"
                onPress={ () => setShowPolyline( !showPolyline ) }
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                }}

            />
        </>
    )
}
