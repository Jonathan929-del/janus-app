// Imports
import NearMe from './NearMe';
import {useState} from 'react';
import {useFonts} from 'expo-font';
import MyTasksModal from './MyTasksModal';
import ActivityRegistry from './ActivityRegistry';
import {useTheme} from '../src/theme/themeProvider';
import NotificationsModal from './NotificationsModal';
import {View, StyleSheet, Text, Pressable, Image} from 'react-native';


// Main Function
const Menu = () => {


    // Theme
    const {dark, theme, setScheme} = useTheme();
    const themeToggler = () => {
        dark ? setScheme('light') : setScheme('dark');
    };


    // Font
    const [fontsLoaded] = useFonts({
        'OpenSans': require('../assets/fonts/OpenSans-SemiBold.ttf'),
    });

 
    // Activity Registry opener
    const [isActivityRegistryOpened, setIsActivityRegistryOpened] = useState(false);


    // Notifications opener
    const [isNotificationsOpened, setIsNotificationsOpened] = useState(false);


    // My tasks opener
    const [isMyTasksOpened, setIsMyTasksOpened] = useState(false);


    // Near me opener
    const [isNearMeOpened, setIsNearMeOpened] = useState(false);


    return (
        <View style={[styles.container, {backgroundColor:theme.screenBackground}]}>
            <ActivityRegistry 
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
            />
            <NotificationsModal
                isNotificationsOpened={isNotificationsOpened}
                setIsNotificationsOpened={setIsNotificationsOpened}
            />
            <MyTasksModal
                isMyTasksOpened={isMyTasksOpened}
                setIsMyTasksOpened={setIsMyTasksOpened}
            />
            <NearMe
                isNearMeOpened={isNearMeOpened}
                setIsNearMeOpened={setIsNearMeOpened}
            />
            <Pressable style={[styles.itemContainer, {
                    backgroundColor:dark ? '#333f50' : '#f5f5f5',
                    borderColor:dark ? '#35c7fb' : '#000'
                }]} onPress={() => setIsActivityRegistryOpened(true)}>
                <View>
                    {dark
                        ? <Image source={require('../assets/images/BarcodeDark.png')} style={styles.tasksImg}/>
                        : <Image source={require('../assets/images/Barcode.png')} style={styles.tasksImg}/>
                    }
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, {color:dark ? '#35c7fb' : '#000', fontFamily:fontsLoaded ? theme.font : ''}]}>Scan Barcode</Text>
                </View>
            </Pressable>
            <Pressable style={[styles.itemContainer, {
                    backgroundColor:dark ? '#333f50' : '#f5f5f5',
                    borderColor:dark ? '#35c7fb' : '#000',
                    shadowColor:dark ? '#35c7fb' : '#000'
                }]} onPress={() => setIsMyTasksOpened(true)}>
                <View>
                    {dark
                        ? <Image source={require('../assets/images/MyTasksDark.png')} style={styles.taskImg}/>
                        : <Image source={require('../assets/images/MyTasks.png')} style={styles.taskImg}/>
                    }
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, {color:dark ? '#35c7fb' : '#000', fontFamily:fontsLoaded ? theme.font : ''}]}>My Tasks</Text>
                </View>
            </Pressable>
            <Pressable style={[styles.itemContainer, {
                    backgroundColor:dark ? '#333f50' : '#f5f5f5',
                    borderColor:dark ? '#35c7fb' : '#000',
                    shadowColor:dark ? '#35c7fb' : '#000'
                }]} onPress={() => setIsNearMeOpened(true)}>
                <View>
                    {dark
                        ? <Image source={require('../assets/images/NearMeDark.png')} style={styles.tasksImg}/>
                        : <Image source={require('../assets/images/NearMe.png')} style={styles.tasksImg}/>
                    }
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, {color:dark ? '#35c7fb' : '#000', fontFamily:fontsLoaded ? theme.font : ''}]}>Near Me</Text>
                </View>
            </Pressable>
            <Pressable style={[styles.itemContainer, {
                    backgroundColor:dark ? '#333f50' : '#f5f5f5',
                    borderColor:dark ? '#35c7fb' : '#000',
                    shadowColor:dark ? '#35c7fb' : '#000'
                }]} onPress={() => setIsNotificationsOpened(true)}>
                <View>
                    {dark
                        ? <Image source={require('../assets/images/NotificationsDark.png')} style={styles.taskImg}/>
                        : <Image source={require('../assets/images/Notifications.png')} style={styles.taskImg}/> 
                    }
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, {color:dark ? '#35c7fb' : '#000', fontFamily:fontsLoaded ? theme.font : ''}]}>Notifications</Text>
                </View>
            </Pressable>
            <Pressable style={[styles.itemContainer, {
                    backgroundColor:dark ? '#333f50' : '#f5f5f5',
                    borderColor:dark ? '#35c7fb' : '#000',
                    shadowColor:dark ? '#35c7fb' : '#000'
                }]} onPress={themeToggler}>
                <View>
                    {dark
                        ? <Image source={require('../assets/images/DarkTheme.png')} style={styles.modeImg}/>
                        : <Image source={require('../assets/images/LightTheme.png')} style={styles.modeImg}/>
                    }
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, {color:dark ? '#35c7fb' : '#000', fontFamily:fontsLoaded ? theme.font : ''}]}>Mode</Text>
                </View>
            </Pressable>
        </View>
    )
};


// Styles
const styles = StyleSheet.create({
    container:{
        height:'100%',
        paddingTop:10,
        display:'flex',
        borderTopWidth:1,
        flexDirection:'column',
    },
    itemContainer:{
      height:'17%',
      minHeight:80,
      width:'100%',
      maxHeight:165,
      display:'flex',
      borderRadius:5,
      marginVertical:2,
      borderTopWidth:2,
      borderBottomWidth:2,
      position:'relative',
      alignItems:'center',
      paddingHorizontal:30,
      flexDirection:'column',
      justifyContent:'center'
    },
    text:{
        fontSize:14,
        marginBottom:6,
        textAlign:'center',
    },
    tasksImg:{
        width:40,
        height:40
    },
    taskImg:{
        width:30,
        height:40
    },
    modeImg:{
        width:40,
        height:40
    },
    darkNotificationsImg:{
        width:40,
        height:40
    },
    textContainer:{
        bottom:0,
        width:'100%',
        position:'absolute'
    }
});


// Export
export default Menu;