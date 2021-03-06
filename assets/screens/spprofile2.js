import React , {Component , useEffect , useState   } from 'react'
import { Text, View,  TextInput, Dimensions , StyleSheet,ScrollView, Image, TouchableOpacity} from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {Entypo, MaterialCommunityIcons,MaterialIcons, FontAwesome, Ionicons} from '../constants/icons'
//import {Dropdown }from 'react-native-material-dropdown';
//import DropDownPicker from 'react-native-dropdown-picker';


import {auth, database } from '../config/firebase'
import colors from '../constants/colors';
import styless from "../constants/styles";
import { render } from 'react-dom';



export default class serviceProviderProfile extends Component {

   // console.disableYellowBox = true;
    
state = {
  index:2,
  routes:[
  { key: 'third', title: 'المواقع' },
  { key: 'first', title: 'التفاصيل' },
  { key: 'second', title: 'حسابي' },
],
  userName: '',
  email: '',
  phoneNum:'',
  password:'',
  nameBrand:'',
  category:'',
  description:'',
  website:'',
  twitter:'',
  instagram:'',
  valid:true,
  errorMessage:null
}

 

handleNameChange = name => {
  this.setState({ userName: name  });
};

handleEmailChange = email => {
  this.setState({ email: email  });
}

handlePhoneChange = phone => {
    this.setState({ phoneNum: phone  });
  };

handleBrandChange = brand => {
    this.setState({ nameBrand: brand  });
};
handleCategoryChange = category => {
    this.setState({ category: category  });
  };
handleDescriptionChange = description => {
    this.setState({ description: description  });
  };
handlewebsiteChange = website => {
    this.setState({ website: website  });
  };
  handleTwitterChange = twitter => {
    this.setState({ twitter: twitter  });
  };
  handleInstagramChange = instagram => {
    this.setState({ instagram: instagram  });
  };
  

 
componentDidMount(){ 

     this.fetchData
}
  fetchData=()=>{
  const subscribe1 = database.ref('users/'+ auth.currentUser.uid).once('value').then(function(snapshot){

     var username=  (snapshot.val() && snapshot.val().name)
     //var email =  (snapshot.val() && snapshot.val().email)
     var password= (snapshot.val() && snapshot.val().password)
     var brand = ((snapshot.val() && snapshot.val().trademark))

    
     const subscribe2=  database.ref('serviceProvider/'+brand).once('value').then(function(snapshotinner) {
            var description = ((snapshotinner.val() && snapshotinner.val().description))
            var phone = ((snapshotinner.val() && snapshotinner.val().phone))
            var category = ((snapshotinner.val() && snapshotinner.val().category))
            var website = ((snapshotinner.val() && snapshotinner.val().website))
            var twitter = ((snapshotinner.val() && snapshotinner.val().twitter))
            var instagram = ((snapshotinner.val() && snapshotinner.val().instagram))
           
         readData(username, password,phone,brand,category,description,website,twitter,instagram)
     })
      
    });
    
    const readData =  (username,password,phone,brand,category,description,website,twitter,instagram) => {
    this.setState({
      userName: username,
      email: auth.currentUser.email,
      password: password,
      phoneNum:phone, 
      nameBrand: brand,
      category:category,
      description:description,
      website: website,
      twitter: twitter,
      instagram:instagram,
    
    });
    
  };
}

componentWillUnmount(){
  return()=>{
    // unmount

  }
}


handleUpdate= ()=>{
    
    database.ref('users/'+ auth.currentUser.uid).update(
    {
    'name': this.state.userName,
    'email': this.state.email, 
    
}
).catch(error => alert(error));

database.ref('serviceProvider/'+this.state.nameBrand).update({
    'description': this.state.description,
    'category': this.state.category,
    'phone': this.state.phoneNum,
    'website': this.state.website,
    'twitter': this.state.twitter,
    'instagram': this.state.instagram

}).then(alert('تم حفظ التغييرات بنجاح')).then(auth.currentUser.updateEmail(email)).catch(setWrongEmailFormat)

}


validateForm = () =>{


  this.setState({valid:true});

  if (this.state.phoneNum.length != 10) {

    this.setState({
    valid:false,
    errorMessage:" يرجى التأكد من ادخال رقم التواصل يالصيغة  0XXXXXXXXX "});

    return;
}

const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (this.state.email === "" || !regexp.test(this.state.email)) {
    this.setState({
      valid:false,
      errorMessage:" يرجى كتابة بريد الكتروني صحيح"});
    return;

   
  }

  if ( this.state.userName === ""){ 
   
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال الاسم"});
    return;
  }

  if (this.state.Descripiton === "" ) { // provide better description
    
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال الوصف"});
    return;
  }

  // if (image === ""  ) {
  //   setValid(false);
  //   setErrorMessage("يرجى إختيار صورة")
  //   return;
  // }

  if (this.state.website ===""){
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال الموقع الإلكتروني بالشكل الصحيح"});
    return;
  }

  if(!this.state.website.endsWith('.com')){
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال الموقع الإلكتروني بالشكل الصحيح"});
    return;
  }

  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
   
  if (!pattern.test(this.state.website)){
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال الموقع الإلكتروني بالشكل الصحيح"});
    return;
  }
  

 
  if (!this.state.twitter.startsWith('@')){
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال حساب تويتر بالصيغة @example"});
    return;
    
  }


  const twitterExp =  /^(?:@)([A-Za-z0-9_]){1,15}$/
  if (!twitterExp.test(this.state.twitter) ){
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال حساب تويتر بالصيغة @example"});
    return;
  }

  const instagramExp = new RegExp('^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$')
  if (instagram != '' && !instagramExp.test(this.state.instagram) ){
    this.setState({
      valid:false,
      errorMessage:"يرجى ادخال حساب الإنستغرام بالشكل الصحيح"});
    return;

  }

  if (this.state.valid) {
    this.setState({
      errorMessage:null});
    this.handleUpdate();
    }
  }
  

    
   
