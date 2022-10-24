// Imports
import axios from 'axios';
import Buildings from './Buildings';
import {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {View, StyleSheet, Pressable, Text} from 'react-native';


// Main Function
const Map = () => {
  
  
  // Fetching properties
  const [properties, setProperties] = useState([{}]);
  const [selectedProperty, setSelectedProperty] = useState({property_code:'1001', name:'BYGGMÄSTAREN'});
  useEffect(() => {
    const propertiesFetcher = async () => {
      try {
        const res = await axios.get('https://janus-server-side.herokuapp.com/properties');
        setProperties(res.data.filter(property => property?.latitude !== ''));
      } catch (err) {
        console.log(err);
      }
    };
    propertiesFetcher();
  }, [properties]);


  // Property fetching
  const propertyFetcher = async latitude => {
    try {
      const res = await axios.get(`https://janus-server-side.herokuapp.com/properties/${latitude}`);
      setSelectedProperty(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  // Buildings opener
  const [isBuildingsOpened, setIsBuildingsOpened] = useState(false);
  const [propertyCode, setPropertyCode] = useState('');
  const buildingsOpener = text => {
    setPropertyCode(text);
    setIsBuildingsOpened(true);
  }


  return (
    <View style={styles.container}>
      <Buildings 
        isBuildingsOpened={isBuildingsOpened}
        setIsBuildingsOpened={setIsBuildingsOpened}
        propertyCode={propertyCode}
      />
      <MapView style={styles.map}
        initialRegion={{
          latitude:67.8601759249178,
          longitude:20.226174445382792,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.01,
        }}
      >
        {properties[0]?.property_code && properties.map(property => (
            <Marker 
              key={Math.floor(Math.random() * 1000000)}
              coordinate={{
                latitude:property?.latitude ? JSON.parse(property?.latitude) : 0,
                longitude:property?.latitude ? JSON.parse(property?.longitude) : 0
              }}
              onPress={() => propertyFetcher(property.latitude)}
            />
          ))}
      </MapView>
      <Pressable style={styles.itemContainer} onPress={() => buildingsOpener(selectedProperty.property_code)}>
          <View style={styles.leftSection}>
              <Text style={styles.number}>{selectedProperty?.property_code}</Text>
              <Text style={styles.destination}>{selectedProperty?.name}</Text>
          </View>
      </Pressable>
    </View>
  )
}


// Styles
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    position:'relative',
    backgroundColor:'#fff',
    justifyContent:'center'
  },
  map:{
    width:'100%',
    height:'100%',
  },
  itemContainer:{
    bottom:5,
    height:100,
    width:'100%',
    display:'flex',
    borderColor:'#ccc',
    alignItems:'center',
    flexDirection:'row',
    borderBottomWidth:1,
    position:'absolute',
    backgroundColor:'#fff',
    justifyContent:'space-between'
  },
  leftSection:{
    flex:6,
    height:'100%',
    display:'flex',
    paddingLeft:30,
    alignItems:'flex-start',
    justifyContent:'center'
  },
  rightSection:{
    flex:1,
    height:'100%',
    display:'flex',
    paddingRight:30,
    alignItems:'center',
    justifyContent:'center'
  },
  number:{
      marginBottom:10
  },
  destination:{
      color:'#5f6368',
      fontWeight:'500'
  }
})


// Export
export default Map;