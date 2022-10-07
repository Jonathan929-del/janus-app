// Imports
import axios from 'axios';
import moment from 'moment';
import Activity from './Activity';
import LoadingIcon from './LoadingIcon';
import {useState, useEffect} from 'react';
import ActivityRegistry from './ActivityRegistry';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView, TouchableOpacity} from 'react-native';


// Main Function
const Activities = ({componentName, isActivitiesOpened, setIsActivitiesOpened}) => {


    // Fetching activities
    const [activities, setActivities] = useState([{}]);
    useEffect(() => {
        const activitiesFetcher = async () => {
            try {
                const {data} = await axios.get(`https://janus-server-side.herokuapp.com/activities/${componentName}`);
                setActivities(data.sort(
                    (a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    }
                ));
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
    };


    // Activity registry opening
    const [isActivityRegistryOpened, setIsActivityRegistryOpened] = useState(false);
    const activityRegistryOpener = () => {
        setIsActivityRegistryOpened(true);
    };

    
    return (
        <Modal visible={isActivitiesOpened} animationType='slide'>
            <Activity 
                isActivityOpened={isActivityOpened}
                setIsActivityOpened={setIsActivityOpened}
                activityId={activityId}
            />
            <ActivityRegistry 
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
                componentName={componentName}
            />
            <View style={styles.topbar}>
                <Pressable onPress={() => setIsActivitiesOpened(false)}>
                    <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
                </Pressable>
                <Text style={styles.header}>Activities</Text>
            </View>
            {activities.length > 0 ? <ScrollView horizontal={true}>
                <View style={styles.mainContainer}>
                    <View style={styles.listContainer}>
                        <Text style={styles.listItem}>Task</Text>
                        <Text style={styles.listItem}>Date</Text>
                        <Text style={styles.listItem}>Component Code</Text>
                        <Text style={styles.listItem}>Signature</Text>
                        <Text style={styles.listItem}>Image</Text>
                    </View>
                        {typeof(activities[0].user === 'string') ? activities.map(activity => (
                            <Pressable style={styles.listContainer} onPress={() => activityOpener(activity._id)} key={activity._id}>
                                <Text style={styles.listItemValue}>{activity.activity}</Text>
                                <Text style={styles.listItemValue}>{moment(activity.date).format('YYYY-MM-DD')}</Text>
                                <Text style={styles.listItemValue}>{activity.component}</Text>
                                <Text style={styles.listItemValue}>{activity.user}</Text>
                                <Text style={styles.listItemValue}></Text>
                            </Pressable>
                        )) : <View style={styles.loadingIconContainer}>
                        <LoadingIcon />
                    </View>}
                    <View style={styles.noActivitiesContainer}>
                        <TouchableOpacity style={styles.buttonContainer} onPress={activityRegistryOpener}>
                            <Text style={styles.buttonText}>Add Activity</Text>
                            <IonIcon name='add-circle' style={styles.addIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView> : <View style={styles.noActivitiesContainer}>
                    <Text style={styles.noCom}>No activities to show</Text>
                    <TouchableOpacity style={styles.buttonContainer} onPress={activityRegistryOpener}>
                        <Text style={styles.buttonText}>Add Activity</Text>
                        <IonIcon name='add-circle' style={styles.addIcon} />
                    </TouchableOpacity>
                </View>}
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
    },
    mainContainer:{
        display:'flex',
        alignItems:'flex-start'
    },
    listContainer:{
        display:'flex',
        overflow:'scroll',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    listItem:{
        width:200,
        borderWidth:1,
        borderTopWidth:0,
        paddingVertical:10,
        borderColor:'#ccc',
        paddingHorizontal:30
    },
    listItemValue:{
        width:200,
        borderWidth:1,
        color:'#6e6e6e',
        borderTopWidth:0,
        paddingVertical:10,
        borderColor:'#ccc',
        paddingHorizontal:30,
    },
    noActivitiesContainer:{
        display:'flex',
        alignItems:'center'
    },
    buttonContainer:{
        marginTop:30,
        marginLeft:10,
        display:'flex',
        borderRadius:5,
        paddingVertical:10,
        alignItems:'center',
        flexDirection:'row',
        paddingHorizontal:25,
        backgroundColor:'#0d80e7',
        justifyContent:'space-between'
    },
    buttonText:{
        color:'#fff',
    },
    addIcon:{
        fontSize:25,
        color:'#fff',
        marginLeft:10
    }
});


// Export
export default Activities;