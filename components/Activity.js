// Imports
import axios from 'axios';
import moment from 'moment';
import {useEffect, useState} from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Modal, Pressable, Text, View, StyleSheet} from 'react-native';


// Main Function
const Activity = ({isActivityOpened, setIsActivityOpened, activityId}) => {


  // Fetching activity
  const [activity, setActivity] = useState();
  useEffect(() => {
    const activityFetcher = async () => {
      const res = await axios.get(`https://janus-backend-api.herokuapp.com/activities/${activityId}`);
      setActivity(res.data);
    };
    activityFetcher();
  }, [isActivityOpened]);


  return (
    <Modal visible={isActivityOpened} animationType='slide'>
      <View style={styles.topbar}>
        <Pressable onPress={() => setIsActivityOpened(false)}>
            <IonIcon name='arrow-back' style={styles.arrowBackIcon}/>
        </Pressable>
        <Text style={styles.header}>{activity?.user}</Text>
      </View>
      <View style={styles.itemsContainer}>
        <View style={styles.item}>
          <Text style={styles.title}>Task:</Text>
          <Text style={styles.value}>{activity?.activity}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Component code:</Text>
          <Text style={styles.value}>{activity?.component}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Date:</Text>
          <Text style={styles.value}>{moment(activity?.date).format('YYYY-MM-DD')}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.title}>Signature:</Text>
          <Text style={styles.value}>{activity?.user}</Text>
        </View>
        <View style={styles.imageItem}>
          <Text style={styles.title}>Image:</Text>
          <Text style={styles.imageValue}>No image attached</Text>
        </View>
      </View>
    </Modal>
  )
}


// Styles
const styles = StyleSheet.create({
  topbar:{
      width:'100%',
      height:70,
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
      fontSize:20,
      marginLeft:10
  },
  itemsContainer:{
    width:'100%',
    display:'flex',
    flexWrap:'wrap',
    paddingVertical:30,
    flexDirection:'row',
    justifyContent:'space-evenly'
  },
  item:{
    width:'40%',
    marginTop:10,
    borderWidth:1,
    borderRadius:5,
    display:'flex',
    paddingLeft:10,
    borderColor:'#ccc',
    paddingVertical:10
  },
  title:{
    fontSize:12,
    color:'#6e6e6e',
  },
  value:{
    marginTop:10,
  },
  imageItem:{
    width:'87%',
    marginTop:10,
    borderWidth:1,
    borderRadius:5,
    display:'flex',
    paddingLeft:10,
    borderColor:'#ccc',
    paddingVertical:10
  },
  imageValue:{
    marginTop:30,
    marginBottom:40,
    textAlign:'center'
  }
});


// Export
export default Activity;