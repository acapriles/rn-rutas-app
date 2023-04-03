import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import { StackNavigator } from './src/navigator/Navigator';
import { PermissionsProvider } from './src/context/PermissionsContext';


const AppState = ( { children }: { children: JSX.Element | JSX.Element[] } ) => {
	return (
		<PermissionsProvider>
			{ children }
		</PermissionsProvider>
	)
}

const App = () => {
	return (
		<NavigationContainer>
			<AppState>
				<StackNavigator />
			</AppState>
		</NavigationContainer>
	)
}

export default App;