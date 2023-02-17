// Imports
import axios from 'axios';
import Components from './Components';
import LoadingIcon from './LoadingIcon';
import {useState, useEffect} from 'react';
import {useTheme} from '../src/theme/themeProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView, Image} from 'react-native';


// Main Function
const Buildings = ({propertyCode, isBuildingsOpened, setIsBuildingsOpened}) => {


    // Theme
    const {dark, theme} = useTheme();


    // Opening components
    const [buildings, setBuildings] = useState([{}]);
    const [isComponentsOpened, setIsComponentsOpened] = useState(false);
    const buildingHandler = buildingId => {
        setIsComponentsOpened(true);
        setBuildingCode(buildingId);
    };
    
    
    // Fetching buldings
    const [buildingCode, setBuildingCode] = useState('');
    useEffect(() => {
        const buildingsFetcher = async () => {
            try {
                const res = await axios.get(`https://janus-backend-api.herokuapp.com/buildings/${propertyCode}`);
                setBuildings(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        buildingsFetcher();
    }, [isBuildingsOpened]);


    return (
    <Modal visible={isBuildingsOpened} animationType='slide' style={{backgroundColor:theme.screenBackground}}>
        <Components 
            isComponentsOpened={isComponentsOpened}
            setIsComponentsOpened={setIsComponentsOpened}
            buildingCode={buildingCode}
            setIsBuildingsOpened={setIsBuildingsOpened}
        />
        <View style={[styles.topbar, {backgroundColor:dark ? '#000' : '#fff', borderColor:dark ? '#fff' : '#000'}]}>
            <Pressable onPress={() => setIsBuildingsOpened(false)}>
                <IonIcon name='arrow-back' style={styles.arrowBackIcon} color={theme.text}/>
            </Pressable>
            <Text style={[styles.header, {color:theme.text, fontFamily:theme.font}]}>Buildings</Text>
        </View>
        <View style={[styles.categories, {borderColor:theme.text, backgroundColor:theme.screenBackground}]}>
                <Pressable onPress={() => setIsBuildingsOpened(false)} style={{paddingRight:5}}><Text style={{color:theme.text, fontFamily:theme.font}}>Properties</Text></Pressable>
                <Text style={{color:theme.text, fontFamily:theme.font}}>{'>'}</Text>
                <Text style={{paddingLeft:5, color:theme.text, fontFamily:theme.font}}>Buildings</Text>
        </View>
        <ScrollView style={{backgroundColor:dark ? '#000' : '#D9D9D9', paddingTop:20}}>
            {buildings[0]._id ? buildings.map(building => (
                <Pressable style={[styles.itemContainer, {backgroundColor:dark ? '#333F50' : '#F5F5F5', borderColor:dark ? '#35C7FB' : '#000'}]} key={Math.floor(Math.random() * 1000000)}  onPress={() => buildingHandler(building.building_code)}>
                    <View style={styles.leftSection}>
                        <View style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                            {
                                dark
                                ? <Image source={require('../assets/images/HomeDark.png')} style={{width:35, height:35}}/>
                                : <Image source={require('../assets/images/Home.png')} style={{width:35, height:35}}/>
                            }
                            <Text style={[styles.buildingCode, {color:theme.text, fontFamily:theme.font}]}>{building.building_code}</Text>
                        </View>
                        <View style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                            {
                                dark
                                ? <Image source={require('../assets/images/DirectionsDark.png')} style={{width:35, height:35}}/>
                                : <Image source={require('../assets/images/Directions.png')} style={{width:35, height:35}}/>
                            }
                            <Text style={[styles.buildingCode, {color:theme.text, fontFamily:theme.font}]}>{building.street_address}</Text>
                        </View>
                    </View>
                    <View style={[styles.iconContainer, {
                                        backgroundColor:dark ? '#000' : '#D9D9D9',
                                        borderColor:dark ? '#35C7FB' : '#000'
                                    }]}
                    >
                        {
                            dark
                            ? <Image source={require('../assets/images/ArrowForwardDark.png')} style={{height:25, width:25}}/>
                            : <Image source={require('../assets/images/ArrowForward.png')} style={{height:25, width:25}}/>
                        }
                    </View>
                </Pressable>
            )) : <View style={styles.loadingIconContainer}>
                <LoadingIcon />
            </View>}
        </ScrollView>
    </Modal>
  )
};


// Styles
const styles = StyleSheet.create({
    topbar:{
        width:'100%',
        height:70,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1
    },
    arrowBackIcon:{
        fontSize:30,
        marginLeft:15
    },
    header:{
        fontSize:20,
        marginLeft:10
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
    buildingCode:{
        marginLeft:10,
        fontWeight:'600'
    },
    buildingNumber:{
        color:'#5f6368',
        fontWeight:'500'
    },
    loadingIconContainer:{
        marginTop:50
    },
    iconContainer:{
        width:40,
        height:40,
        borderWidth:1,
        display:'flex',
        borderRadius:50,
        marginRight:30,
        alignItems:'center',
        justifyContent:'center',
    },
    categories:{
        paddingLeft:20,
        display:'flex',
        paddingVertical:15,
        borderBottomWidth:2,
        flexDirection:'row',
        alignItems:'center'
    }
});


// Export
export default Buildings;