import { useEffect, useRef, useState } from "react";
import Geolocation from "@react-native-community/geolocation";

import { Location } from "../interfaces/appInterfaces";


export const useLocation = () => {

    const [ hasLocation, setHasLocation ] = useState( false );

    const [ routeLines, setRouteLines ] = useState<Location[]>([]);

    const [ initialPosition, setInitialPosition ] = useState<Location>({
        latitude: 0,
        longitude: 0,
    });

    const [ userLocation, setUserLocation ] = useState<Location>({
        latitude: 0,
        longitude: 0,
    });

    const watchId = useRef<number>();
    const isMounted = useRef<boolean>( true );

    useEffect(() => {
        isMounted.current = true;
        
        return () => {
            isMounted.current = false;
        }
    }, [])
    

    useEffect(() => {

        getCurrentLocation()
            .then( ( location ) => {

                if ( !isMounted.current ) return;

                setInitialPosition( location );
                setUserLocation( location );
                // setRouteLines([ ...routeLines, location ]);
                setRouteLines( ( routes ) => [ ...routes, location ]);
                setHasLocation( true );
            })
            .catch( ( error ) => console.log({ error }) );

        /* Geolocation.getCurrentPosition(
            ({ coords, timestamp }) => {
                setInitialPosition({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });

                setHasLocation( true );
            },
            ( error ) => console.log({ error }),
            {
                enableHighAccuracy: true, //? GPS
            }
        ); */
    }, []);


    //? Get User current position 
    const getCurrentLocation = (): Promise<Location> => {
        return new Promise( ( resolve, reject ) => {

            Geolocation.getCurrentPosition(
                ({ coords, timestamp }) => {
                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    });
    
                },
                ( error ) => reject({ error }), { enableHighAccuracy: true } //? GPS
            );

        });
    }


    //? Constantly updates the user's coordinates
    const followUserLocation = async () => {
        watchId.current = Geolocation.watchPosition (
            ({ coords, timestamp }) => {
                // console.log({ coords });


                const location: Location = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }
                
                if ( !isMounted.current ) return;
                
                setUserLocation( location );

                // setRouteLines([ ...routeLines, location ]);
                setRouteLines( ( routes ) => [ ...routes, location ]);
            },
            ( error ) => console.log({ error }), 
            { enableHighAccuracy: true, distanceFilter: 10 } //? GPS
        );
    }


    //? Stop Geolocation.watchPosition
    const stopFollowUserLocation = () => {
        if ( watchId.current ) {
            Geolocation.clearWatch( watchId.current );
        }
    }

    return {
        // Properties
        hasLocation,
        initialPosition,
        userLocation,
        routeLines,

        // Methods
        getCurrentLocation,
        followUserLocation,
        stopFollowUserLocation
    }
}
