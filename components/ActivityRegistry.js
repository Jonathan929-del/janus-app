// Imports
import axios from 'axios';
import moment from 'moment';
import Camera from './Camera';
import {useState, useEffect} from 'react';
import ActivityCamera from './ActivityCamera';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, TextInput, TouchableOpacity, ScrollView, ImageBackground, Image, SafeAreaView} from 'react-native';


// Main Function
const ActivityRegistry = ({componentName, isActivityRegistryOpened, setIsActivityRegistryOpened}) => {


    // Form
    const [component, setComponent] = useState({});
    const [description, setDescription] = useState('');
    const [componentCode, setComponentCode] = useState('');
    const [selectedTask, setSelectedTask] = useState('Tillsyn');
    const [signature, setSignature] = useState('');
    const descriptionHandler = text => {
        setDescription(text);
    }
    const taskToggler = task => {
        setSelectedTask(task);
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
            const res = await axios.get(`https://janus-server-api.herokuapp.com/components/component/${component_code}`);
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
                change_date:''
            }
            await axios.post('https://janus-server-api.herokuapp.com/activities', input);


            // Uploading image
            const base64Img = `data:image/jpg;base64,${capturedImage.base64}`;
            const apiUrl = 'https://api.cloudinary.com/v1_1/jobook/image/upload';
            const data = {
                file: base64Img,
                upload_preset: 'janusimages',
                public_id:componentCode === '' ? componentName : componentCode,
                folder:'janus'
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
            await axios.put(`https://janus-server-api.herokuapp.com/components/component-code/${componentName}`, {
                maintenance_lastest_date:today,
                maintenance_next_date:nextDate
            });


            // Deleting notification
            await axios.delete(`https://janus-server-api.herokuapp.com/notifications/${componentName}`);


            // Setting off page
            setScanned(false);
            setComponentCode('');
            setDescription('');
            setComponent({});
            setSelectedTask('Tillsyn');
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
        setCapturedImage();
        setIsActivityRegistryOpened(false);
    };


    // Save image handler
    const imageSaver = async () => {
        try {
            const base64Img = `data:image/jpg;base64,${capturedImage.base64}`;
            const apiUrl = 'https://api.cloudinary.com/v1_1/jobook/image/upload';
            const data = {
                file: base64Img,
                upload_preset: 'janusimages',
                public_id:componentCode === '' ? componentName : componentCode,
                folder:'janus'
            };
            fetch(apiUrl,
                {
                    body: JSON.stringify(data),
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'POST'
                })
                .then(async response => {
                    let data = await response.json();
                    if (data.secure_url) {
                        alert('Upload successful');
                    }
                })
                .catch(err => {
                    alert('Cannot upload');
                });
            console.log('clciked');
        } catch (err) {
            console.log(err);
        }
    }


    // Use effect
    useEffect(() => {
        const userFetcher = async () => {
            try {
                const res = await axios.get('https://janus-server-api.herokuapp.com/users');
                setSignature(res.data[0].user);
                const componentRes = await axios.get(`https://janus-server-api.herokuapp.com/components/component/${componentName}`);
                componentName && setComponent(componentRes.data);
                componentName && setComponentCode((componentRes.data.component_code));
            } catch (err) {
                console.log(err);
            }
        };
        userFetcher();
    }, []);


    // Closing form
    const cancelButton = () => {
        setScanned(false);
        setSelectedTask('Tillsyn');
        setComponentCode('');
        setDescription('');
        setComponent({});
        setIsActivityRegistryOpened(false);
    };


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
            <View style={styles.container}>
                <View style={styles.topbar}>
                    <Pressable onPress={exitButtonHandler}>
                        <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
                    </Pressable>
                    <Text style={styles.header}>{componentName ? componentName : 'Activity Form'}</Text>
                </View>
                <ScrollView>
                    <View style={styles.content}>
                        {!componentName && <View style={styles.item}>
                            <View style={styles.fieldContainer}>
                                <TextInput style={styles.input} value={componentCode} onChangeText={e => componentCodeFieldHandler(e)}/>
                                <TouchableOpacity style={styles.scanButton} onPress={cameraOpener}>
                                    <Text style={styles.scanButtonText}>{scanned ? 'Scan Again' : 'Scan Barcode'}</Text>
                                    <IonIcon name='barcode-outline' color='#fff' size={25}/>
                                </TouchableOpacity>
                            </View>
                        </View>}
                        <View style={styles.item}>
                            <View style={styles.labelFieldContainer}>
                                <Text style={styles.labelText}>Label:</Text>
                                <Text style={styles.labelContent}>{component?.name}</Text>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.labelText}>Task:</Text>
                            <View style={styles.fieldContainer}>
                                <TouchableOpacity style={selectedTask === 'Tillsyn' ? styles.button : styles.unSelectedButton} onPress={() => taskToggler('Tillsyn')}>
                                    <Text style={selectedTask === 'Tillsyn' ? styles.buttonText : styles.unSelectedButtonText}>
                                        Tillsyn
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={selectedTask === 'Skötsel' ? styles.button : styles.unSelectedButton} onPress={() => taskToggler('Skötsel')}>
                                    <Text style={selectedTask === 'Skötsel' ? styles.buttonText : styles.unSelectedButtonText}>
                                        Skötsel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.item}>
                            <View style={styles.dateSignatureContainer}>
                                <View style={styles.inlineItem}>
                                    <Text style={styles.labelText}>Date:</Text>
                                    <View style={styles.fieldContainer}>
                                        <TextInput style={styles.singleInput} value={moment(new Date()).format('YYYY-MM-DD')}/>
                                    </View>
                                </View>
                                <View style={styles.inlineItem}>
                                    <Text style={styles.labelText}>Signature:</Text>
                                    <View style={styles.fieldContainer}>
                                        <TextInput style={styles.singleInput} value={signature}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {capturedImage !== '' ?
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
                                    <View style={styles.cameraContainer}>
                                        <IonIcon name='camera' size={30} color='#5f6368'/>
                                    </View>
                                </Pressable>
                        }
                        <View style={styles.descItem}>
                            <Text style={styles.labelText}>Description / Remark:</Text>
                            <View style={styles.fieldContainer}>
                                <TextInput style={styles.singleInput} value={description} onChangeText={e => descriptionHandler(e)}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottomNav}>
                    <Pressable style={styles.cancel} onPress={cancelButton}>
                        <Text style={styles.cancelText}>cancel</Text>
                    </Pressable>
                    <Pressable style={styles.save} onPress={activityPoster}>
                        <Text style={styles.saveText}>Save</Text>
                    </Pressable>
                </View>
            </View>
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
        borderBottomWidth:1,
        borderBottomColor:'#ccc'
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
        position:'relative'
    },
    content:{
        width:'100%',
        maxWidth:500,
        paddingTop:10,
        display:'flex',
        paddingBottom:100,
        alignItems:'center'
    },
    labelFieldContainer:{
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
    },
    input:{
        flex:1,
        color:'#000',
        borderWidth:2,
        borderRadius:5,
        paddingLeft:15,
        marginRight:10,
        paddingVertical:10,
        borderColor:'#ccc',
    },
    singleInput:{
        flex:1,
        color:'#000',
        borderWidth:2,
        borderRadius:5,
        paddingLeft:15,
        marginRight:10,
        paddingVertical:10,
        borderColor:'#ccc',
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
        marginTop:40   
    },
    button:{
        width:'47%',
        display:'flex',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#0d80e7'
    },
    unSelectedButton:{
        width:'47%',
        display:'flex',
        borderRadius:5,
        alignItems:'center',
        backgroundColor:'#ccc',
        justifyContent:'center'
    },
    buttonText:{
        color:'#fff',
        marginVertical:30
    },
    unSelectedButtonText:{
        color:'#000',
        marginVertical:30
    },
    cameraContainer:{
        height:100,
        width:'100%',
        borderWidth:1,
        borderRadius:5,
        display:'flex',
        borderColor:'#ccc',
        alignItems:'center',
        justifyContent:'center'
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
        borderTopColor:'#ccc',
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
    labelText:{
        fontSize:18
    },
    labelContent:{
        marginLeft:10,
        color:'#5f6368',
        fontSize:15
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
        display:'flex',
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        paddingHorizontal:10,
        backgroundColor:'#0d80e7'   
    },
    scanButtonText:{
        fontSize:14,
        color:'#fff',
        marginRight:5
    },
    imageCloseButton:{
        top:10,
        right:10,
        borderRadius:50,
        paddingVertical:10,
        paddingHorizontal:15,
        position:'absolute',
        backgroundColor:'#fff'
    }
});


// Export
export default ActivityRegistry;