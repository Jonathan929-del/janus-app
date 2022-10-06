// Imports
import {useEffect} from 'react';
import {BarCodeScanner} from 'expo-barcode-scanner';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Pressable, StyleSheet, View, Text} from 'react-native';


// Main Function
const Camera = ({isCameraOpened, scanned, handleBarCodeScanned, setIsCameraOpened}) => {

    useEffect(() => {
        scanned && setIsCameraOpened(false);
    }, []);

    return (
        <Modal visible={isCameraOpened} animationType='slide'>
            <View style={styles.topbar}>
                <Pressable onPress={() => setIsCameraOpened(false)}>
                    <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
                </Pressable>
                <Text style={styles.header}>Scan Barcode</Text>
            </View>
            <View style={styles.barcodeContainer}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.barcodeScanner}
                />
            </View>
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
    barcodeContainer:{
        width:'100%',
        height:'90%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    barcodeScanner:{
        width:'100%',
        height:'80%'
    }
});


// Export
export default Camera;