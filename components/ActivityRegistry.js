// Imports
import axios from 'axios';
import moment from 'moment';
import Texts from './Texts';
import Camera from './Camera';
import {useState, useEffect} from 'react';
import ActivityCamera from './ActivityCamera';
import {useTheme} from '../src/theme/themeProvider';
import {Modal, Text, StyleSheet, View, Pressable, TextInput, TouchableOpacity, ScrollView,  Image, SafeAreaView} from 'react-native';


// Main Function
const ActivityRegistry = ({componentName, isActivityRegistryOpened, setIsActivityRegistryOpened, isActivityPreview, setIsActivityPreview, selectedActivity}) => {


    // Theme
    const {dark, theme} = useTheme();


    // Form
    const [image, setImage] = useState('');
    const [component, setComponent] = useState({});
    const [description, setDescription] = useState('');
    const [componentCode, setComponentCode] = useState('');
    const [selectedTask, setSelectedTask] = useState(isActivityPreview ? selectedActivity?.activity : 'Tillsyn');
    const [signature, setSignature] = useState('');
    const descriptionHandler = text => {
        setDescription(text);
    }
    const taskToggler = task => {
        setSelectedTask(isActivityPreview ? selectedActivity?.activity : task);
    }
    const componentCodeFieldHandler = text => {
        setComponentCode(text);
    }


    // Qrcode reading
    const [scanned, setScanned] = useState(false);
    const [isCameraOpened, setIsCameraOpened] = useState(false);
    const handleBarCodeScanned = async ({type, data}) => {
        setScanned(true);
        setIsCameraOpened(false);
        const component_code = data.substring(1);
        try {
            const res = await axios.get(`https://janus-backend-api.herokuapp.com/components/component/${component_code}`);
            setComponent(res.data);
            setComponentCode((res.data.component_code));
        } catch (err) {
            console.log(err);
        }
    };
    const cameraOpener = () => {
        setScanned(false);
        setSelectedTask('Tillsyn');
        setComponentCode('');
        setDescription('');
        setComponent({});
        setIsCameraOpened(true);
    };


    // Posting activity
    const activityPoster = async () => {
        try {


            // Creating random number
            const randomNumber = Math.floor(Math.random() * 1000000);


            // Posting activity
            const input = {
                date:new Date(),
                user:signature,
                description:description,
                activity:selectedTask,
                work_order:'',
                time:new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
                article_number:'',
                quantaty:'',
                remark:'',
                time_minutes:'',
                material_coast:'',
                longitude:'',
                latitude:'',
                building:component.building_code,
                property:component.property_code,
                component:component.component_code,
                unique_index_component:'',
                changed_by:'',
                change_date:'',
                img:JSON.stringify(randomNumber)
            }
            const res = await axios.post('https://janus-backend-api.herokuapp.com/activities', input);
            console.log(res.data);


            // Uploading image
            const base64Img = `data:image/jpg;base64,${capturedImage.base64}`;
            const apiUrl = 'https://api.cloudinary.com/v1_1/dzn4fecpr/image/upload';
            const data = {
                file: base64Img,
                upload_preset: 'janus_attendance',
                public_id:JSON.stringify(randomNumber),
                folder:'janus_images'
            };
            fetch(apiUrl,
                {
                    body: JSON.stringify(data),
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'POST'
                }
            ).then(async response => {
                let data = await response.json();
            })
            .catch(err => {
                alert('Cannot upload');
            });
            
            
            // Updating component
            const today = new Date();
            let nextDate =  new Date();
            nextDate.setDate(today.getDate() + 183);
            await axios.put(`https://janus-backend-api.herokuapp.com/components/component-code/${componentName}`, {
                maintenance_lastest_date:today,
                maintenance_next_date:nextDate
            });

            

            // Deleting notification
            await axios.delete(`https://janus-backend-api.herokuapp.com/notifications/${componentName}`);
            

            // Setting off page
            setComponentCode('');
            setDescription('');
            setComponent({});
            setSelectedTask('Tillsyn');
            setIsCameraOpened(false);
            setIsActivityRegistryOpened(false);


        } catch (err) {
            console.log(err);
        }
    };


    // Opening camera
    const [capturedImage, setCapturedImage] = useState('');
    const [isActivityCameraOpened, setIsActivityCameraOpened] = useState(false);


    // Exit button handler
    const exitButtonHandler = () => {
        setCapturedImage('');
        setIsActivityRegistryOpened(false);
        isActivityPreview && setIsActivityPreview(false);
        setSelectedTask('');
    };


    // Use effect
    useEffect(() => {
        const userFetcher = async () => {
            setSelectedTask(isActivityPreview ? selectedActivity?.activity : 'Tillsyn');
            try {
                const res = await axios.get('https://janus-backend-api.herokuapp.com/users');
                setSignature(res.data[0].user);
                const componentRes = await axios.get(`https://janus-backend-api.herokuapp.com/components/component/${componentName}`);
                componentName && setComponent(componentRes.data);
                componentName && setComponentCode((componentRes.data.component_code));
            } catch (err) {
                console.log(err);
            }
        };
        userFetcher();
        const imageFetcher = async () => {
            try {
                const res = await axios.get('https://janus-backend-api.herokuapp.com/images');
                const resource = res.data.resources.filter(resource => resource.filename === selectedActivity.img);
                setImage(resource[0].url);
            } catch (err) {
                console.log(err);
            }
        };
        imageFetcher();
    }, [isActivityPreview, selectedActivity]);


    // Closing form
    const cancelButton = () => {
        setScanned(false);
        setSelectedTask('Tillsyn');
        setComponentCode('');
        setDescription('');
        setComponent({});
        setCapturedImage('');
        isActivityPreview && setIsActivityPreview(false);
        setImage('');
        setIsActivityRegistryOpened(false);
    };


    // Opening texts
    const [isTextsOpened, setIsTextsOpened] = useState(false);


    return (
        <Modal visible={isActivityRegistryOpened} animationType='slide'>
            <Camera
                isCameraOpened={isCameraOpened}
                scanned={scanned}
                setIsCameraOpened={setIsCameraOpened}
                handleBarCodeScanned={handleBarCodeScanned}
                setScanned={setScanned}
            />
            <ActivityCamera
                isActivityCameraOpened={isActivityCameraOpened}
                setIsActivityCameraOpened={setIsActivityCameraOpened}
                setCapturedImage={setCapturedImage}
            />
            <Texts
                isTextsOpened={isTextsOpened}
                setIsTextsOpened={setIsTextsOpened}
                component={component}
            />
            <View style={[styles.container, {backgroundColor:dark ? theme.elementsBackground : '#f5f5f5'}]}>
                {/* {
                    !isActivityPreview &&
                    <View style={[styles.topbar, {backgroundColor:theme.screenBackground, borderColor:theme.text}]}>
                        <Pressable onPress={exitButtonHandler}>
                            <IonIcon name='arrow-back' style={styles.arrowBackIcon} color={theme.text}/>
                        </Pressable>
                        <Text style={[styles.header, {color:theme.text, fontFamily:theme.font}]}>{componentName ? componentName : 'Activity Form'}</Text>
                    </View>
                } */}
                <ScrollView>
                    <View style={[styles.content, {backgroundColor:theme.elementsBackground}]}>
                        {!componentName && <View style={styles.item}>
                            <View style={styles.inputFieldContainer}>
                                <TextInput style={[styles.input, {backgroundColor:'#D9D9D9', borderColor:dark ? '#35C7FB' : '#000', fontFamily:theme.font}]} value={componentCode} onChangeText={e => componentCodeFieldHandler(e)}/>
                                <TouchableOpacity style={[styles.scanButton, {backgroundColor:dark ? '#35C7FB' : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000'}]} onPress={cameraOpener}>
                                    {
                                        dark
                                        ? <Image source={require('../assets/images/RegistryBarcodeDark.png')} style={styles.scanImage}/>
                                        : <Image source={require('../assets/images/RegistryBarcode.png')} style={styles.scanImage}/>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.bookButton, {backgroundColor:dark ? '#000' : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000'}]} onPress={() => setIsTextsOpened(true)}>
                                    {
                                        dark
                                        ? <Image source={require('../assets/images/BookDark.png')} style={styles.scanImage}/>
                                        : <Image source={require('../assets/images/Book.png')} style={styles.scanImage}/>
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>}
                        <View style={[styles.labelItem, {borderColor:dark ? '#35C7FB' : '#000'}]}>
                            <View style={styles.labelFieldContainer}>
                                <Text style={[styles.labelText, {color:theme.text, fontFamily:theme.font}]}>Label:</Text>
                                {
                                    componentName
                                    ? <Text style={[styles.labelContent, {color:theme.text, fontFamily:theme.font}]}>{component?.name}</Text>
                                    : <Text style={[styles.labelContent, {color:'red', fontFamily:theme.font}]}>Component missing.</Text>
                                }
                            </View>
                        </View>
                        <View style={styles.taskItem}>
                            <View style={styles.fieldContainer}>
                                <TouchableOpacity style={selectedTask === 'Tillsyn' ? styles.button : [styles.unSelectedButton, {backgroundColor:dark ? '#000' : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#D9D9D9'}]} onPress={() => taskToggler('Tillsyn')}>
                                    {
                                        selectedTask === 'Tillsyn' &&
                                        <Image source={require('../assets/images/Check.png')} style={{height:20, width:20, top:10, right:10, position:'absolute'}}/>
                                    }
                                    <Text style={selectedTask === 'Tillsyn' ? styles.buttonText : [styles.unSelectedButtonText, {color:dark ? '#35C7FB' : '#333F50', fontFamily:theme.font}]}>
                                        T
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={selectedTask === 'Skötsel' ? styles.button : [styles.unSelectedButton, {backgroundColor:dark ? '#000' : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#D9D9D9'}]} onPress={() => taskToggler('Skötsel')}>
                                    {
                                        selectedTask === 'Skötsel' &&
                                        <Image source={require('../assets/images/Check.png')} style={{height:20, width:20, top:10, right:10, position:'absolute'}}/>
                                    }
                                    <Text style={selectedTask === 'Skötsel' ? styles.buttonText : [styles.unSelectedButtonText, {color:dark ? '#35C7FB' : '#333F50', fontFamily:theme.font}]}>
                                        S
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.dateSignatureContainer}>
                                <View style={styles.inlineItem}>
                                    <Text style={[styles.labelText, {color:theme.text, fontFamily:theme.font}]}>User</Text>
                                    <View style={styles.fieldContainer}>
                                        <TextInput style={[styles.singleInput, {backgroundColor:dark ? theme.elementsBackground : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000', color:dark ? '#fff' : '#000', fontFamily:theme.font}]} value={signature}/>
                                    </View>
                                </View>
                                <View style={styles.inlineItem}>
                                    <Text style={[styles.labelText, {color:theme.text, fontFamily:theme.font}]}>Date</Text>
                                    <View style={styles.fieldContainer}>
                                        <TextInput style={[styles.singleInput, {backgroundColor:dark ? theme.elementsBackground : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000', color:dark ? '#fff' : '#000', fontFamily:theme.font}]} value={isActivityPreview ? moment(selectedActivity.date).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.descItem}>
                            <Text style={[styles.labelText, {color:theme.text, fontFamily:theme.font}]}>Remark:</Text>
                            <View style={styles.fieldContainer}>
                                {
                                    isActivityPreview
                                    ? <TextInput style={[styles.remarkInput, {backgroundColor:dark ? theme.elementsBackground : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000', color:dark ? '#fff' : '#000', fontFamily:theme.font}]} value={selectedActivity.description === undefined ? '' : selectedActivity.description}/>
                                    : <TextInput style={[styles.remarkInput, {backgroundColor:dark ? theme.elementsBackground : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000', color:dark ? '#fff' : '#000', fontFamily:theme.font}]} value={description} onChangeText={e => descriptionHandler(e)}/>
                                }
                            </View>
                        </View>
                        {
                            isActivityPreview
                                ?   <SafeAreaView
                                        style={{height:300, display:'flex', width:'80%', marginTop:30}}
                                    >
                                        <Image
                                            source={{uri:image}}
                                            style={{width:'100%', height:'100%'}}
                                        />
                                    </SafeAreaView>
                                : capturedImage !== ''
                                    ?
                                        <SafeAreaView
                                            style={{height:300, display:'flex', width:'80%', marginTop:30}}
                                        >
                                            <Image
                                                source={{uri:capturedImage?.uri}}
                                                style={{width:'100%', height:'100%'}}
                                            />
                                            <Pressable onPress={() => setCapturedImage('')} style={styles.imageCloseButton}>
                                                <Text>X</Text>
                                            </Pressable>
                                        </SafeAreaView>
                                    :
                                        <Pressable style={styles.item} onPress={() => setIsActivityCameraOpened(true)}>
                                            <Text style={[styles.labelText, {color:theme.text, fontFamily:theme.font}]}>Image</Text>
                                            <View style={[styles.cameraContainer, {backgroundColor:dark ? theme.elementsBackground : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000'}]}>
                                                {
                                                    dark
                                                    ? <Image source={require('../assets/images/CameraDark.png')} style={{height:40, width:40}}/>
                                                    : <Image source={require('../assets/images/Camera.png')} style={{height:40, width:40}}/>
                                                }
                                            </View>
                                        </Pressable>
                        }
                    </View>
                </ScrollView>
                <View style={[styles.bottomNav, {justifyContent:isActivityPreview ? 'center' : componentName !== undefined ? 'space-between' : componentCode !== '' ? 'space-between' : 'center', backgroundColor:dark ? '#000' : '#f5f5f5'}]}>
                    {
                        isActivityPreview
                        ? <>
                            <Pressable style={styles.save} onPress={cancelButton}>
                                <Text style={[styles.saveText, {fontFamily:theme.font}]}>OK</Text>
                            </Pressable>                        
                        </>
                        : <>
                            {
                                componentCode !== ''
                                ?  
                                    <Pressable style={styles.save} onPress={activityPoster}>
                                        <Text style={[styles.saveText, {fontFamily:theme.font}]}>Save</Text>
                                    </Pressable>
                                : componentName !== undefined
                                    ?
                                        <Pressable style={styles.save} onPress={activityPoster}>
                                            <Text style={[styles.saveText, {fontFamily:theme.font}]}>Save</Text>
                                        </Pressable>
                                    : ''
                            }
                            <Pressable style={[styles.cancel, {backgroundColor:dark ? '#fff' : 'unset'}]} onPress={cancelButton}>
                                <Text style={[styles.cancelText, {fontFamily:theme.font}]}>cancel</Text>
                            </Pressable>
                        </>
                    }
                </View>
            </View>
        </Modal>
    )
};


// Styles
const styles = StyleSheet.create({
    topbar:{
        flex:1,
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:2,
    },
    arrowBackIcon:{
        fontSize:30,
        marginLeft:15
    },
    header:{
        fontSize:17,
        marginLeft:10
    },
    dateSignatureContainer:{
        display:'flex',
        flexDirection:'row'
    },
    container:{
        width:'100%',
        height:'100%',
        display:'flex',
        position:'relative'
    },
    content:{
        width:'100%',
        maxWidth:500,
        paddingTop:10,
        display:'flex',
        alignItems:'center',
        backgroundColor:'#f5f5f5'
    },
    labelFieldContainer:{
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
    },
    input:{
        flex:5,
        color:'#000',
        borderWidth:2,
        paddingLeft:15,
        marginRight:10,
        borderRadius:50,
        paddingVertical:10
    },
    singleInput:{
        flex:1,
        color:'#000',
        borderWidth:2,
        borderRadius:5,
        paddingLeft:15,
        marginRight:10,
        paddingVertical:10
    },
    fieldContainer:{
        width:'100%',
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    item:{
        width:'85%',
        marginTop:20
    },
    descItem:{
        width:'85%',
        marginTop:25   
    },
    button:{
        width:'45%',
        display:'flex',
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#35C7FB',
    },
    unSelectedButton:{
        width:'45%',
        display:'flex',
        borderWidth:2,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText:{
        fontSize:30,
        color:'#fff',
        marginVertical:25,
    },
    unSelectedButtonText:{
        fontSize:30,
        marginVertical:25
    },
    cameraContainer:{
        height:100,
        width:'100%',
        borderWidth:2,
        borderRadius:5,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    bottomNav:{
        width:'100%',
        display:'flex',
        borderTopWidth:2,
        borderColor:'#000',
        paddingVertical:20,
        flexDirection:'row',
        alignItems:'center'
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
    labelText:{
        fontSize:18,
        fontWeight:'500'
    },
    labelContent:{
        fontSize:14,
        marginLeft:20,
        color:'#5f6368'
    },
    dateSignatureContainer:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    inlineItem:{
        width:'48%'
    },
    scanButton:{
        flex:1,
        display:'flex',
        borderRadius:5,
        borderWidth:2,
        paddingVertical:10,
        alignItems:'center',
        flexDirection:'row',
        paddingHorizontal:10,
        justifyContent:'center',
    },
    imageCloseButton:{
        top:10,
        right:10,
        borderRadius:50,
        paddingVertical:10,
        paddingHorizontal:15,
        position:'absolute',
        backgroundColor:'#fff'
    },
    scanImage:{
        width:35,
        height:30
    },
    bookButton:{
        flex:1,
        padding:10,
        marginLeft:10,
        borderWidth:2,
        display:'flex',
        borderRadius:50,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    inputFieldContainer:{
        width:'100%',
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'   
    },
    labelItem:{
        width:'80%',
        marginTop:30,
        paddingBottom:15,
        borderBottomWidth:2
    },
    taskItem:{
        width:'85%',
        marginTop:30
    },
    remarkInput:{
        flex:1,
        color:'#000',
        borderWidth:2,
        borderRadius:5,
        paddingLeft:15,
        marginRight:10,
        paddingVertical:30
    }
});


// Export
export default ActivityRegistry;