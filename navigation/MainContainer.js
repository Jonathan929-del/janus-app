// Imports
import MenuScreen from './screens/MenuScreen';
import MapViewScreen from './screens/MapViewScreen';
import PropertiesScreen from './screens/PropertiesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


// Main Function
function MainContainer() {

  const mapViewName = 'Map View';
  const menuName = "Menu";
  const propertiesName = "Properties";
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
          initialRouteName={menuName}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color}) => {
              let iconName;
              let rn = route.name;
              switch (rn) {
                case menuName:
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case mapViewName:
                  iconName = focused ? 'map' : 'map-outline';
                  break;
                case propertiesName:
                  iconName = focused ? 'list' : 'list-outline';
                  break;
              }
              return <Ionicons name={iconName} size={30} color={color}/>;
              },
          })}
        >
          <Tab.Screen name={mapViewName} component={MapViewScreen} />
          <Tab.Screen name={menuName} component={MenuScreen} />
          <Tab.Screen name={propertiesName} component={PropertiesScreen} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}


// Export
export default MainContainer;