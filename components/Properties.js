// Imports
import axios from 'axios';
import Buildings from './Buildings';
import LoadingIcon from './LoadingIcon';
import {useState, useEffect} from 'react';
import {useTheme} from '../src/theme/themeProvider';
import {View, Text, Pressable, StyleSheet, ScrollView, Image} from 'react-native';


// Main Function
const Properties = () => {


    // Theme
    const {dark, theme} = useTheme();


    // Fetching properties
    const [properties, setProperties] = useState([{}]);
    useEffect(() => {
        const propertiesFetcher = async () => {
            axios
                .get('https://janus-backend-api.herokuapp.com/properties')
                .then((res) => {
                    setProperties(res.data.sort(
                        (a, b) => {
                            return a.property_code - b.property_code;
                        }
                    ));
                })
                .catch(err => console.log(err));
        };
        propertiesFetcher();
    }, []);


    // Properties subpages
    const [propertyCode, setPropertyCode] = useState('');
    const [isBuildingsOpened, setIsBuildingsOpened] = useState(false);
    const buildingsOpener = code => {
        setIsBuildingsOpened(true);
        setPropertyCode(code);
    }


    return (
        <ScrollView style={{paddingTop:10, backgroundColor:dark ? '#000' : '#D9D9D9'}}>
            <Buildings 
                isBuildingsOpened={isBuildingsOpened}
                propertyCode={propertyCode}
                setIsBuildingsOpened={setIsBuildingsOpened}
            />
            {properties[0].property_code ? properties.map(property => (
                <Pressable style={[styles.itemContainer, {
                    backgroundColor:dark ? '#333F50' : '#F5F5F5',
                    borderColor:dark ? '#35C7FB' : '#000'
                    }]} key={property._id}
                    onPress={() => buildingsOpener(property.property_code)}
                >
                    <View style={styles.leftSection}>
                        {dark
                            ? <Image source={require('../assets/images/PropertyIconDark.png')} style={styles.propertyIcon}/>
                            : <Image source={require('../assets/images/PropertyIcon.png')} style={styles.propertyIcon}/>
                        }
                        <Text style={{color:theme.text, fontFamily:theme.font}}>{property.property_code}</Text>
                    </View>
                    <View style={styles.middleSection}>
                        <Text style={[styles.destination, {color:theme.text, fontFamily:theme.font}]}>{property.name}</Text>
                    </View>
                    <View style={styles.rightSection}>
                        <View style={[styles.iconContainer, {
                            backgroundColor:dark ? '#000' : '#D9D9D9',
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
            )) : <View style={styles.loadingIconContainer}>
                    <LoadingIcon />
                </View>}
        </ScrollView>
    )
};


// Styles
const styles = StyleSheet.create({
    container:{
        display:'flex',
        alignItems:'center',
        flexDirection:'column'
    },
    itemContainer:{
        height:100,
        marginTop:5,
        width:'100%',
        display:'flex',
        borderRadius:5,
        borderTopWidth:2,
        borderBottomWidth:2,
        alignItems:'center',
        flexDirection:'row',
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
    },
    icon:{
        fontSize:20,
        marginLeft:3,
        marginBottom:3
    }
});


// Export
export default Properties;