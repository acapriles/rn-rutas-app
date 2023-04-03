import { createContext, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { PERMISSIONS, PermissionStatus, check, openSettings, request } from "react-native-permissions";


export interface PermissionsState {
    locationStatus: PermissionStatus;
    // cameraStatus: PermissionStatus;
}

export const permissionInitState: PermissionsState = {
    locationStatus: 'unavailable',
}

type PermissionsContextProps = {
    permissions: PermissionsState;
    askLocationPermission: () => void;
    checkLocationPermission: () => void;
}

export const PermissionsContext = createContext({} as PermissionsContextProps);

export const PermissionsProvider = ( { children }: { children: JSX.Element | JSX.Element[] } ) => {

    const [permissions, setPermissions] = useState( permissionInitState );

    useEffect(() => {

        checkLocationPermission();
        
        AppState.addEventListener('change', state => {
            
            if( state !== 'active' ) return;

            checkLocationPermission();
        });

    }, []);

    // const askCameraPermission = () => { /* Function's Body */ }
    // const checkCameraPermission = () => { /* Function's Body */ }

    const askLocationPermission = async () => {
        let permissionStatus: PermissionStatus;

        switch ( Platform.OS ) {
            case 'ios':
                permissionStatus = await request( PERMISSIONS.IOS.LOCATION_WHEN_IN_USE );
                break;

            case 'android':
                permissionStatus = await request( PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION );
                break;
        
            default:
                permissionStatus = 'unavailable';
                break;
        }

        if ( permissionStatus === 'blocked' ) await openSettings();

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus
        });
    }

    const checkLocationPermission = async () => {
        let permissionStatus: PermissionStatus;

        switch ( Platform.OS ) {
            case 'ios':
                permissionStatus = await check( PERMISSIONS.IOS.LOCATION_WHEN_IN_USE );
                break;

            case 'android':
                permissionStatus = await check( PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION );
                break;
        
            default:
                permissionStatus = 'unavailable';
                break;
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus
        });
    }

    return (
        <PermissionsContext.Provider value={{
            permissions,
            askLocationPermission,
            checkLocationPermission,
            // askCameraPermission,
            // checkCameraPermission,
        }}>
            { children }
        </PermissionsContext.Provider>
    )
}
