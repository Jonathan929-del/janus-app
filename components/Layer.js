// Imports
import Map from './Map';
import Menu from './Menu';
import {useFonts} from 'expo-font';
import Properties from './Properties';
import {useState, useEffect} from 'react';
import {useTheme} from '../src/theme/themeProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {View, Text, StyleSheet, Pressable, StatusBar, Image} from 'react-native';


// Main Function
const Layer = () => {


    // Theme
    const {dark, theme} = useTheme();


    // Font
    const [fontsLoaded] = useFonts({
        'OpenSans': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    });


    // Active tap
    const [activeTap, setActiveTap] = useState('menu');
    const activeAppHandler = text => {
        setActiveTap(text);
    };


    // Opened page
    const [pageName, setPageName] = useState('');
    const [isMenuOpened, setIsMenuOpened] = useState(true);
    const [isMapOpened, setIsMapOpened] = useState(false);
    const [isPropertiesOpened, setIsPropertiesOpened] = useState(false);


    // Use effect
    useEffect(() => {
        if(isMapOpened){
            setPageName('Map View');
        }else if(isMenuOpened){
            setPageName('Home');
        }else{
            setPageName('Properties');
        };
    }, [isMenuOpened, isPropertiesOpened, isMapOpened]);


  return (
    <View style={[styles.app, {backgroundColor:theme.screenBackground}]}>
        <StatusBar
            backgroundColor={dark ? '#000' : '#fff'}
            barStyle={dark ? 'light-content' : 'dark-content'}
        />
        <View style={[styles.page, {borderColor:theme.text}]}>
            <Text style={[styles.pageName, {color:theme.text, fontFamily:fontsLoaded ? theme.font : ''}]}>{pageName}</Text>
        </View>
        <View style={[styles.children]}>
            {isMenuOpened ? <Menu /> : ''}
            {isMapOpened ? <Map /> : ''}
            {isPropertiesOpened ? <Properties /> : ''}
        </View>
        <View style={styles.taps}>
            <Pressable style={styles.tap} onPress={() => {
                setIsMenuOpened(false);
                setIsPropertiesOpened(false);
                setIsMapOpened(true);
                activeAppHandler('map');
            }}>
                <IonIcon name='map-outline' size={activeTap === 'map' ? 50 : 30} color={dark ? '#fff' : '#000'}/>
            </Pressable>
            <Pressable style={styles.tap} onPress={() => {
                setIsPropertiesOpened(false);
                setIsMapOpened(false);
                setIsMenuOpened(true);
                activeAppHandler('menu');
            }}>
                {
                    dark
                    ? <Image source={require('../assets/images/HomeNavigationDark.png')} style={{height:activeTap === 'menu' ? 50 : 35, width:activeTap === 'menu' ? 50 : 35}}/>
                    : <Image source={require('../assets/images/HomeNavigation.png')} style={{height:activeTap === 'menu' ? 50 : 35, width:activeTap === 'menu' ? 50 : 35}}/>
                }
            </Pressable>
            <Pressable style={styles.tap} onPress={() => {
                setIsMenuOpened(false);
                setIsMapOpened(false);
                setIsPropertiesOpened(true);
                activeAppHandler('properties');
            }}>
                <IonIcon name='list' size={activeTap === 'properties' ? 50 : 30} color={dark ? '#fff' : '#000'}/>
            </Pressable>
        </View>
    </View>
  )
}


// Styles
const styles = StyleSheet.create({
    app:{
        height:'100%',
        display:'flex'
    },
    page:{
        flex:0.85,
        marginTop:10,
        paddingLeft:30,
        borderTopWidth:2,
        borderColor:'#000',
        borderBottomWidth:2,
        justifyContent:'center'
    },
    pageName:{
        fontSize:20
    },
    children:{
        flex:12
    },
    taps:{
        flex:2,
        display:'flex',
        flexDirection:'row'
    },
    tap:{
        flex:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }
});


// Export
export default Layer;