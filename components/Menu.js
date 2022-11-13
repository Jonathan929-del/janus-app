// Imports
import NearMe from './NearMe';
import {useState} from 'react';
import MyTasksModal from './MyTasksModal';
import ActivityRegistry from './ActivityRegistry';
import NotificationsModal from './NotificationsModal';
import {View, StyleSheet, Text, Pressable, ScrollView, Image} from 'react-native';


// Main Function
const Menu = ({navigation}) => {

    // Activity Registry opener
    const [isActivityRegistryOpened, setIsActivityRegistryOpened] = useState(false);


    // Notifications opener
    const [isNotificationsOpened, setIsNotificationsOpened] = useState(false);


    // My tasks opener
    const [isMyTasksOpened, setIsMyTasksOpened] = useState(false);


    // Near me opener
    const [isNearMeOpened, setIsNearMeOpened] = useState(false);


    return (
        <ScrollView style={styles.container}>
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
            <Pressable style={styles.itemContainer} onPress={() => setIsActivityRegistryOpened(true)}>
                <View>
                    <Image source={require('../assets/images/Barcode.png')} style={styles.tasksImg}/>
                </View>
                <View>
                    <Text style={styles.text}>Barcode/NFC</Text>
                </View>
            </Pressable>
            <Pressable style={styles.itemContainer} onPress={() => setIsMyTasksOpened(true)}>
                <View>
                    <Image source={require('../assets/images/MyTasks.png')} style={styles.tasksImg}/>
                </View>
                <View>
                    <Text style={styles.text}>My Tasks</Text>
                </View>
            </Pressable>
            <Pressable style={styles.itemContainer} onPress={() => setIsNearMeOpened(true)}>
                <View>
                    <Image source={require('../assets/images/NearMe.png')} style={styles.tasksImg}/>
                </View>
                <View>
                    <Text style={styles.text}>Near Me</Text>
                </View>
            </Pressable>
            <Pressable style={styles.itemContainer} onPress={() => navigation.navigate('Properties')}>
                <View>
                    <Image source={require('../assets/images/MyProperties.png')} style={styles.tasksImg}/>
                </View>
                <View>
                    <Text style={styles.text}>My Properties</Text>
                </View>
            </Pressable>
            <Pressable style={styles.itemContainer} onPress={() => setIsNotificationsOpened(true)}>
                <View>
                    <Image source={require('../assets/images/Notifications.png')} style={styles.tasksImg}/>
                </View>
                <View>
                    <Text style={styles.text}>Notifications</Text>
                </View>
            </Pressable>
        </ScrollView>
    )
};


// Styles
const styles = StyleSheet.create({
    container:{
      display:'flex',
      flexDirection:'column'
    },
    itemContainer:{
      height:150,
      width:'100%',
      display:'flex',
      paddingLeft:'25%',
      borderColor:'#ccc',
      alignItems:'center',
      flexDirection:'row',
      borderBottomWidth:1,
      paddingHorizontal:30,
      justifyContent:'flex-start'
    },
    text:{
      fontSize:17,
      marginBottom:7
    },
    img:{
        width:80,
        height:80,
        marginRight:5,
        marginLeft:-10
    },
    housesImg:{
        width:70,
        height:35,
        marginLeft:0,
        marginRight:10
    },
    tasksImg:{
        width:70,
        height:70,
        marginLeft:0,
        marginRight:10
    },
    locationIcon:{
        marginLeft:-10
    }
});


// Export
export default Menu;