// Imports
import {useEffect} from 'react';
import * as Updates from 'expo-updates';
import Menu from "../../components/Menu";


// Main Function
const MenuScreen = ({navigation}) => {

  const reactToUpdates = async () => {
    Updates.addListener(e => {
      if(e.type === Updates.UpdateEventType.UPDATE_AVAILABLE){
        Updates.reloadAsync();
      }
    });
  };

  useEffect(() => {
    reactToUpdates();
  }, []);

  return (
    <Menu navigation={navigation}/>
  )
}


// Export
export default MenuScreen;