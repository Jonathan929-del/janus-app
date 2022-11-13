// Imports
import {Camera} from 'expo-camera';
import {useEffect, useRef, useState} from 'react';
import * as MediaLibrary from 'expo-media-library';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Pressable, StyleSheet, View, Text, TouchableOpacity} from 'react-native';


// Main Function
const ActivityCamera = ({isActivityCameraOpened, setIsActivityCameraOpened, setCapturedImage}) => {


    // Asking camera permission
    const cameraPermission = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync();
        const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
        if(status === 'granted' && mediaLibraryStatus.status === 'granted'){
          // do something
       
        }else{
            await Camera.requestCameraPermissionsAsync();
        }
    };


    // Taking picture
    let camera = useRef();
    const captureHandler = async () => {
        try {
            if (!camera) return;
            let options = {
                quality: 1,
                base64: true,
                exif: false
            };
            const photo = await camera.takePictureAsync(options);
            setCapturedImage(photo);
            setIsActivityCameraOpened(false);
        } catch (err) {
            console.log(err);
        }
    };


    // Use effect
    useEffect(() => {
        isActivityCameraOpened && cameraPermission();
    }, []);


    return (
        <Modal visible={isActivityCameraOpened} animationType='slide'>
            <View style={styles.topbar}>
                <Pressable onPress={() => setIsActivityCameraOpened(false)}>
                    <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
                </Pressable>
                <Text style={styles.header}>Camera</Text>
            </View>
            <Camera style={styles.camera}
                ref={r => {
                    camera = r
                }}
            >
                <View
                    style={{
                    position: 'absolute',
                    bottom: 30,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                    }}
                >
                    <View
                        style={{
                        alignSelf: 'center',
                        flex: 1,
                        alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            onPress={captureHandler}
                            style={{
                                width: 70,
                                height: 70,
                                bottom: 0,
                                borderRadius: 50,
                                backgroundColor: '#fff'
                            }}
                        />
                    </View>
                </View>
            </Camera>
        </Modal>
    )
}


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
    camera:{
        flex:1
    }
});


// Export
export default ActivityCamera;