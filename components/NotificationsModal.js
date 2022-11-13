// Imports
import axios from 'axios';
import moment from 'moment';
import LoadingIcon from './LoadingIcon';
import {useEffect, useState} from 'react';
import ActivityRegistry from './ActivityRegistry';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Pressable, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';


// Main Function
const NotificationsModal = ({isNotificationsOpened, setIsNotificationsOpened}) => {


    // Selcted sorting method
    const [sortMethod, setSortMethod] = useState('building');
    const [sortDirection, setSortDirection] = useState('des');


    // Checking checkbox
    const [checkedList, setCheckedList] = useState([]);
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
            const res = await axios.get('https://janus-server-api.herokuapp.com/notifications/');
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
    const saveHandler = async () => {
        try {
            axios.all(
                requests.map(request => {
                    axios.put(request.updateLink, request.input);
                    axios.delete(request.deleteLink);
                })
            );
            setNotifications(notifications.filter(notification => checkedList.map(listItem => listItem.component_code !== notification.component_code)));
            setCheckedList([]);
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
                deleteLink:`https://janus-server-api.herokuapp.com/notifications/${id}`,
                updateLink:`https://janus-server-api.herokuapp.com/components/component-code/${id}`,
                input:{
                    maintenance_lastest_date:today,
                    maintenance_next_date:nextDate
                }
            };
            return (req);
        }));
    }, [isActivityRegistryOpened, checkedList, sortDirection, sortMethod]);


    return (
        <Modal visible={isNotificationsOpened} animationType='slide'>
            <ActivityRegistry
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
                componentName={componentName}
            />
            <View style={styles.topbar}>
                <Pressable onPress={() => setIsNotificationsOpened(false)}>
                    <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
                </Pressable>
                <Text style={styles.header}>Notifications</Text>
            </View>
            <View style={styles.upperBar}>
                <View style={styles.checkBoxContainer}>
                    <TouchableOpacity style={styles.checkbox} onPress={allCheckHandler}>{checkedList.includes('all') && <IonIcon name='checkmark' size={20}/>}</TouchableOpacity>
                    {checkedList.length > 0 && <Text style={{marginLeft:5}}>{checkedList.length}</Text>}
                </View>
                <View style={styles.upperBarRightSection}>
                    <View style={styles.textsContainer}>
                        <Pressable onPress={() => setSortMethod('building')}>
                            <Text style={{textDecorationLine:sortMethod === 'building' ? 'underline' : 'none'}}>Building</Text>
                        </Pressable>
                        <Text>/</Text>
                        <Pressable onPress={() => setSortMethod('date')}>
                            <Text style={{textDecorationLine:sortMethod === 'date' ? 'underline' : 'none'}}>Date</Text>
                        </Pressable>
                    </View>
                    {sortDirection === 'asc' ?
                            <TouchableOpacity onPress={() => setSortDirection('des')}>
                                <Image source={require('../assets/images/AscendingSort.png')} style={styles.sortImg}/>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity onPress={() => setSortDirection('asc')}>
                                <Image source={require('../assets/images/Sort.png')} style={styles.sortImg}/>
                            </TouchableOpacity>
                    }
                </View>
            </View>
            <ScrollView>
                <View style={styles.mainItemsContainer}>
                    {notifications && notifications[0] ? notifications[0][0].component_code ? notifications.map(notification => 
                        <View style={styles.item} key={notification[0]._id}>
                            <TouchableOpacity style={styles.checkbox} onPress={() => itemCheckHandler(notification[0].component_code)}>
                                {checkedList.includes(notification[0].component_code) && <IonIcon name='checkmark' size={20}/>}
                            </TouchableOpacity>
                            <View style={styles.itemContent}>
                                <View>
                                    <Text>{notification[0].building_code}</Text>
                                    <Text>{notification[0].component_code}</Text>
                                    <Text>
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
                                    <Text>{notification[0].name}</Text>
                                    <Text>
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
                                <Pressable style={styles.detailsButton} onPress={() => activityRegistryOpener(notification[0].component_code)}>
                                    <Text style={styles.buttonText}>Details</Text>
                                    <IonIcon name='arrow-forward' style={styles.detailsIcon}/>
                                </Pressable>
                            </View>
                        </View>
                    ) : <View style={styles.loadingIconContainer}>
                            <LoadingIcon />
                        </View>
                        : <View style={styles.loadingIconContainer}>
                            <Text>No Tasks To Show</Text>
                        </View>
                    }
                </View>
            </ScrollView>
            <View style={styles.bottomNav}>
                    <Pressable style={styles.cancel} onPress={cancelHandler}>
                        <Text style={styles.cancelText}>cancel</Text>
                    </Pressable>
                    <Pressable style={styles.save} onPress={saveHandler}>
                        <Text style={styles.saveText}>Save</Text>
                    </Pressable>
                </View>
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
    upperBar:{
        width:'100%',
        display:'flex',
        paddingVertical:10,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:2,
        paddingHorizontal:30,
        borderBottomColor:'#000',
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
        width:30
    },
    arrowBackIcon:{
        fontSize:30,
        marginLeft:15
    },
    checkbox:{
        width:30,
        height:30,
        borderWidth:1,
        borderRadius:5,
        display:'flex',
        borderColor:'#000',
        alignItems:'center',
        backgroundColor:'#ccc',
        justifyContent:'center',
    },
    header:{
        fontSize:20,
        marginLeft:10
    },
    mainItemsContainer:{
        marginBottom:70
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
        borderWidth:1,
        display:'flex',
        borderColor:'#000',
        paddingVertical:10,
        alignItems:'center',
        flexDirection:'row',
        paddingHorizontal:30,
        backgroundColor:'#eee',
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
        height:70,
        bottom:0,
        width:'100%',
        display:'flex',
        borderTopWidth:1,
        flexDirection:'row',
        alignItems:'center',
        position:'absolute',
        borderTopColor:'#000',
        backgroundColor:'#fff',
        justifyContent:'space-between'
    },
    save:{
        width:'47%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    cancel:{
        width:'47%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    saveText:{
        fontSize:18,
        color:'#0d80e7'
    },
    cancelText:{
        fontSize:18
    },
    loadingIconContainer:{
        width:'100%',
        marginTop:50,
        display:'flex',
        alignItems:'center'
    }
});


// Export
export default NotificationsModal;