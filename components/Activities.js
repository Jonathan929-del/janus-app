// Imports
import axios from 'axios';
import moment from 'moment';
import {useState, useEffect} from 'react';
import ActivityRegistry from './ActivityRegistry';
import {useTheme} from '../src/theme/themeProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView, Image} from 'react-native';


// Main Function
const Activities = ({componentName, isActivitiesOpened, setIsActivitiesOpened, setIsBuildingsOpened, setIsComponentsOpened}) => {


    // Theme
    const {dark, theme} = useTheme();


    // Fetching activities
    const [activities, setActivities] = useState([{}]);
    const [isActivityRegistryOpened, setIsActivityRegistryOpened] = useState(false);
    useEffect(() => {
        const activitiesFetcher = async () => {
            try {
                const {data} = await axios.get(`https://janus-backend-api.herokuapp.com/activities/${componentName}`);
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
    }, [componentName, isActivityRegistryOpened]);


    // Activity registry opening
    const activityRegistryOpener = () => {
        setIsActivityRegistryOpened(true);
    };


    // Activity preview opening
    const [isActivityPreview, setIsActivityPreview] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState({});
    const activityPreviewOpener = activity => {
        setSelectedActivity(activity);
        setIsActivityPreview(true);
        setIsActivityRegistryOpened(true);
    };


    return (
        <Modal visible={isActivitiesOpened} animationType='slide'>
            <ActivityRegistry
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
                componentName={componentName}
                isActivityPreview={isActivityPreview}
                selectedActivity={selectedActivity}
                setIsActivityPreview={setIsActivityPreview}
            />
                <View style={[styles.topbar, {backgroundColor:theme.screenBackground}]}>
                    <Pressable onPress={() => setIsActivitiesOpened(false)}>
                        <IonIcon name='arrow-back' style={styles.arrowBackIcon} color={theme.text}/>
                    </Pressable>
                    <Text style={[styles.header, {color:theme.text, fontFamily:theme.font}]}>Activities</Text>
                </View>
                <View style={[styles.categories, {borderColor:theme.text, backgroundColor:theme.screenBackground}]}>
                    <Pressable
                        onPress={() => {
                            setIsActivitiesOpened(false);
                            setIsComponentsOpened(false);
                            setIsBuildingsOpened(false);
                        }} style={{paddingRight:5}}
                    >
                        <Text style={{color:theme.text, fontFamily:theme.font}}>Properties</Text>
                    </Pressable>
                    <Text style={{color:theme.text, fontFamily:theme.font}}>{'>'}</Text>
                    <Pressable style={{paddingHorizontal:5}} onPress={() => {
                        setIsActivitiesOpened(false);
                        setIsComponentsOpened(false);
                    }}>
                        <Text style={{color:theme.text, fontFamily:theme.font}}>Buildings</Text>
                    </Pressable>
                    <Text style={{color:theme.text, fontFamily:theme.font}}>{'>'}</Text>
                    <Pressable style={{paddingHorizontal:5}} onPress={() => setIsActivitiesOpened(false)}>
                        <Text style={{color:theme.text, fontFamily:theme.font}}>Components</Text>
                    </Pressable>
                    <Text style={{color:theme.text, fontFamily:theme.font}}>{'>'}</Text>
                    <Text style={{color:theme.text, fontFamily:theme.font, marginLeft:5}}>Activities</Text>
                </View>
                {/* <View> */}
                    <ScrollView style={{backgroundColor:theme.screenBackground, paddingTop:10, height:'100%',}}>
                            {activities.length > 0
                            ? activities.map(activity => (
                                <Pressable style={[styles.itemContainer, {backgroundColor:dark ? '#333F50' : '#F5F5F5', borderColor:dark ? '#35C7FB' : '#000'}]} key={activity._id}>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginLeft:10}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/DateDark.png')} style={{height:30, width:30}}/>
                                            : <Image source={require('../assets/images/Date.png')} style={{height:30, width:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>{moment(activity.date).format('YYYY-MM-DD')}</Text>
                                    </View>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/TaskDark.png')} style={{height:30, width:30}}/>
                                            : <Image source={require('../assets/images/Task.png')} style={{height:30, width:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>{activity.activity}</Text>
                                    </View>
                                    <Pressable style={[styles.rightSection, {
                                                        backgroundColor:dark ? '#000' : '#D9D9D9',
                                                        borderColor:dark ? '#35C7FB' : '#000'
                                        }]}
                                        onPress={() => activityPreviewOpener(activity)}
                                    >
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/ArrowForwardDark.png')} style={{height:25, width:25}}/>
                                            : <Image source={require('../assets/images/ArrowForward.png')} style={{height:25, width:25}}/>
                                        }
                                    </Pressable>
                                </Pressable>
                            ))
                            : <View style={styles.noActivitiesContainer}>
                                    <Text style={[styles.noCom, {color:theme.text, fontFamily:theme.font}]}>No activities to show</Text>
                                </View>}
                    </ScrollView>
                    <Pressable style={[styles.addButton, {backgroundColor:dark ? '#000' : '#35C7FB', borderColor:dark ? '#35C7FB' : '#fff'}]} onPress={activityRegistryOpener}>
                        <Text style={{color:dark ? '#35C7FB' : '#fff', fontSize:50, fontWeight:'300'}}>+</Text>
                    </Pressable>
                {/* </View> */}
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
    },
    arrowBackIcon:{
        fontSize:30,
        marginLeft:15
    },
    header:{
        fontSize:20,
        marginLeft:10
    },
    noCom:{
        fontSize:14,
        width:'100%',
        marginTop:50,
        textAlign:'center'
    },
    noActivitiesContainer:{
        display:'flex',
        alignItems:'center'
    },
    categories:{
        paddingLeft:20,
        display:'flex',
        borderTopWidth:1,
        paddingVertical:15,
        borderBottomWidth:2,
        flexDirection:'row',
        alignItems:'center'
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
    rightSection:{
        width:50,
        height:50,
        borderWidth:1,
        display:'flex',
        marginRight:30,
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center',
    },
    addButton:{
        right:30,
        zIndex:5,
        width:100,
        height:100,
        bottom:100,
        borderWidth:2,
        display:'flex',
        borderRadius:500,
        position:'absolute',
        alignItems:'center',
        justifyContent:'center'
    }
});


// Export
export default Activities;