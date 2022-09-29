// Imports
import axios from 'axios';
import {useState, useEffect} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {View, Text, Pressable, StyleSheet, ScrollView} from 'react-native';
import LoadingIcon from './LoadingIcon';


// Main Function
const Properties = () => {

    const [properties, setProperties] = useState([{}]);

    useEffect(() => {
        const propertiesFetcher = async () => {
            axios
                .get('https://janus-server-side.herokuapp.com/properties')
                .then((res) => {
                    setProperties(res.data);
                })
                .catch(err => console.log(err.JSON()));
        };
        propertiesFetcher();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {properties[0].property_code ? properties.map(property => (
                    <View style={styles.itemContainer} key={property._id}>
                        <Pressable style={styles.leftSection}>
                            <Text style={styles.number}>{property.property_code}</Text>
                            <Text style={styles.destination}>{property.name}</Text>
                        </Pressable>
                        <Pressable style={styles.middleSection}>
                            <IonIcon name='location' color='#5f6368' size={25}/>
                        </Pressable>
                        <Pressable style={styles.rightSection}>
                            <IonIcon name='arrow-forward' color='#5f6368' size={25}/>
                        </Pressable>
                    </View>
                )) : <View style={styles.loadingIconContainer}>
                        <LoadingIcon />
                    </View>}
            </ScrollView>
        </View>
    )
};


// Styles
const styles = StyleSheet.create({
    container:{
        display:'flex',
        alignItems:'center',
        flexDirection:'column'
    },
    itemContainer:{
        height:100,
        width:'100%',
        display:'flex',
        borderColor:'#ccc',
        alignItems:'center',
        flexDirection:'row',
        borderBottomWidth:1,
        justifyContent:'space-between'
    },
    leftSection:{
        flex:6,
        height:'100%',
        display:'flex',
        paddingLeft:30,
        alignItems:'flex-start',
        justifyContent:'center'
    },
    middleSection:{
        flex:1,
        height:'100%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    rightSection:{
        flex:1,
        height:'100%',
        display:'flex',
        alignItems:'center',
        paddingRight:30,
        justifyContent:'center'
    },
    number:{
        marginBottom:10
    },
    destination:{
        color:'#5f6368',
        fontWeight:'500'
    },
    loadingIconContainer:{
        marginTop:50
    }
});


// Export
export default Properties;