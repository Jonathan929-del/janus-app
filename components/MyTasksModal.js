// Imports
import axios from 'axios';
import moment from 'moment';
import LoadingIcon from './LoadingIcon';
import {useEffect, useState} from 'react';
import ActivityRegistry from './ActivityRegistry';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Pressable, ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';


// Main Function
const MyTasksModal = ({isMyTasksOpened, setIsMyTasksOpened}) => {


    // Selcted sorting method
    const [sortMethod, setSortMethod] = useState('week');
    const sortMethodHandler = method => {
        setSortMethod(method);
        setCheckedList([]);
    };


    // Checking checkbox
    const [checkedList, setCheckedList] = useState([]);
    const allCheckHandler = () => {
        if(checkedList.includes('all')){
            setCheckedList([]);
        }else{
            const ids = components.map(component => component.component_code);
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


    // Cancel handler
    const cancelHandler = () => {
        setIsMyTasksOpened(false);
    };


    // Fetching components
    const [components, setComponents] = useState();
    const componentsFetcher = async () => {
        try {


            // Request
            const res = await axios.get('https://janus-server-api.herokuapp.com/components/');
            

            // Next sunday
            const today = new Date();
            const first = today.getDate() - today.getDay() + 1;
            const last = first + 6;
            const nextSunday = new Date(today.setDate(last));
            const weekComponents = res.data.filter(component => {
                return new Date(component.maintenance_next_date) < nextSunday || new Date(component.attendance_next_date) < nextSunday;
            });
            
            
            // Next month
            const day = new Date();
            const lastDayOfMonth = new Date(day.getFullYear(), day.getMonth()+1, 0);
            const monthComponents = res.data.filter(component => {
                return new Date(component.maintenance_next_date) < lastDayOfMonth || new Date(component.attendance_next_date) < lastDayOfMonth;
            });


            // Setting components
            setComponents(sortMethod === 'week' ? weekComponents : monthComponents);
        } catch (err) {
            console.log(err);
        }
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
            setComponents(components.filter(component => checkedList.map(listItem => listItem.component_code !== component.component_code)));
            setCheckedList([]);
        } catch (err) {
            console.log(err);
        };
    };


    // Use effect
    useEffect(() => {
        componentsFetcher();
        setRequests(checkedList.map(id => {
            let today = new Date();
            let nextDate =  new Date();
            nextDate.setDate(today.getDate() + 183);
            let attendanceNextDate = new Date();
            attendanceNextDate.setDate(today.getDate() + 30);
            const req = {
                deleteLink:`https://janus-server-api.herokuapp.com/notifications/${id}`,
                updateLink:`https://janus-server-api.herokuapp.com/components/component-code/${id}`,
                input:{
                    maintenance_lastest_date:today,
                    maintenance_next_date:nextDate,
                    attendance_lastest_date:today,
                    attendance_next_date:attendanceNextDate
                }
            };
            return (req);
        }));
    }, [isActivityRegistryOpened, checkedList, sortMethod]);


    return (
        <Modal visible={isMyTasksOpened} animationType='slide'>
            <ActivityRegistry
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
                componentName={componentName}
            />
            <View style={styles.topbar}>
                <Pressable onPress={() => setIsMyTasksOpened(false)}>
                    <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
                </Pressable>
                <Text style={styles.header}>My Tasks</Text>
            </View>
            <View style={styles.upperBar}>
                <View style={styles.checkBoxContainer}>
                    <TouchableOpacity style={styles.checkbox} onPress={allCheckHandler}>{checkedList.includes('all') && <IonIcon name='checkmark' size={20}/>}</TouchableOpacity>
                    {checkedList.length > 0 && <Text style={{marginLeft:5}}>{checkedList.length}</Text>}
                </View>
                <View style={styles.upperBarRightSection}>
                    <View style={styles.textsContainer}>
                        <Text style={{textDecorationLine:sortMethod === 'week' ? 'underline' : 'none'}}>Week</Text>
                        <Switch
                            trackColor={{false:"#767577", true:"#767577"}}
                            thumbColor="#f4f3f4"
                            value={sortMethod === 'month' ? true : false}
                            onValueChange={() => sortMethodHandler(sortMethod === 'week' ? 'month' : 'week')}
                        />
                        <Text style={{textDecorationLine:sortMethod === 'month' ? 'underline' : 'none'}}>Month</Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                <View style={styles.mainItemsContainer}>
                    {components ? components[0].component_code ? components.map(component => 
                        <View style={styles.item} key={component._id}>
                            <TouchableOpacity style={styles.checkbox} onPress={() => itemCheckHandler(component.component_code)}>
                                {checkedList.includes(component.component_code) && <IonIcon name='checkmark' size={20}/>}
                            </TouchableOpacity>
                            <View style={styles.itemContent}>
                                <View>
                                    <Text>{component.building_code}</Text>
                                    <Text>{component.component_code}</Text>
                                    <Text>
                                        {
                                            component?.maintenance_next_date !== undefined
                                                ? component?.attendance_next_date !== undefined
                                                    ?
                                                        new Date(component?.maintenance_next_date) <= new Date(component?.attendance_next_date)
                                                            ? 'Skötsel'
                                                            : 'Tillsyn'
                                                    : 'Skötsel'
                                                : component?.attendance_next_date !== undefined
                                                    ? 'Tillsyn'
                                                    : ''
                                        }
                                    </Text>
                                    <Text>{component.name}</Text>
                                    <Text>
                                        {component?.maintenance_next_date !== undefined
                                        ? component?.attendance_next_date !== undefined
                                            ?
                                                new Date(component?.maintenance_next_date) <= new Date(component?.attendance_next_date)
                                                    ? moment(component?.maintenance_next_date).format('YYYY-MM-DD')
                                                    : moment(component?.attendance_next_date).format('YYYY-MM-DD')
                                            : moment(component?.maintenance_next_date).format('YYYY-MM-DD')
                                        : component?.attendance_next_date !== undefined
                                            ? moment(component?.attendance_next_date).format('YYYY-MM-DD')
                                            : ''
                                        }
                                    </Text>
                                </View>
                                <Pressable style={styles.detailsButton} onPress={() => activityRegistryOpener(component.component_code)}>
                                    <Text style={styles.buttonText}>Details</Text>
                                    <IonIcon name='arrow-forward' style={styles.detailsIcon} />
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
export default MyTasksModal;