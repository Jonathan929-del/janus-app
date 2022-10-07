// Imports
import axios from 'axios';
import Activities from './Activities';
import LoadingIcon from './LoadingIcon';
import {useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView} from 'react-native';


// Main Function
const Components = ({buildingCode, isComponentsOpened, setIsComponentsOpened}) => {


    // Components fetching
    const [components, setComponents] = useState([{}]);
    useEffect(() => {
        const componentsFetcher = async () => {
            try {
                const res = await axios.get(`https://janus-server-side.herokuapp.com/components/${buildingCode}`);
                setComponents(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        componentsFetcher();
    }, [isComponentsOpened]);


    // Opening activities
    const [componentName, setComponentName] = useState('');
    const [isActivitiesOpened, setIsActivitiesOpened] = useState(false);
    const activityOpener = name => {
        setComponentName(name);
        setIsActivitiesOpened(true);
    }

    return (
    <Modal visible={isComponentsOpened} animationType='slide'>
        <Activities 
            componentName={componentName}
            isActivitiesOpened={isActivitiesOpened}
            setIsActivitiesOpened={setIsActivitiesOpened}
        />
        <View style={styles.topbar}>
            <Pressable onPress={() => setIsComponentsOpened(false)}>
                <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
            </Pressable>
            <Text style={styles.header}>Components</Text>
        </View>
        <ScrollView>
            {components.length > 0 ? typeof(components[0].component_code) === 'string' ? components.map(component => (
                <Pressable style={styles.itemContainer} key={component._id} onPress={() => activityOpener(component.component_code)}>
                    <View style={styles.leftSection}>
                        <Text style={styles.buildingCode}>{component.component_code}</Text>
                        {/* <Text style={styles.buildingNumber}>{component.name}</Text> */}
                    </View>
                    <View style={styles.rightSection}>
                        <IonIcon name='arrow-forward' color='#5f6368' size={25}/>
                    </View>
                </Pressable>
            )) : <View style={styles.loadingIconContainer}>
                <LoadingIcon />
            </View> : <Text style={styles.noCom}>No components to show</Text>}
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
        // marginBottom:10
    },
    buildingNumber:{
        color:'#5f6368',
        fontWeight:'500'
    },
    loadingIconContainer:{
        marginTop:50
    },
    noCom:{
        width:'100%',
        fontSize:12,
        marginTop:50,
        textAlign:'center'
    }
});


// Export
export default Components;