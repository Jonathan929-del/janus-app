// Imports
import axios from 'axios';
import moment from 'moment';
import * as Location from 'expo-location';
import {useEffect, useState} from 'react';
import ActivityRegistry from './ActivityRegistry';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MapView, {Circle, Marker} from 'react-native-maps';
import {Modal, Pressable, View, Text, StyleSheet, Image, Animated} from 'react-native';


// Main Function
const NearMe = ({isNearMeOpened, setIsNearMeOpened}) => {
    
    
    // Getting user's location
    const [userLocation, setUserLocation] = useState({});


    // Missed activities
    const [missedActivities, setMissedActivities] = useState([{}]);
    const [missedActivitiesCom, setMissedActivitiesCom] = useState();


    // Upcoming activities
    const [upcomingActivities, setUpcomingActivities] = useState([{}]);
    const [upcomingActivitiesCom, setUpcomingActivitiesCom] = useState();


    // All building filter
    const [allBuildings, setAllBuildings] = useState([{}]);
    const [allBuildingsCom, setAllBuildingsCom] = useState();


    // Opening activity registry
    const [isActivityRegistryOpened, setIsActivityRegistryOpened] = useState(false);
    const [componentName, setComponentName] = useState('');
    const activityRegisrtyOpener = id => {
        setComponentName(id);
        setIsActivityRegistryOpened(true);
    };


    // Component animations
    const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1));
    const fadeInAndOut = () => {
        Animated.timing(fadeAnim, {
          toValue: 0.1,
          duration: 200,
          useNativeDriver: true
        }).start();
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        }, 200);
    };


    // Selected component
    const [index, setIndex] = useState(0);
    const [setOfComponents, setSetOfComponents] = useState({});
    const [selectedBuildingComponent, setSelectedBuildingComponent] = useState({});
    const selectedBuildingHandler = async buildingCode => {
        try {
            const res = await axios.get(`https://janus-server-api.herokuapp.com/components/${buildingCode}`);
            const componentsWithDates = res.data.filter(component => component.maintenance_next_date !== undefined || component.attendance_next_date !== undefined);
            setSetOfComponents(componentsWithDates);
            setSelectedBuildingComponent(componentsWithDates[0]);
            dataFetcher(setOfComponents.length);
        } catch (err) {
            console.log(err);
        }  
    };
    const swipeHandler = () => {
        fadeInAndOut();
        setTimeout(() => {
            const componentsIds = setOfComponents.map(component => component.component_code);
            setIndex(index < componentsIds.length - 1 ? index + 1 : 0);
            setSelectedBuildingComponent(setOfComponents[index]);
        }, 200);
    };


    // Data fetcher
    const dataFetcher = async length => {
        try {
            console.log(length);
            // Notificaionts fetching
            const res = await axios.get('https://janus-server-api.herokuapp.com/notifications/');
            const presentNotifications = res.data !== undefined ? res.data.filter(notification => notification[0]?.building_code !== undefined) : '';
            // Buildings fetching
            const buildingsrRes = await axios.get('https://janus-server-api.herokuapp.com/buildings/');
            const buildingsWithCoordinates = buildingsrRes.data.filter(building => building?.latitude !== undefined);
            // Missed activities
            const notificationsIds = presentNotifications?.map(notification => notification[0].building_code);
            const filteredNotificationsIds = notificationsIds?.filter((item,index) => notificationsIds.indexOf(item) === index);
            const notificationsComponentsBuildings = buildingsWithCoordinates.filter(building => {
                return filteredNotificationsIds?.includes(building.building_code);
            });
            setMissedActivities(notificationsComponentsBuildings);
            // Upcoming activities
            const upcomingRes = await axios.get('https://janus-server-api.herokuapp.com/components/');
            const today = new Date();
            const first = today.getDate() - today.getDay() + 1;
            const last = first + 6;
            const nextSunday = new Date(today.setDate(last));
            const weekComponents = upcomingRes.data.filter(component => {
                return new Date(component.maintenance_next_date) < nextSunday && new Date(component.attendance_next_date) < nextSunday;
            });
            const componentsIds = weekComponents.map(component => component.building_code);
            const filteredComponentsIds = componentsIds.filter((item,index) => componentsIds.indexOf(item) === index);
            const missedActivitiesIds = notificationsComponentsBuildings.map(activity => activity.building_code);
            const missedActivitiesFilter = filteredComponentsIds.filter(id => !missedActivitiesIds.includes(id));
            const componentsBuildings = buildingsWithCoordinates.filter(building => {
                return missedActivitiesFilter.includes(building.building_code);
            });
            setUpcomingActivities(componentsBuildings);
            // All buildings
            const otherBuildings = componentsBuildings.concat(notificationsComponentsBuildings);
            const otherBuildingIds = otherBuildings.map(building => building.building_code);
            const filteredOtherBuildingsIds = otherBuildingIds.filter((item,index) => otherBuildingIds.indexOf(item) === index);
            const allComponentsBuildings = buildingsWithCoordinates.filter(building => {
                return !filteredOtherBuildingsIds.includes(building.building_code);
            });
            setAllBuildings(allComponentsBuildings);
            // Missed activities component
            setMissedActivitiesCom(
                missedActivities[0]._id ? missedActivities.map(activity =>
                    <Marker
                        onPress={() => selectedBuildingHandler(activity.building_code)}
                        key={activity._id}
                        coordinate={{
                            latitude:activity?.latitude && activity?.latitude !== undefined ? JSON.parse(activity?.latitude) : '',
                            longitude:activity?.longitude && activity?.longitude !== undefined ? JSON.parse(activity?.longitude) : ''
                        }}
                        pinColor='#f00'
                        title={`${activity.building_code} ()`}
                    />
                ) : ''
            );
            // Upcoming activities com
            setUpcomingActivitiesCom(
                upcomingActivities[0]._id ? upcomingActivities.map(activity =>
                    <Marker
                        onPress={() => selectedBuildingHandler(activity.building_code)}
                        key={activity._id}
                        coordinate={{
                            latitude:activity?.latitude !== undefined ? JSON.parse(activity?.latitude) : '',
                            longitude:activity?.longitude !== undefined ? JSON.parse(activity?.longitude) : ''
                        }}
                        pinColor='orange'
                        title={`${activity.building_code} ()`}
                    />
                ) : ''
            );
            // All buildings com
            setAllBuildingsCom(
                allBuildings[0]._id ? allBuildings.map(building =>
                    <Marker
                        onPress={() => selectedBuildingHandler(building.building_code)}
                        key={building._id}
                        coordinate={{
                            latitude:building?.latitude !== undefined ? JSON.parse(building?.latitude) : '',
                            longitude:building?.longitude !== undefined ? JSON.parse(building?.longitude) : ''
                        }}
                        pinColor='blue'
                        title={`${building.building_code} ()`}
                    />
                ) : ''
            );
        } catch (err) {
            console.log(err);
        }
    };
    
    
    // Use effect
    useEffect(() => {
        dataFetcher();
    }, []);
    
    
    // Location use effect
    useEffect(() => {
        const userLocationHandler = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude:location.coords.latitude,
                longitude:location.coords.longitude,
            });
        };
        userLocationHandler();
    }, [userLocation]);


    return (
        <Modal visible={isNearMeOpened} animationType='slide'>
            <ActivityRegistry
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
                componentName={componentName}
            />
            <View style={styles.topbar}>
                <Pressable onPress={() => setIsNearMeOpened(false)}>
                    <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
                </Pressable>
                <Text style={styles.header}>Near Me</Text>
            </View>
            <MapView style={styles.map}
                initialRegion={{
                    latitude:userLocation?.latitude ? JSON.parse(userLocation?.latitude) : '',
                    longitude:userLocation?.longitude ? JSON.parse(userLocation?.longitude) : '',
                    latitudeDelta: 0.0422,
                    longitudeDelta: 0.01,
                }}
            >
                <Circle
                    center={{
                        latitude:userLocation.latitude ? JSON.parse(userLocation.latitude) : '',
                        longitude:userLocation.longitude ? JSON.parse(userLocation.longitude) : ''
                    }}
                    radius={500}
                    fillColor='#0076ff36'
                    strokeWidth={0}
                />
                <Circle
                    center={{
                        latitude:userLocation.latitude ? JSON.parse(userLocation.latitude) : '',
                        longitude:userLocation.longitude ? JSON.parse(userLocation.longitude) :'',
                    }}
                    radius={10}
                    fillColor='#000'
                    strokeWidth={10}
                />
                {missedActivitiesCom}
                {upcomingActivitiesCom}
                {allBuildingsCom}
            </MapView>
            {selectedBuildingComponent?.building_code ?
                <Animated.View style={[styles.itemContent, {opacity:fadeAnim}]}>
                    <View>
                        <Text>{selectedBuildingComponent?.building_code}</Text>
                        <Text>{selectedBuildingComponent?.component_code}</Text>
                        <Text>
                                {selectedBuildingComponent?.maintenance_next_date !== undefined
                                        ? selectedBuildingComponent?.attendance_next_date !== undefined
                                            ?
                                                new Date(selectedBuildingComponent?.maintenance_next_date) <= new Date(selectedBuildingComponent?.attendance_next_date)
                                                    ? 'Skötsel'
                                                    : 'Tillsyn'
                                            : 'Skötsel'
                                        : selectedBuildingComponent?.attendance_next_date !== undefined
                                            ? 'Tillsyn'
                                            : ''
                                }
                        </Text>
                        <Text>
                            {   selectedBuildingComponent?.maintenance_next_date !== undefined
                                    ? selectedBuildingComponent?.attendance_next_date !== undefined
                                        ?
                                            new Date(selectedBuildingComponent?.maintenance_next_date) <= new Date(selectedBuildingComponent?.attendance_next_date)
                                                ? moment(selectedBuildingComponent?.maintenance_next_date).format('YYYY-MM-DD')
                                                : moment(selectedBuildingComponent?.attendance_next_date).format('YYYY-MM-DD')
                                        : moment(selectedBuildingComponent?.maintenance_next_date).format('YYYY-MM-DD')
                                    : selectedBuildingComponent?.attendance_next_date !== undefined
                                        ? moment(selectedBuildingComponent?.attendance_next_date).format('YYYY-MM-DD')
                                        : ''
                            }
                        </Text>
                    </View>
                    <View style={styles.imageWrapper}>
                        <Pressable style={styles.detailsButton} onPress={() => activityRegisrtyOpener(selectedBuildingComponent?.component_code)}>
                            <Text style={styles.buttonText}>Details</Text>
                            <IonIcon name='arrow-forward' style={styles.detailsIcon} />
                        </Pressable>
                        {setOfComponents.length > 1 ? <Pressable onPress={swipeHandler} style={styles.swipeButtonContainer}>
                            <Image source={require('../assets/images/SwipeRight.png')} style={styles.image}/>
                        </Pressable> : ''}
                    </View>
                </Animated.View> :
                <View style={styles.itemContent}>
                    <Text>Building has no components</Text>
                </View>
            }
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
    map:{
        width:'100%',
        height:'100%',
    },
    itemContent:{
        bottom:20,
        paddingHorizontal:30,
        paddingVertical:20,
        display:'flex',
        borderColor:'#ccc',
        alignItems:'center',
        flexDirection:'row',
        borderBottomWidth:1,
        position:'absolute',
        width:'100%',
        backgroundColor:'#ffffffe6',
        justifyContent:'space-between'
    },
    detailsButton:{
        height:50,
        display:'flex',
        borderRadius:5,
        alignItems:'center',
        flexDirection:'row',
        paddingHorizontal:30,
        justifyContent:'center',
        backgroundColor:'#0d80e7'
    },
    buttonText:{
        color:'#fff'
    },
    detailsIcon:{
        marginTop:5,
        fontSize:20,
        marginLeft:5,
        color:'#fff',
    },
    imageWrapper:{
        display:'flex',
        alignItems:'center'
    },
    image:{
        width:50,
        marginTop:20
    }
});


// Export
export default NearMe;