import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput, Platform
} from 'react-native'
import { firebase, auth, database } from '../config/firebase'
import { Entypo } from '../constants/icons'
import colors from '../constants/colors'
import { FontAwesome } from
  "@expo/vector-icons";
import { Card } from "@paraboly/react-native-card";
import serviceProvider from './SPprofile'

import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// add bottom navigation 
// drawer navigation 
export default class Homescreen extends React.Component {
  state = {
    brand: '',
    description: '',
    originalOffers: [],
    offers: [],
    usedArray: {},
    search: ''
  }

  componentDidMount() {

    const subscribe = database.ref('Offers')
    subscribe.on('value', async snapshot => {
      await this.cancelAllScheduledNotificationsAsync();
      const offers = snapshot.val();
      const offersArray = [];
      if (offers != null)
        Object.keys(offers).map(key => {
          // console.warn(offers[key]);

          offersArray.push({
            key: key,
            ...offers[key]
          });
          const endDate = new Date(offers[key].expdate);
          const nowDate = new Date();
          // console.warn((endDate / 1000 - nowDate / 1000), offers[key], nowDate);
          if ((endDate / 1000 - nowDate / 1000) > (24 * 60 * 60)) { // offer has more than one day 
            this.scheduleNotification(offers[key], ((endDate / 1000 - nowDate / 1000) - (24 * 60 * 60)));
          }
        });
      this.setState({
        offers: offersArray,
        originalOffers: offersArray

      })
    })
    this.generateToken();
    this.getAllScheduledNotificationsAsync()
    this.gtUsedOffers();
    // this.scheduleNotification();
  }
  gtUsedOffers = () => {
    self = this
    const subscribe = database.ref('usedOffers/' + auth.currentUser.uid)
      .on('value', function (snapshot) {
        const offers = snapshot.val();
        var usedArray = {}

        if (offers != null) {
          Object.keys(offers).map(key => {
            usedArray = {
              ...usedArray,
              [key]: true
            }
            // console.log(offers, self.state.offerDetails)
            // usedArray.push(offers[key])
          })
          self.setState({
            usedArray: usedArray,

          })
        }
        else {


        }
      }
      )
  }

  generateToken = async () => {
    const token = await this.registerForPushNotificationsAsync();
    database
      .ref()
      .child("users")
      .child(auth.currentUser.uid)
      .child("push_token")
      .set(token)
  }

  registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }
  scheduleNotification = (offer, seconds) => {

    Notifications.scheduleNotificationAsync({
      content: {
        sound: 'default',
        title: offer.title + "هذا العرض سوف ينتهي بعد يوم",
        body: offer.Descripiton
      },
      trigger: {
        seconds: 10,
        repeats: false
      },
    });
  }

  getAllScheduledNotificationsAsync = async () => {
    console.log('ffff')
    console.lightColor(await Notifications.getAllScheduledNotificationsAsync())
  }

  cancelAllScheduledNotificationsAsync = async () => {
    return await Notifications.cancelAllScheduledNotificationsAsync()
  }


  retrieveServiceProviderName = (sp) => {

    database.ref('serviceProvider/' + sp).once('value', function (snapshot) {
      var name = snapshot.val().nameBrand;
      readName(name)
    })
    const readName = (name) => {
      this.setState(
        { brand: name }
      )
    }
  }
  handleSearch = (text) => {
    const searchOffers = this.state.originalOffers.filter(offer => offer.nameBrand?.toLowerCase().indexOf(text.toLowerCase()) > -1 ? true : false)
    this.setState({
      offers: searchOffers,
      search: text
    })
  }
  render() {


    return (
      <View style={styles.container}>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginTop: 15 }}
            onPress={() => {
              this.props.navigation.toggleDrawer();
            }}
          >
            <Entypo name="menu" size={30} style={{ marginTop: 15 }} />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, color: colors.primaryBlue, alignSelf: "flex-end" }}>
            اكتشف مميزاتك..
            </Text>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              marginTop: 8
            }}
          >
            <TouchableOpacity>
              <Text>الكل</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text> المطاعم</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>الصحة</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>الهدايا</Text>
            </TouchableOpacity>

          </View> */}
          {/**for test */}

          <View style={styles.viewSearch}>
            <TextInput style={styles.inputSearch}
              onChangeText={this.handleSearch}
              value={this.state.search}
            />
            <TouchableOpacity>
              <FontAwesome name="search" color="#fff" size={20} />
            </TouchableOpacity>
          </View>
          {/* {this.Cards()} */}
          {this.state.offers.length == 0 && this.state.search != "" ?
            <View style={{ paddingTop: 250 }}>
              <Text style={{ textAlign: 'center', fontSize: 20, color: colors.primaryGrey, }}>عذرًا لا يوجد نتائج لبحثك</Text>
            </View>
            :
            this.state.offers.map(offer => {
              if (this.state.usedArray[offer.key]) return null
              //  this.retrieveServiceProviderName(offer.serviceProvider)
              // var name = this.state.brand.toString()
              return (
                <View style={{ marginTop: 15 }}>
                  <Card
                    title={offer.title}
                    content={offer.Descripiton}
                    iconName="local-offer"
                    iconType="MaterialIcons"
                    iconBackgroundColor={colors.primaryBlue}
                    bottomRightText={offer.nameBrand}
                    titleStyle={{
                      lineHeight: 18,
                      letterSpacing: 0,
                      textAlign: "left",
                      color: colors.primaryBlue,
                      width: '100%',

                    }}
                    onPress={() => { this.props.navigation.navigate('serviceProvider', { offer: offer }) }}
                  />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  viewBox: {
    width: "80%",
    height: 230,
    borderWidth: 2,
    borderColor: "#bbb",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 20,
  },
  inputSearch: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    color: 'black',
  },
  viewSearch: {
    backgroundColor: colors.primaryGrey,
    width: 200,
    borderRadius: 30,
    height: 50,
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    textAlign: "right"
  },
});



