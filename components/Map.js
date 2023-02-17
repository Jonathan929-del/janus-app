// Imports
import axios from 'axios';
import Buildings from './Buildings';
import {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {useTheme} from '../src/theme/themeProvider';
import {View, StyleSheet, Pressable, Text, Image} from 'react-native';


// Main Function
const Map = () => {


  // Theme
  const {dark, theme} = useTheme();
  
  
  // Fetching properties
  const [properties, setProperties] = useState([{}]);
  const [selectedProperty, setSelectedProperty] = useState({property_code:'1001', name:'BYGGMÄSTAREN'});
  useEffect(() => {
    const propertiesFetcher = async () => {
      try {
        const res = await axios.get('https://janus-backend-api.herokuapp.com/properties');
        const undefinedFilter = res.data.filter(property => {
          return property.latitude !== undefined;
        });
        const stringFilter = undefinedFilter.filter(property => {
          const latitude = property.latitude;
          return !isNaN(latitude);
        });
        setProperties(stringFilter);
      } catch (err) {
        console.log(err);
      }
    };
    propertiesFetcher();
  }, [properties]);


  // Property fetching
  const propertyFetcher = async latitude => {
    try {
      const res = await axios.get(`https://janus-backend-api.herokuapp.com/properties/${latitude}`);
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
  };


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
                latitude:JSON.parse(property?.latitude),
                longitude:JSON.parse(property?.longitude)
              }}
              onPress={() => propertyFetcher(property.latitude)}
            />
          ))}
      </MapView>
        <Pressable style={[styles.itemContainer, {
              backgroundColor:dark ? '#333F50' : '#F5F5F5',
              borderColor:dark ? '#35C7FB' : '#000'
            }]}
            onPress={() => buildingsOpener(selectedProperty.property_code)}
        >
            <View style={styles.leftSection}>
                {dark
                    ? <Image source={require('../assets/images/PropertyIconDark.png')} style={styles.propertyIcon}/>
                    : <Image source={require('../assets/images/PropertyIcon.png')} style={styles.propertyIcon}/>
                }
                <Text style={{color:theme.text, fontFamily:theme.font}}>{selectedProperty?.property_code}</Text>
            </View>
            <View style={styles.middleSection}>
                <Text style={[styles.destination, {color:theme.text, fontFamily:theme.font}]}>{selectedProperty.name}</Text>
            </View>
            <View style={styles.rightSection}>
                <View style={[styles.iconContainer, {
                    backgroundColor:dark ? '#000' : '#d9d9d9',
                    borderColor:dark ? '#35C7FB' : '#000'
                }]}>
                    {
                      dark
                      ? <Image source={require('../assets/images/ArrowForwardDark.png')} style={{height:25, width:25}}/>
                      : <Image source={require('../assets/images/ArrowForward.png')} style={{height:25, width:25}}/>
                    }
                </View>
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
    bottom:10,
    height:100,
    marginTop:1,
    width:'100%',
    display:'flex',
    borderRadius:10,
    borderTopWidth:2,
    alignItems:'center',
    flexDirection:'row',
    borderBottomWidth:2,
    position:'absolute',
    justifyContent:'space-between',
  },
  leftSection:{
    flex:3,
    height:'100%',
    display:'flex',
    paddingLeft:30,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
  },
  middleSection:{
    flex:6,
    display:'flex',
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'flex-start'
  },
  rightSection:{
      flex:1,
      height:'100%',
      display:'flex',
      paddingRight:30,
      alignItems:'center',
      justifyContent:'center'
  },
  destination:{
      fontWeight:'500'
  },
  loadingIconContainer:{
      marginTop:50
  },
  propertyIcon:{
      height:40,
      width:40     
  },
  iconContainer:{
      width:40,
      height:40,
      borderWidth:1,
      display:'flex',
      borderRadius:50,
      alignItems:'center',
      justifyContent:'center',
  }
})


// Export
export default Map;