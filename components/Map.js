// Imports
import MapView from 'react-native-maps';
import {View, StyleSheet, Dimensions} from 'react-native';


// Main Function
const Map = () => {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
  )
}


// Styles
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    backgroundColor:'#fff',
    justifyContent:'center'
  },
  map:{
    width:'100%',
    height:'100%',
  }
})


// Export
export default Map;