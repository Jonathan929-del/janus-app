// Imports
import axios from 'axios';
import Texts from './Texts';
import Activities from './Activities';
import LoadingIcon from './LoadingIcon';
import {useState, useEffect} from 'react';
import {useTheme} from '../src/theme/themeProvider';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Text, StyleSheet, View, Pressable, ScrollView, Image} from 'react-native';


// Main Function
const Components = ({buildingCode, isComponentsOpened, setIsComponentsOpened, setIsBuildingsOpened}) => {


    // Theme
    const {dark, theme} = useTheme();


    // Components fetching
    const [components, setComponents] = useState([{}]);
    useEffect(() => {
        const componentsFetcher = async () => {
            try {
                const res = await axios.get(`https://janus-backend-api.herokuapp.com/components/${buildingCode}`);
                setComponents(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        componentsFetcher();
    }, [isComponentsOpened]);


    // Opening activities
    const [componentName, setComponentName] = useState('');
    const [isActivitiesOpened, setIsActivitiesOpened] = useState(false);
    const activityOpener = name => {
        setComponentName(name);
        setIsActivitiesOpened(true);
    };


    // Opening texts
    const [isTextsOpened, setIsTextsOpened] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState({});
    const textsOpener = component => {
        setSelectedComponent(component)
        setIsTextsOpened(true);
    };


    return (
    <Modal visible={isComponentsOpened} animationType='slide' style={{backgroundColor:theme.screenBackground}}>
        <Texts
            isTextsOpened={isTextsOpened}
            setIsTextsOpened={setIsTextsOpened}
            component={selectedComponent}
        />
        <Activities 
            componentName={componentName}
            isActivitiesOpened={isActivitiesOpened}
            setIsActivitiesOpened={setIsActivitiesOpened}
            setIsBuildingsOpened={setIsBuildingsOpened}
            setIsComponentsOpened={setIsComponentsOpened}
        />
        <View style={[styles.topbar, {backgroundColor:theme.screenBackground}]}>
            <Pressable onPress={() => setIsComponentsOpened(false)}>
                <IonIcon name='arrow-back' style={styles.arrowBackIcon} color={theme.text}/>
            </Pressable>
            <Text style={[styles.header, {color:theme.text, fontFamily:theme.font}]}>Components</Text>
        </View>
        <View style={[styles.categories, {borderColor:theme.text, backgroundColor:theme.screenBackground}]}>
                <Pressable
                    onPress={() => {
                        setIsComponentsOpened(false);
                        setIsBuildingsOpened(false);
                    }} style={{paddingRight:5}}
                >
                    <Text style={{color:theme.text, fontFamily:theme.font}}>Properties</Text>
                </Pressable>
                <Text style={{color:theme.text, fontFamily:theme.font}}>{'>'}</Text>
                <Pressable style={{paddingHorizontal:5}} onPress={() => setIsComponentsOpened(false)}>
                    <Text style={{color:theme.text, fontFamily:theme.font}}>Buildings</Text>
                </Pressable>
                <Text style={{color:theme.text, fontFamily:theme.font}}>{'>'}</Text>
                <Pressable style={{paddingLeft:5}}>
                    <Text style={{color:theme.text, fontFamily:theme.font}}>Components</Text>
                </Pressable>
        </View>
        <ScrollView style={{backgroundColor:dark ? '#000' : '#D9D9D9', paddingTop:20}}>
            <View style={{paddingBottom:50}}>
                {components.length > 0 ? typeof(components[0].component_code) === 'string' ? components.map(component => (
                    <View style={[styles.itemContainer, {backgroundColor:dark ? '#333F50' : '#F5F5F5', borderColor:dark ? '#35C7FB' : '#000'}]} key={component._id}>
                        <View>
                            <Pressable style={[styles.bookButton, {backgroundColor:dark ? '#000' : '#D9D9D9', borderColor:dark ? '#35C7FB' : '#000'}]} onPress={() => textsOpener(component)}>
                                {
                                    dark
                                    ? <Image source={require('../assets/images/BookDark.png')} style={{width:30, height:30}}/>
                                    : <Image source={require('../assets/images/Book.png')} style={{width:30, height:30}}/>
                                }
                            </Pressable>
                        </View>
                        <View style={styles.middleSection}>
                            <View style={[styles.topMiddleSection, {justifyContent:'flex-start'}]}>
                                <View style={{display:'flex', flexDirection:'row', alignItems:'center', flex:1}}>
                                    {
                                        dark
                                        ? <Image source={require('../assets/images/SettingsDark.png')} style={{height:25, width:25, flex:0.4}}/>
                                        : <Image source={require('../assets/images/Settings.png')} style={{height:25, width:25}}/>
                                    }
                                    <Text style={{marginLeft:5, fontFamily:theme.font, color:theme.text, flex:1, height:20, flexWrap:'nowrap'}}>{component.name}</Text>
                                </View>
                                <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginLeft:20, flex:1}}>
                                    {
                                        dark
                                        ? <Image source={require('../assets/images/ComponentBarcodeDark.png')} style={{height:25, width:25}}/>
                                        : <Image source={require('../assets/images/ComponentBarcode.png')} style={{height:25, width:30}}/>
                                    }
                                    <Text style={{marginLeft:5, fontFamily:theme.font, color:theme.text}}>{component.component_code}</Text>
                                </View>
                            </View>
                            <View style={styles.botttomMiddleSection}>
                                <Text style={{fontFamily:theme.font, color:theme.text, height:20}}>{component.position_of_code}</Text>
                            </View>
                        </View>
                        <Pressable style={[styles.rightSection, {
                                            backgroundColor:dark ? '#000' : '#D9D9D9',
                                            borderColor:dark ? '#35C7FB' : '#000'
                            }]}
                            onPress={() => activityOpener(component.component_code)}
                        >
                            {
                                dark
                                ? <Image source={require('../assets/images/ArrowForwardDark.png')} style={{height:25, width:25}}/>
                                : <Image source={require('../assets/images/ArrowForward.png')} style={{height:25, width:25}}/>
                            }
                        </Pressable>
                    </View>
                )) : <View style={styles.loadingIconContainer}>
                    <LoadingIcon />
                </View> : <Text style={styles.noCom}>No components to show</Text>}
            </View>
        </ScrollView>
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
        alignItems:'center'
    },
    arrowBackIcon:{
        fontSize:30,
        marginLeft:15
    },
    header:{
        fontSize:20,
        marginLeft:10
    },
    itemContainer:{
        height:100,
        marginTop:5,
        width:'100%',
        display:'flex',
        borderRadius:5,
        borderTopWidth:2,
        borderBottomWidth:2,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    buildingCode:{
        marginBottom:10
    },
    buildingNumber:{
        color:'#5f6368',
        fontWeight:'500'
    },
    loadingIconContainer:{
        marginTop:50
    },
    noCom:{
        width:'100%',
        fontSize:12,
        marginTop:50,
        textAlign:'center'
    },
    categories:{
        display:'flex',
        paddingLeft:20,
        borderTopWidth:1,
        paddingVertical:15,
        borderBottomWidth:2,
        flexDirection:'row',
        alignItems:'center'
    },
    bookButton:{
        padding:10,
        marginLeft:10,
        borderWidth:2,
        display:'flex',
        borderRadius:50,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'center'
    },
    rightSection:{
        width:50,
        height:50,
        borderWidth:1,
        display:'flex',
        borderRadius:50,
        marginRight:30,
        alignItems:'center',
        justifyContent:'center',
    },
    middleSection:{
        width:'60%',
        height:'80%',
        display:'flex',
    },
    topMiddleSection:{
        flex:1,
        width:'100%',
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
    },
    botttomMiddleSection:{
        flex:1,
        width:'100%',
        display:'flex',
        paddingLeft:10,
        alignItems:'center',
        flexDirection:'row'
    }
});


// Export
export default Components;