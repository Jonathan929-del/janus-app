// Imports
import axios from 'axios';
import moment from 'moment';
import * as Location from 'expo-location';
import {useEffect, useState} from 'react';
import ActivityRegistry from './ActivityRegistry';
import {useTheme} from '../src/theme/themeProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MapView, {Circle, Marker} from 'react-native-maps';
import {Modal, Pressable, View, Text, StyleSheet, Image, Animated} from 'react-native';


// Main Function
const NearMe = ({isNearMeOpened, setIsNearMeOpened}) => {


    // Theme
    const {dark, theme} = useTheme();
    
    
    // Getting user's location
    const [userLocation, setUserLocation] = useState({});


    // Missed activities
    const [missedActivities, setMissedActivities] = useState([{}]);


    // Upcoming activities
    const [upcomingActivities, setUpcomingActivities] = useState([{}]);


    // All building filter
    const [allBuildings, setAllBuildings] = useState([{}]);


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
    const [componentsLength, setComponentsLength] = useState();
    const [selectedBuildingComponent, setSelectedBuildingComponent] = useState({});
    const selectedBuildingHandler = async buildingCode => {
        try {
            const res = await axios.get(`https://janus-backend-api.herokuapp.com/components/${buildingCode}`);
            const componentsWithDates = res.data.filter(component => component.maintenance_next_date !== undefined || component.attendance_next_date !== undefined);
            setSetOfComponents(componentsWithDates);
            setSelectedBuildingComponent(componentsWithDates[0]);
        } catch (err) {
            console.log(err);
        }  
    };
    const rightswipeHandler = () => {
        fadeInAndOut();
        setTimeout(() => {
            const componentsIds = setOfComponents.map(component => component.component_code);
            setIndex(index < componentsIds.length - 1 ? index + 1 : 0);
            setSelectedBuildingComponent(setOfComponents[index]);
        }, 200);
    };
    const leftswipeHandler = () => {
        fadeInAndOut();
        setTimeout(() => {
            const componentsIds = setOfComponents.map(component => component.component_code);
            setIndex(index !== 0 ? index - 1 : componentsIds.length - 1);
            setSelectedBuildingComponent(setOfComponents[index]);
        }, 200);
    };


    // Data fetcher
    const dataFetcher = async () => {
        try {


            // Notificaionts fetching
            const res = await axios.get('https://janus-backend-api.herokuapp.com/notifications/');
            const presentNotifications = res.data !== undefined ? res.data.filter(notification => notification[0]?.building_code !== undefined) : '';
            const notificationsIds = presentNotifications?.map(notification => notification[0].building_code);
            const filteredNotificationsIds = notificationsIds?.filter((item,index) => notificationsIds.indexOf(item) === index);


            // Buildings fetching
            const buildingsrRes = await axios.get('https://janus-backend-api.herokuapp.com/buildings/');
            const buildingsWithCoordinates = buildingsrRes.data.filter(building => building?.latitude !== undefined);


            // Missed activities
            const notificationsComponentsBuildings = buildingsWithCoordinates.filter(building => {
                return filteredNotificationsIds?.includes(building.building_code);
            });
            axios.all(
                notificationsComponentsBuildings.map(building => {
                    return axios.get(`https://janus-backend-api.herokuapp.com/components/${building.building_code}`);
                })
            )
            .then(axios.spread((...responses) => {
                const newResponses = responses.map(components => {
                    const newComponents = components.data.filter(component => {
                        return component.maintenance_next_date !== undefined || component.attendance_next_date !== undefined;
                    });
                    return newComponents;
                });
                const newResponsesFilter = newResponses.filter(component => component[0]?.building_code !== undefined);
                const buildingsData = newResponsesFilter.map(components => {
                    return {
                        componentsLength:components.length,
                        buildingCode:components[0].building_code
                    };
                });
                const newBuildings = notificationsComponentsBuildings.map(building => {
                    const buildingMap = buildingsData.map(data => {
                        const newBuilding = building.building_code === data.buildingCode ? {...building, buildingComponentsLength:data.componentsLength} : '';
                        return newBuilding;
                    });
                    const filter = buildingMap.filter(item => item !== '');
                    return filter[0];
                });
                const filteredBuildings = newBuildings.filter(building => building !== undefined);
                setMissedActivities(filteredBuildings);
            }));
                

            // Upcoming activities
            const upcomingRes = await axios.get('https://janus-backend-api.herokuapp.com/components/');
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
            axios.all(
                componentsBuildings.map(building => {
                    return axios.get(`https://janus-backend-api.herokuapp.com/components/${building.building_code}`);
                })
            )
            .then(axios.spread((...responses) => {
                const newResponses = responses.map(components => {
                    const newComponents = components.data.filter(component => {
                        return component.maintenance_next_date !== undefined || component.attendance_next_date !== undefined;
                    });
                    return newComponents;
                });
                const newResponsesFilter = newResponses.filter(component => component[0]?.building_code !== undefined);
                const buildingsData = newResponsesFilter.map(components => {
                    return {
                        componentsLength:components.length,
                        buildingCode:components[0].building_code
                    };
                });
                const newBuildings = componentsBuildings.map(building => {
                    const buildingMap = buildingsData.map(data => {
                        const newBuilding = building.building_code === data.buildingCode ? {...building, buildingComponentsLength:data.componentsLength} : '';
                        return newBuilding;
                    });
                    const filter = buildingMap.filter(item => item !== '');
                    return filter[0];
                });
                const filteredBuildings = newBuildings.filter(building => building !== undefined);
                setUpcomingActivities(filteredBuildings);
            }));


            // All buildings
            const otherBuildings = componentsBuildings.concat(notificationsComponentsBuildings);
            const otherBuildingIds = otherBuildings.map(building => building.building_code);
            const filteredOtherBuildingsIds = otherBuildingIds.filter((item,index) => otherBuildingIds.indexOf(item) === index);
            const allComponentsBuildings = buildingsWithCoordinates.filter(building => {
                return !filteredOtherBuildingsIds.includes(building.building_code);
            });
            axios.all(
                allComponentsBuildings.map(building => {
                    return axios.get(`https://janus-backend-api.herokuapp.com/components/${building.building_code}`);
                })
            )
            .then(axios.spread((...responses) => {
                const newResponses = responses.map(components => {
                    const newComponents = components.data.filter(component => {
                        return component.maintenance_next_date !== undefined || component.attendance_next_date !== undefined;
                    });
                    return newComponents;
                });
                const newResponsesFilter = newResponses.filter(component => component[0]?.building_code !== undefined);
                const buildingsData = newResponsesFilter.map(components => {
                    return {
                        componentsLength:components.length,
                        buildingCode:components[0].building_code
                    };
                });
                const newBuildings = allComponentsBuildings.map(building => {
                    const buildingMap = buildingsData.map(data => {
                        const newBuilding = building.building_code === data.buildingCode ? {...building, buildingComponentsLength:data.componentsLength} : '';
                        return newBuilding;
                    });
                    const filter = buildingMap.filter(item => item !== '');
                    return filter[0];
                });
                const filteredBuildings = newBuildings.filter(building => building !== undefined);
                setAllBuildings(filteredBuildings);
            }));


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
        <Modal visible={isNearMeOpened} animationType='slide' style={{backgroundColor:theme.screenBackground}}>
            <ActivityRegistry
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
                componentName={componentName}
            />
            <View style={[styles.topbar, {backgroundColor:theme.screenBackground, borderColor:theme.text}]}>
                <Pressable onPress={() => setIsNearMeOpened(false)}>
                    <IonIcon name='arrow-back' style={styles.arrowBackIcon} color={theme.text}/>
                </Pressable>
                <Text style={[styles.header, {color:theme.text, fontFamily:theme.font}]}>Near Me</Text>
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
                {
                    missedActivities[0]?._id ? missedActivities.map(activity =>
                        <Marker
                            onPress={() => selectedBuildingHandler(activity.building_code)}
                            key={activity._id}
                            coordinate={{
                                latitude:activity?.latitude && activity?.latitude !== undefined ? JSON.parse(activity?.latitude) : '',
                                longitude:activity?.longitude && activity?.longitude !== undefined ? JSON.parse(activity?.longitude) : ''
                            }}
                            pinColor='#f00'
                            title={`${activity.building_code} (${activity.buildingComponentsLength})`}
                        />
                    ) : ''
                }
                {
                    upcomingActivities[0]?._id ? upcomingActivities.map(activity =>
                        <Marker
                            onPress={() => selectedBuildingHandler(activity.building_code)}
                            key={activity._id}
                            coordinate={{
                                latitude:activity?.latitude !== undefined ? JSON.parse(activity?.latitude) : '',
                                longitude:activity?.longitude !== undefined ? JSON.parse(activity?.longitude) : ''
                            }}
                            pinColor='orange'
                            title={`${activity.building_code} (${activity.buildingComponentsLength})`}
                        />
                    ) : ''
                }
                {
                    allBuildings[0]._id ? allBuildings.map(building =>
                        <Marker
                            onPress={() => selectedBuildingHandler(building.building_code)}
                            key={building._id}
                            coordinate={{
                                latitude:building?.latitude !== undefined ? JSON.parse(building?.latitude) : '',
                                longitude:building?.longitude !== undefined ? JSON.parse(building?.longitude) : ''
                            }}
                            pinColor='blue'
                            title={`${building.building_code} (${building.buildingComponentsLength})`}
                        />
                    ) : ''
                }
            </MapView>
            {selectedBuildingComponent?.building_code ?
                <Animated.View style={[styles.itemContent, {opacity:fadeAnim, backgroundColor:dark ? '#333F50' : '#F5F5F5'}]}>
                        <View style={styles.upperArea}>
                                <View style={styles.upperOne}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Image source={require('../assets/images/TaskDark.png')} style={{height:25, width:25}}/>
                                                <Text style={{color:'#fff'}}>
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
                                            </View>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Image source={require('../assets/images/DateDark.png')} style={{height:25, width:25}}/>
                                                <Text style={{color:'#fff'}}>
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
                                </View>
                                <View style={styles.upperTwo}>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Image source={require('../assets/images/SettingsDark.png')} style={{height:25, width:25}}/>
                                                <Text style={{color:'#fff'}}>{selectedBuildingComponent?.name}</Text>
                                            </View>
                                            <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <Image source={require('../assets/images/BarcodeDark.png')} style={{height:25, width:25}}/>
                                                <Text style={{color:'#fff'}}>{`${selectedBuildingComponent?.component_code} ${setOfComponents.length > 1 ? `(${setOfComponents.indexOf(selectedBuildingComponent) + 1})` : ''}`}</Text>
                                            </View>
                                </View>
                                <View style={styles.upperThree}>
                                            <Pressable style={[styles.detailsButton, {
                                                backgroundColor:dark ? '#000' : '#D9D9D9',
                                                borderColor:dark ? '#35C7FB' : '#000'
                                                }]} onPress={() => activityRegisrtyOpener(selectedBuildingComponent?.component_code)}
                                            >
                                                {
                                                    dark
                                                    ? <Image source={require('../assets/images/ArrowForwardDark.png')} style={{height:25, width:25}}/>
                                                    : <Image source={require('../assets/images/ArrowForward.png')} style={{height:25, width:25}}/>
                                                }
                                            </Pressable>
                                </View>
                        </View>
                        <View style={styles.lowerArea}>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center', width:280}}>
                                            <Image source={require('../assets/images/HomeDark.png')} style={{height:25, width:25}}/>
                                            <Text style={{color:'#fff'}}>{selectedBuildingComponent?.building_code} {selectedBuildingComponent?.position_of_code}</Text>
                                        </View>
                                        {
                                            setOfComponents.length > 1
                                            ? <View style={styles.swipeButtonContainer}>
                                                <Pressable onPress={leftswipeHandler}>
                                                    <Image source={require('../assets/images/LeftNearMe.png')} style={styles.swipeImage}/>
                                                </Pressable>
                                                <Pressable onPress={rightswipeHandler}>
                                                    <Image source={require('../assets/images/RightNearMe.png')} style={[styles.swipeImage, {marginLeft:20}]}/>
                                                </Pressable>
                                            </View>
                                            : ''
                                        }
                        </View>
                </Animated.View> :
                <View style={[styles.itemContent, {backgroundColor:dark ? '#333F50' : '#fff'}]}>
                    <Text style={{color:theme.text, fontFamily:theme.font}}>Building has no components</Text>
                </View>
            }
        </Modal>
    )
};


// Styles
const styles = StyleSheet.create({
    topbar:{
        height:70,
        width:'100%',
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
    map:{
        width:'100%',
        height:'100%',
    },
    itemContent:{
        bottom:20,
        width:'100%',
        display:'flex',
        borderRadius:5,
        borderTopWidth:2,
        paddingVertical:20,
        alignItems:'center',
        borderBottomWidth:2,
        position:'absolute',
        paddingHorizontal:30,
        borderColor:'#35c7fb',
        backgroundColor:'#333f50',
        justifyContent:'space-between'
    },
    upperArea:{
        flex:2,
        width:'100%',
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    lowerArea:{
        flex:1,
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    swipeButtonContainer:{
        marginTop:20,
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
    },
    detailsButton:{
        width:50,
        height:50,
        borderWidth:1,
        display:'flex',
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center',
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
    image:{
        width:50,
        height:50,
        marginTop:20
    },
    swipeImage:{
        width:35,
        height:35
    }
});


// Export
export default NearMe;