// Imports
import axios from 'axios';
import moment from 'moment';
import LoadingIcon from './LoadingIcon';
import {useEffect, useState, useRef} from 'react';
import ActivityRegistry from './ActivityRegistry';
import {useTheme} from '../src/theme/themeProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Pressable, ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch, Image, Animated} from 'react-native';


// Main Function
const MyTasksModal = ({isMyTasksOpened, setIsMyTasksOpened}) => {


    // Theme
    const {dark, theme} = useTheme();


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
            const res = await axios.get('https://janus-backend-api.herokuapp.com/components/');
            

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
    const [fadingItems, setFadingItems] = useState([]);
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
                const res = axios.all(
                    requests.map(request => {
                        axios.put(request.updateLink, request.input);
                        axios.delete(request.deleteLink);
                    })
                );
                setComponents(components.filter(component => checkedList.map(listItem => listItem.component_code !== component.component_code)));
                setCheckedList([]);
                setFadingItems([]);
            }, 0);
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
                deleteLink:`https://janus-backend-api.herokuapp.com/notifications/${id}`,
                updateLink:`https://janus-backend-api.herokuapp.com/components/component-code/${id}`,
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

    console.log(typeof(checkedList[0]));


    return (
        <Modal visible={isMyTasksOpened} animationType='slide' style={{backgroundColor:theme.screenBackground}}>
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
                        <Text style={{textDecorationLine:sortMethod === 'week' ? 'underline' : 'none', color:theme.text, fontFamily:theme.font}}>Week</Text>
                        <Switch
                            trackColor={{false:"#767577", true:"#767577"}}
                            thumbColor="#f4f3f4"
                            value={sortMethod === 'month' ? true : false}
                            onValueChange={() => sortMethodHandler(sortMethod === 'week' ? 'month' : 'week')}
                        />
                        <Text style={{textDecorationLine:sortMethod === 'month' ? 'underline' : 'none', color:theme.text, fontFamily:theme.font}}>Month</Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                <View style={[styles.mainItemsContainer, {backgroundColor:theme.screenBackground}]}>
                    {components ? components[0].component_code ? components.map(component => 
                        <Animated.View style={[styles.item, {
                            backgroundColor:dark ? '#333F50' : '#F5F5F5',
                            borderColor:dark ? '#35C7FB' : '#000',
                            transform:[{translateX:fadingItems.includes(component.component_code) ? translateAnim : 0}]
                        }]} key={component._id}>
                            <TouchableOpacity style={[styles.checkbox, {borderColor:dark ? '#35C7FB' : '#000'}]} onPress={() => itemCheckHandler(component.component_code)}>
                                {checkedList.includes(component.component_code) && <IonIcon name='checkmark' size={20} color={dark ? '#35C7FB' : '#000'}/>}
                            </TouchableOpacity>
                            <View style={styles.itemContent}>
                                <View>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/TaskDark.png')} style={{height:30, width:30}}/>
                                            : <Image source={require('../assets/images/Task.png')} style={{height:30, width:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>
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
                                    </View>
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/DateDark.png')} style={{height:30, width:30}}/>
                                            : <Image source={require('../assets/images/Date.png')} style={{height:30, width:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>
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
                                    <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/HomeDark.png')} style={{height:30, width:30}}/>
                                            : <Image source={require('../assets/images/Home.png')} style={{height:30, width:30}}/>
                                        }
                                        <Text style={{color:theme.text, fontFamily:theme.font}}>{component.building_code} {component.name}</Text>
                                    </View>
                                </View>
                                <Pressable style={[styles.iconContainer, {
                                        backgroundColor:dark ? '#000' : '#D9D9D9',
                                        borderColor:dark ? '#35C7FB' : '#000'
                                    }]} onPress={() => activityRegistryOpener(component.component_code)}>
                                        {
                                            dark
                                            ? <Image source={require('../assets/images/ArrowForwardDark.png')} style={{width:25, height:25}}/>
                                            : <Image source={require('../assets/images/ArrowForward.png')} style={{width:25, height:25}}/>
                                        }
                                </Pressable>
                            </View>
                        </Animated.View>
                    ) : <View style={styles.loadingIconContainer}>
                            <LoadingIcon />
                        </View>
                        : <View style={styles.loadingIconContainer}>
                            <Text style={{fontFamily:theme.font}}>No Tasks To Show</Text>
                        </View>
                    }
                </View>
            </ScrollView>
            <View style={[styles.bottomNav, {backgroundColor:theme.screenBackground, justifyContent:checkedList.length > 0 ? 'space-between' : 'center'}]}>
                    {checkedList.length > 0 &&
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
        paddingHorizontal:20,
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
        borderRadius:5,
        marginVertical:3,
        borderTopWidth:2,
        paddingVertical:10,
        borderBottomWidth:2,
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
        position:'absolute'
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
export default MyTasksModal;