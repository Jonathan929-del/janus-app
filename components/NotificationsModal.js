// Imports
import axios from 'axios';
import moment from 'moment';
import LoadingIcon from './LoadingIcon';
import {useEffect, useState, useRef} from 'react';
import ActivityRegistry from './ActivityRegistry';
import {useTheme} from '../src/theme/themeProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Pressable, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Animated} from 'react-native';


// Main Function
const NotificationsModal = ({isNotificationsOpened, setIsNotificationsOpened}) => {
    
    
    const {dark, theme} = useTheme();
    
    
    // Selcted sorting method
    const [sortMethod, setSortMethod] = useState('building');
    const [sortDirection, setSortDirection] = useState('des');
    
    
    // Checking checkbox
    const [checkedList, setCheckedList] = useState([]);
    const [fadingItems, setFadingItems] = useState([]);
    const allCheckHandler = () => {
        if(checkedList.includes('all')){
            setCheckedList([]);
        }else{
            const ids = notifications.map(notification => notification[0].component_code);
            setCheckedList([...ids, 'all']);
        };
    };
    const itemCheckHandler = id => {
        if(checkedList.includes(id)){
            setCheckedList(checkedList.filter(item => item !== id));
        }else{
            setCheckedList([...checkedList, id]);
        };
    };


    // Fetching tasks
    const [notifications, setNotifications] = useState();
    const notificationsFetcher = async () => {
        try {
            const res = await axios.get('https://janus-backend-api.herokuapp.com/notifications/');
            const presentNotifications = res.data.filter(notification => notification[0]?.building_code !== undefined);
            if(sortMethod === 'building' && sortDirection === 'des'){
                setNotifications(presentNotifications.sort((a, b) =>{
                    return JSON.parse(b[0].building_code) - JSON.parse(a[0].building_code);
                }));
            }else if(sortMethod === 'building' && sortDirection === 'asc'){
                setNotifications(presentNotifications.sort((a, b) =>{
                    return JSON.parse(a[0].building_code) - JSON.parse(b[0].building_code);
                }));
            }else if(sortMethod === 'date' && sortDirection === 'des'){
                setNotifications(presentNotifications.sort((a, b) =>{
                    return new Date(b[0].maintenance_next_date) - new Date(a[0].maintenance_next_date);
                }));
            }else if(sortMethod === 'date' && sortDirection === 'asc'){
                setNotifications(presentNotifications.sort((a, b) =>{
                    return new Date(a[0].maintenance_next_date) - new Date(b[0].maintenance_next_date);
                }));
            }
        } catch (err) {
            console.log(err);
        }
    };


    // Cancel handler
    const cancelHandler = () => {
        setIsNotificationsOpened(false);
    };

    
    // Opening activity registry
    const [isActivityRegistryOpened, setIsActivityRegistryOpened] = useState(false);
    const [componentName, setComponentName] = useState('');
    const activityRegistryOpener = code => {
        setComponentName(code);
        setIsActivityRegistryOpened(true);
    };
    
    
    // Save handler
    const [requests, setRequests] = useState([]);
    const translateAnim = useRef(new Animated.Value(0)).current;
    const translate = () => {
        Animated.timing(translateAnim, {
            toValue:-2000,
            duration:1500,
            useNativeDriver:true
        }).start();
        setTimeout(() => {
            Animated.timing(translateAnim, {
                toValue:0,
                duration:1500,
                useNativeDriver:true
            }).start();
        }, 2000);
    };
    const saveHandler = async () => {
        try {
            setFadingItems(checkedList);
            translate();
            setTimeout(() => {
                setNotifications(notifications.filter(notification => checkedList.map(listItem => listItem.component_code !== notification.component_code)));
                axios.all(
                    requests.map(request => {
                        axios.put(request.updateLink, request.input);
                        axios.delete(request.deleteLink);
                    })
                );
                setCheckedList([]);
                setFadingItems([]);
            }, 0);
        } catch (err) {
            console.log(err);
        };
    };


    // Use effect
    useEffect(() => {
        notificationsFetcher();
        setRequests(checkedList.map(id => {
            let today = new Date();
            let nextDate =  new Date();
            nextDate.setDate(today.getDate() + 183);
            const req = {
                deleteLink:`https://janus-backend-api.herokuapp.com/notifications/${id}`,
                updateLink:`https://janus-backend-api.herokuapp.com/components/component-code/${id}`,
                input:{
                    maintenance_lastest_date:today,
                    maintenance_next_date:nextDate
                }
            };
            return (req);
        }));
    }, [isActivityRegistryOpened, sortDirection, sortMethod, checkedList]);


    return (
        <Modal visible={isNotificationsOpened} animationType='slide' style={{backgroundColor:theme.screenBackground}}>
            <ActivityRegistry
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
                componentName={componentName}
            />
            <View style={[styles.upperBar, {backgroundColor:theme.screenBackground, borderColor:theme.text}]}>
                <View style={styles.checkBoxContainer}>
                    <TouchableOpacity style={[styles.checkbox, {borderColor:theme.text}]} onPress={allCheckHandler}>{checkedList.includes('all') && <IonIcon name='checkmark' size={20} color={theme.text}/>}</TouchableOpacity>
                    {checkedList.length > 0 && <Text style={{marginLeft:5, color:theme.text, fontFamily:theme.font}}>{checkedList.length}</Text>}
                </View>
                <View style={styles.upperBarRightSection}>
                    <View style={styles.textsContainer}>
                        <Pressable onPress={() => setSortMethod('building')}>
                            <Text style={{textDecorationLine:sortMethod === 'building' ? 'underline' : 'none', color:theme.text, fontFamily:theme.font}}>Building</Text>
                        </Pressable>
                        <Text style={{color:theme.text}}>/</Text>
                        <Pressable onPress={() => setSortMethod('date')}>
                            <Text style={{textDecorationLine:sortMethod === 'date' ? 'underline' : 'none', color:theme.text, fontFamily:theme.font}}>Date</Text>
                        </Pressable>
                    </View>
                    <TouchableOpacity onPress={() => setSortDirection('asc')}>
                        {
                            dark
                            ? <Image source={require('../assets/images/SortDark.png')} style={styles.sortImg}/>
                            : <Image source={require('../assets/images/Sort.png')} style={styles.sortImg}/>
                        }
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View style={[styles.mainItemsContainer, {backgroundColor:theme.screenBackground}]}>
                    {notifications && notifications[0] ? notifications[0][0].component_code ? notifications.map(notification => 
                        <Animated.View
                            style={[styles.item, {
                                backgroundColor:dark ? '#333F50' : '#F5F5F5',
                                borderColor:dark ? '#35C7FB' : '#000',
                                transform:[{translateX:fadingItems.includes(notification[0].component_code) ? translateAnim : 0}]
                            }]}
                            key={notification[0]._id}
                        >
                            <TouchableOpacity style={[styles.checkbox, {borderColor:dark ? '#35C7FB' : '#000'}]} onPress={() => itemCheckHandler(notification[0].component_code)}>
                                {checkedList.includes(notification[0].component_code) && <IonIcon name='checkmark' size={20} color={dark ? '#35C7FB' : '#000'}/>}
                            </TouchableOpacity>
                            <View style={styles.itemContent}>
                                <View>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginVertical:5}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/TaskDark.png')} style={{width:30, height:30}}/>
                                            : <Image source={require('../assets/images/Task.png')} style={{width:30, height:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>
                                            {
                                                notification[0]?.maintenance_next_date !== undefined
                                                    ? notification[0]?.attendance_next_date !== undefined
                                                        ?
                                                            new Date(notification[0]?.maintenance_next_date) <= new Date(notification[0]?.attendance_next_date)
                                                                ? 'Skötsel'
                                                                : 'Tillsyn'
                                                        : 'Skötsel'
                                                    : notification[0]?.attendance_next_date !== undefined
                                                        ? 'Tillsyn'
                                                        : ''
                                            }
                                        </Text>
                                    </View>
                                    <View style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/DateDark.png')} style={{width:30, height:30}}/>
                                            : <Image source={require('../assets/images/Date.png')} style={{width:30, height:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>
                                            {notification[0]?.maintenance_next_date !== undefined
                                                ? notification[0]?.attendance_next_date !== undefined
                                                    ?
                                                        new Date(notification[0]?.maintenance_next_date) <= new Date(notification[0]?.attendance_next_date)
                                                            ? moment(notification[0]?.maintenance_next_date).format('YYYY-MM-DD')
                                                            : moment(notification[0]?.attendance_next_date).format('YYYY-MM-DD')
                                                    : moment(notification[0]?.maintenance_next_date).format('YYYY-MM-DD')
                                                : notification[0]?.attendance_next_date !== undefined
                                                    ? moment(notification[0]?.attendance_next_date).format('YYYY-MM-DD')
                                                    : ''
                                            }
                                        </Text>
                                    </View>
                                    <View style={{display:'flex', alignItems:'center', flexDirection:'row', marginVertical:5}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/HomeDark.png')} style={{width:30, height:30}}/>
                                            : <Image source={require('../assets/images/Home.png')} style={{width:30, height:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>{notification[0].building_code} {notification[0].name}</Text>
                                    </View>
                                </View>
                                <Pressable style={[styles.iconContainer, {
                                        backgroundColor:dark ? '#000' : '#D9D9D9',
                                        borderColor:dark ? '#35C7FB' : '#000'
                                    }]}
                                    onPress={() => activityRegistryOpener(notification[0].component_code)}
                                >
                                    {
                                        dark
                                        ? <Image source={require('../assets/images/ArrowForwardDark.png')} style={{height:25, width:25}}/>
                                        : <Image source={require('../assets/images/ArrowForward.png')} style={{height:25, width:25}}/>
                                    }
                                </Pressable>
                            </View>
                        </Animated.View>
                    ) : <View style={styles.loadingIconContainer}>
                            <LoadingIcon />
                        </View>
                        : <View style={styles.loadingIconContainer}>
                            <Text style={{fontFamily:theme.font, color:theme.color}}>No Tasks To Show</Text>
                        </View>
                    }
                </View>
            </ScrollView>
            <View style={[styles.bottomNav, {backgroundColor:theme.screenBackground, justifyContent:checkedList.length > 0 ? 'space-between' : 'center'}]}>
                {
                    checkedList.length > 0 &&
                    <Pressable style={styles.save} onPress={saveHandler}>
                        <Text style={[styles.saveText, {fontFamily:theme.font}]}>Save</Text>
                    </Pressable>
                }
                <Pressable style={[styles.cancel, {backgroundColor:dark ? '#fff' : 'unset'}]} onPress={cancelHandler}>
                    <Text style={[styles.cancelText, {fontFamily:theme.font}]}>cancel</Text>
                </Pressable>
            </View>
        </Modal>
    )
};


// Styles
const styles = StyleSheet.create({
    upperBar:{
        width:'100%',
        display:'flex',
        paddingVertical:5,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:2,
        borderTopWidth:2,
        paddingHorizontal:30,
        justifyContent:'space-between'
    },
    upperBarRightSection:{
        display:'flex',
        alignItems:'center',
        flexDirection:'row'
    },
    textsContainer:{
        marginRight:20,
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
    },
    sortImg:{
        width:50,
        height:50
    },
    checkbox:{
        width:30,
        height:30,
        borderWidth:2,
        borderRadius:5,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'transparent'
    },
    mainItemsContainer:{
        paddingTop:20,
        marginBottom:70,
        paddingBottom:70
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
    item:{
        width:'100%',
        borderTopWidth:2,
        borderBottomWidth:2,
        display:'flex',
        borderRadius:5,
        marginVertical:3,
        paddingLeft:46,
        alignItems:'center',
        flexDirection:'row',
        paddingHorizontal:30,
        justifyContent:'center'
    },
    itemContent:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:30,
        justifyContent:'space-between',
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
    checkBoxContainer:{
        width:50,
        display:'flex',
        alignItems:'center',
        flexDirection:'row'
    },
    bottomNav:{
        left:0,
        bottom:0,
        height:130,
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        position:'absolute',
    },
    save:{
        width:'40%',
        marginLeft:20,
        display:'flex',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ED7D31'
    },
    cancel:{
        width:'40%',
        display:'flex',
        alignItems:'center',
        borderRadius:10,
        borderWidth:2,
        marginRight:20,
        borderColor:'#ED7D31',
        justifyContent:'center'
    },
    saveText:{
        fontSize:18,
        color:'#fff',
        paddingVertical:10,
    },
    cancelText:{
        fontSize:18,
        color:'#ED7D31',
        paddingVertical:10
    },
    loadingIconContainer:{
        width:'100%',
        marginTop:50,
        display:'flex',
        alignItems:'center'
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
});


// Export
export default NotificationsModal;