// Imports
import {useState} from 'react';
import ActivityRegistry from './ActivityRegistry';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {View, StyleSheet, Text, Pressable, ScrollView, Image} from 'react-native';


// Main Function
const Menu = () => {

    const [isActivityRegistryOpened, setIsActivityRegistryOpened] = useState(false);
    const activityRegistryOpener = () => {
        setIsActivityRegistryOpened(true);
    };

    return (
        <ScrollView style={styles.container}>
            <ActivityRegistry 
                isActivityRegistryOpened={isActivityRegistryOpened}
                setIsActivityRegistryOpened={setIsActivityRegistryOpened}
            />
            <Pressable style={styles.itemContainer} onPress={activityRegistryOpener}>
                <View>
                    <IonIcon name='barcode-outline' size={80}/>
                </View>
                <View>
                    <Text style={styles.text}>Barcode</Text>
                    <Text>1</Text>
                </View>
            </Pressable>
            <Pressable style={styles.itemContainer}>
                <View>
                    <Image source={require('../assets/images/NFC.png')} style={styles.img}/>
                </View>
                <View>
                    <Text style={styles.text}>NFC</Text>
                    <Text>2</Text>
                </View>
            </Pressable>
            <Pressable style={styles.itemContainer}>
                <View style={styles.locationIcon}>
                    <IonIcon name='location' size={80}/>
                </View>
                <View>
                    <Text style={styles.text}>Geo Localize</Text>
                    <Text>3</Text>
                </View>
            </Pressable>
            <Pressable style={styles.itemContainer}>
                <View>
                    <Image source={require('../assets/images/Houses.png')} style={styles.housesImg}/>
                </View>
                <View>
                    <Text style={styles.text}>My Properties</Text>
                    <Text>4</Text>
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
    locationIcon:{
        marginLeft:-10
    }
});


// Export
export default Menu;