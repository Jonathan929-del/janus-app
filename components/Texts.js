// Imports
import {useTheme} from '../src/theme/themeProvider';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView, TouchableOpacity, Image} from 'react-native';


// Main Function
const Texts = ({isTextsOpened, setIsTextsOpened, component}) => {


    // Theme
    const {dark, theme} = useTheme();


    return (
    <Modal visible={isTextsOpened} animationType='slide'>
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={[styles.task, {fontFamily:theme.font, borderColor:dark ? '#35C7FB' : '#000'}]}>Tillsyn</Text>
                <Text style={[styles.textArea, {fontFamily:theme.font}]}>{component?.attendance_text ? component?.attendance_text : '_'}</Text>
            </View>
            <View style={styles.container}>
                <Text style={[styles.task, {fontFamily:theme.font, borderColor:dark ? '#35C7FB' : '#000'}]}>Skötsel</Text>
                <Text style={[styles.textArea, {fontFamily:theme.font}]}>{component?.maintenance_text ? component?.maintenance_text : '_'}</Text>
            </View>
            <Pressable onPress={() => setIsTextsOpened(false)} style={[styles.buttonContainer, {borderColor:dark ? '#35C7FB' : '#fff', backgroundColor:dark ? '#000' : '#35C7FB'}]}>
                <Text style={[styles.button, {color:dark ? '#35C7FB' : '#fff'}]}>x</Text>
            </Pressable>
        </View>
    </Modal>
  )
};


// Styles
const styles = StyleSheet.create({
    mainContainer:{
        height:'100%',
        display:'flex',
        alignItems:'center',
        justifyContent:'space-evenly',
        backgroundColor:'#D9D9D9'
    },
    container:{
        width:'90%',
        height:'40%',
        alignItems:'center',
        justifyContent:'center'
    },
    task:{
        width:150,
        borderWidth:2,
        marginBottom:5,
        borderRadius:40,
        paddingVertical:5,
        textAlign:'center',
        backgroundColor:'#fff'
    },
    textArea:{
        width:'100%',
        height:'90%',
        maxWidth:600,
        borderWidth:1,
        paddingHorizontal:20,
        paddingVertical:20,
        borderRadius:5,
        borderColor:'#000',
        backgroundColor:'#fff'
    },
    buttonContainer:{
        width:80,
        height:80,
        borderWidth:2,
        display:'flex',
        borderRadius:50,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#35C7FB',
        backgroundColor:'#000',
    },
    button:{
        fontSize:40,
        fontWeight:'300',
        color:'#35C7FB',
        marginBottom:10
    }
});


// Export
export default Texts;