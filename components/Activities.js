// Imports
import axios from 'axios';
import LoadingIcon from './LoadingIcon';
import {useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView} from 'react-native';
import Activity from './Activity';


// Main Function
const Activities = ({componentName, isActivitiesOpened, setIsActivitiesOpened}) => {


    // Fetching activities
    const [activities, setActivities] = useState([{}]);
    useEffect(() => {
        const activitiesFetcher = async () => {
            try {
                const res = await axios.get(`https://janus-server-side.herokuapp.com/activities/${componentName}`);
                setActivities(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        activitiesFetcher();
    }, [componentName]);
    
    // Opening activity
    const [isActivityOpened, setIsActivityOpened] = useState(false);
    const [activityId, setActivityId] = useState('');
    const activityOpener = id => {
        setActivityId(id);
        setIsActivityOpened(true);
    }


    return (
    <Modal visible={isActivitiesOpened} animationType='slide'>
        <Activity 
            isActivityOpened={isActivityOpened}
            setIsActivityOpened={setIsActivityOpened}
            activityId={activityId}
        />
        <View style={styles.topbar}>
            <Pressable onPress={() => setIsActivitiesOpened(false)}>
                <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
            </Pressable>
            <Text style={styles.header}>{componentName} activities</Text>
        </View>
        <ScrollView>
            {activities.length > 0 ? typeof(activities[0].user) === 'string' ? activities.map(activity => (
                <Pressable style={styles.itemContainer} key={activity._id} onPress={() => activityOpener(activity._id)}>
                    <View style={styles.leftSection}>
                        <Text style={styles.buildingCode}>{activity.user}</Text>
                        <Text style={styles.buildingNumber}>{activity.date}</Text>
                    </View>
                    <View style={styles.rightSection}>
                        <IonIcon name='arrow-forward' color='#5f6368' size={25}/>
                    </View>
                </Pressable>
            )) : <View style={styles.loadingIconContainer}>
                <LoadingIcon />
            </View> : <Text style={styles.noCom}>No activities to show</Text>}
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
    },
    noCom:{
        width:'100%',
        fontSize:12,
        marginTop:50,
        textAlign:'center'
    }
});


// Export
export default Activities;