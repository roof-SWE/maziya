import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image
} from 'react-native';
//import ImagePicker from 'react-native-image-picker';
import colors from '../constants/colors'
import * as Progress from 'react-native-progress';
import {storage}  from '../config/firebase';


//reference: https://www.instamobile.io/mobile-development/react-native-firebase-storage/

/*
export default function UploadImage() {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    const selectImage = () => {
        const options = {
          maxWidth: 2000,
          maxHeight: 2000,
          storageOptions: {
            skipBackup: true,
            path: 'images'
          }
        };
        ImagePicker.showImagePicker(options, response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const source = { uri: response.uri };
            console.log(source);
            setImage(source);
          }
        });
      };

      const uploadImage = async () => {
        const { uri } = image;
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      
        setUploading(true);
        setTransferred(0);
      
        const task = storage.ref(filename).putFile(uploadUri);
      
        // set progress state
        task.on('state_changed', snapshot => {
          setTransferred(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
        });
      
        try {
          await task;
        } catch (e) {
          console.error(e);
        }
      
        setUploading(false);
      
        Alert.alert(
          'Photo uploaded!',
          'Your photo has been uploaded to Firebase Cloud Storage!'
        );
      
        setImage(null);
      };
  

      return (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
            <Text style={styles.buttonText}>Pick an image</Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {image !== null ? (
              <Image source={{ uri: image.uri }} style={styles.imageBox} />
            ) : null}
            {uploading ? (
              <View style={styles.progressBarContainer}>
                <Progress.Bar progress={transferred} width={300} />
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                <Text style={styles.buttonText}>Upload image</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      );
        
}
  */        


       

  const styles = StyleSheet.create({
      
        uploadButton: {
            borderRadius: 5,
            width: 150,
            height: 50,
            backgroundColor: colors.primaryBlue,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20
          },
          buttonText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold'
          }
      }
  );
