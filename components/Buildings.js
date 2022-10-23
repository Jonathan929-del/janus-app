// Imports
import axios from 'axios';
import Components from './Components';
import LoadingIcon from './LoadingIcon';
import {useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView} from 'react-native';


// Main Function
const Buildings = ({propertyCode, isBuildingsOpened, setIsBuildingsOpened}) => {


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
                const res = await axios.get(`https://janus-server-side.herokuapp.com/buildings/${propertyCode}`);
                setBuildings(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        buildingsFetcher();
    }, [isBuildingsOpened]);

    return (
    <Modal visible={isBuildingsOpened} animationType='slide'>
        <Components 
            isComponentsOpened={isComponentsOpened}
            setIsComponentsOpened={setIsComponentsOpened}
            buildingCode={buildingCode}
        />
        <View style={styles.topbar}>
            <Pressable onPress={() => setIsBuildingsOpened(false)}>
                <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
            </Pressable>
            <Text style={styles.header}>Buildings</Text>
        </View>
        <ScrollView>
            {buildings[0]._id ? buildings.map(building => (
                <Pressable style={styles.itemContainer} key={building.latitude}  onPress={() => buildingHandler(building.building_code)}>
                    <View style={styles.leftSection}>
                        <Text style={styles.buildingCode}>{building.building_code}</Text>
                        <Text style={styles.buildingNumber}>{building.no_of_floors}</Text>
                    </View>
                    <View style={styles.rightSection}>
                        <IonIcon name='arrow-forward' color='#5f6368' size={25} />
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
        borderBottomWidth:1,
        borderBottomColor:'#ccc'
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
        width:'100%',
        display:'flex',
        borderColor:'#ccc',
        alignItems:'center',
        flexDirection:'row',
        borderBottomWidth:1,
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
    buildingCode:{
        marginBottom:10
    },
    buildingNumber:{
        color:'#5f6368',
        fontWeight:'500'
    },
    loadingIconContainer:{
        marginTop:50
    }
});


// Export
export default Buildings;