      render() {

      const initialLayout = { width: Dimensions.get('window').width };
      
       const rout = {index: this.state.index, routes: this.state.routes}
       //Trademark 
        const FirstRoute = () => (
       
      <View style={[styles.scene, { backgroundColor: 'white' }]} >

          <View style={{alignSelf:'flex-end',flexDirection:'row-reverse',marginTop:10,marginLeft:10}}>
          <MaterialCommunityIcons name="tooltip-text-outline" color={colors.primaryBlue} size={30} />
                <Text style={[styless.fieldLabels],[{fontSize:17}]}> الوصف</Text>
                </View>
            <View style={styless.fields}>

                <TextInput
                  style={[styless.TextInput],[styles.textArea]}
                  placeholder=" وصف العلامة التجارية"
                  onChangeText={description => this.handleDescriptionChange({description})}
                  value={this.state.description} 
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical
                  textAlign='right'
                  autoCapitalize="none"
                />
              </View>
              <View style={[styless.fields]}>
        
              <FontAwesome name="tags" color={colors.primaryBlue} size={25}/>
                  <Text style={[styless.fieldLabels],[{fontSize:17,marginRight:10}]}> الفئة</Text>
              {/*<Dropdown
              label="الفئة"
              data={categories}
            onChangeText={(category) => this.handleCategoryChange(category)}
            containerStyle={{ width: 100, marginLeft: 155}}
              value={category}
              />*/ }
{/* 
<DropDownPicker
        items={[
      {label: 'المطاعم', value: 'المطاعم'},
      {label: 'المستلزمات', value: 'المستلزمات'},
      {label: 'الصحة', value: 'الصحة'},
      {label: 'الدورات', value: 'الدورات'},
      {label: 'التسوق', value: 'التسوق'},
      {label: 'الخدمات', value: 'الخدمات'},
        ]}
        multiple={false}
        defaultValue={''}
        containerStyle={{height: 40}}
        style={{backgroundColor: '#fafafa'}}
        itemStyle={{
            justifyContent: 'flex-start'
        }}
        dropDownStyle={{backgroundColor: '#fafafa'}}
        onChangeItem={item => setCategory(item)}
/> */}
                 </View>
                 <View style={styless.fields}>
              <MaterialCommunityIcons name="web" color={colors.primaryBlue} size={30} style={styless.fieldLabels} />
                <TextInput
                  style={styless.TextInput}
                  name="websites"
                  placeholder=" الموقع الإلكتروني"
                  onChangeText= {websites => this.handlewebsiteChange(websites)}
                  value={this.state.website}
                  autoCapitalize="none"
                />
              </View>

              <View style={styless.fields}>
              <MaterialCommunityIcons name="twitter" color={colors.primaryBlue} size={30} style={styless.fieldLabels} />
                <TextInput
                  style={styless.TextInput}
                  placeholder=" تويتر"
                  onChangeText={(twitter) => this.handleTwitterChange(twitter)}
                  value={ this.state.twitter}
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styless.fields}>
              <MaterialCommunityIcons name="instagram" color={colors.primaryBlue} size={30} style={styless.fieldLabels} />
                <TextInput
                  style={styless.TextInput}
                  placeholder=" انستغرام"
                  onChangeText={(instagram) => this.handleInstagramChange(instagram)}
                  value={this.state.instagram}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fields}>{/*<Upload/> */}</View>
          </View>
    );
    
    const SecondRoute = () => (
      <View style={[styles.scene, { backgroundColor: 'white' }]} >
           
              <View style={styless.fields}>
                
                <MaterialCommunityIcons name="account" color={colors.primaryBlue} size={30} style={styless.fieldLabels} />
                <TextInput
                  style={styless.TextInput}
                  placeholder="*الاسم"
                  onChangeText={ username => this.handleNameChange(username)}
                  defaultValue={this.state.userName}
                  autoCapitalize="none"
                />
              </View>
              <View style={styless.fields}>
                
                <MaterialCommunityIcons name="email" color={colors.primaryBlue} size={30} style={styless.fieldLabels} />

                <TextInput
                  style={styless.TextInput}
                  placeholder="*البريد الإلكتروني"
                  onChangeText = {email => this.handleEmailChange(email)}
                  value={this.state.email}
                  
                />
              </View>
              <View style={styless.fields}>
              <FontAwesome name="phone" color={colors.primaryBlue} size={30} style={styless.fieldLabels} />

                <TextInput
                  style={styless.TextInput}
                  placeholder="  (*** **** *05) رقم الجوال"
                  onChangeText= {phoneNums => this.handlePhoneChange(phoneNums)}
                  value={this.state.phoneNum}
                  autoCapitalize="none"
                />
              </View>
              <View style={[styless.fields]}>
              <FontAwesome name="lock" color={colors.primaryBlue} size={30} style={styless.fieldLabels} />
                <TextInput
                  style={styless.TextInput}
                  secureTextEntry
                  placeholder="*كلمة المرور"
                  value={this.state.password}
                  autoCapitalize="none"
                  editable={false}
                /></View>
                <View style={[styless.fields]}>
              <TouchableOpacity onPress= {() => navigation.navigate('resetPassword')}>
                  <Text style={styles.changePassword}>
                      هل ترغب بتغيير كلمة المرور؟
                  </Text>
              </TouchableOpacity>
              </View>
              
              
                  

          </View>
    );
    
    const ThirdRoute = () =>{
      return (
      <View style={[styles.scene, { backgroundColor: 'white' }]} >
         <Image
                source={require("../images/mapsmockup.png")}
  
                  style={{
                    height: 400,
                    width: 300

                  }}/>
      </View>
      );

    }
      
        const renderScene = SceneMap({
            first: FirstRoute,
            second: SecondRoute,
            third: ThirdRoute,
          });
        
          let categories = [{
      
            value: 'المطاعم',
          }, {
            value: 'المستلزمات',
          }, {
            value: 'الصحة',
          },{
            value: 'الدورات',
          }, {
            value: 'التسوق',
          }, {
            value: 'الخدمات',
          }
        ];

        const renderTabBar = props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: colors.primaryBlue }}
              style={{ backgroundColor: 'white' }}
              labelStyle={{color:'black'}}
            />
          );
    return(
       
         <View style={{flex:1,backgroundColor:'white' }}  > 
       

         <View style={{flexDirection:'row' ,marginTop:20, alignItems:'flex-start'}}>
             <TouchableOpacity>
       {/*  <Entypo name='chevron-left' size={30} color= {colors.primaryBlue }  onPress={()=> navigation.pop()} /> */}
         </TouchableOpacity>
         <Text style={styles.header}></Text>
         </View>
         <ScrollView showsVerticalScrollIndicator={false}>
        <TabView
        navigationState={rout}
        renderScene={renderScene}
        onIndexChange={index => this.setState({index: index})}
        initialLayout={initialLayout}
        style={styles.tab}
        renderTabBar={renderTabBar}
        

      >
          
      </TabView>
      </ScrollView>
      <TouchableOpacity style={styles.ButtonContainer} onPress={this.handleUpdate} >
                        <Text style={styles.appButtonText} >حفظ</Text>
                    </TouchableOpacity>
                    
      </View>
  
    );
    }
    
};

const styles = StyleSheet.create({
    container: {
      marginTop: 70,
   
    },
    scene: {
      flex: 1,
      backgroundColor:'red'
    },
    tab:{
        backgroundColor:'white',
        color:colors.primaryBlue,
        marginTop: 30,
    },
    ButtonContainer: {
        elevation: 8,
        backgroundColor: colors.primaryBlue,
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 50,
        alignItems:'center',
        margin:20,
        marginHorizontal:40,
        marginTop:20
      },
      appButtonText: {
        fontSize: 18,
        color: "#fff",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      textArea:{
        width:250,
        paddingTop: 30,
        borderColor:'black',
        borderBottomWidth:1,
        textAlign: 'center',
        height: 50,
        borderWidth: 2,
        borderColor: '#9E9E9E',
        borderRadius: 20 ,
        backgroundColor : "#FFFFFF",
        height: 150,
    marginRight:20,
      },
      changePassword:{
        fontSize:12,
        color:colors.primaryGrey, 
        marginRight:27

      },
      header:{
        marginHorizontal:140,
        marginTop:10, 
        color: colors.primaryBlue,
        fontSize: 25
      }
  });
  





 
