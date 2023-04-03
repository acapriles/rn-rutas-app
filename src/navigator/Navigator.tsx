import { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { PermissionsContext } from '../context/PermissionsContext';
import { MapScreen } from '../screens/MapScreen';
import { PermissionsScreen } from '../screens/PermissionsScreen';
import { LoadingScreen } from '../screens/LoadingScreen';

const Stack = createStackNavigator();

export const StackNavigator = () => {

    const { permissions } = useContext( PermissionsContext );

    if ( permissions.locationStatus === 'unavailable' ) {
        return <LoadingScreen />
    }

    console.log(permissions.locationStatus);
    

    return (
        <Stack.Navigator
            // initialRouteName='PermissionsScreen'
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            {
                ( permissions.locationStatus !== 'granted' )
                ? <Stack.Screen name="PermissionsScreen" component={ PermissionsScreen } />
                : <Stack.Screen name="MapScreen" component={ MapScreen } />
            }
        </Stack.Navigator>
    );
}