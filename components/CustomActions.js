import { TouchableOpacity, Text, View,StyleSheet, Alert } from "react-native"; // import react-native
import { useActionSheet } from "@expo/react-native-action-sheet"; // import ActionSheet
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import * as Location from "expo-location"; // import expo location
import MapView from "react-native-maps"; // import react native mapview
import * as ImagePicker from "expo-image-picker"; // import image picker
import * as MediaLibrary from "expo-media-library"; // import media

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {

    // define instance of Action Sheet
    const actionSheet = useActionSheet();

    const onActionPress = () => {
    
        // define Action Sheet actions
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    // select image from photo library
                    case 0:
                        pickImage();
                        return;
                    // open camera to take photo
                    case 1:
                        takePhoto();
                        return;
                    // get current location
                    case 2:
                        getLocation();
                    default:
                }
            },
        );

        // function to fetch current location
        const getLocation = async () => {
            let permissions = await Location.requestForegroundPermissionsAsync();
            
            // check if permission is granted for accessing location
            // if granted, fetch longitude and latitude
                // else, let user know permission is not granted
            if (permissions?.granted) {
                // fetch location
                const location = await Location.getCurrentPositionAsync({});

                // check if location is fetched correctly
                // if yes, get longitude and latitude of location
                // if no, provide error alert
                if (location) {
                    onSend({
                        location: {
                            longitude: location.coords.longitude,
                            latitude: location.coords.latitude,
                        },
                    });
                } else  Alert.alert("Error occured while fetching location");
            } else Alert.alert("Permissions haven't been granted.");
        };


        // function to select image from media library
        const pickImage = async () => {
            // define and fetch user permission to access media library
            let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            // check if permission has been granted to access media library
            if (permissions?.granted) {
                // define ImagePacker method
                let result = await ImagePicker.launchImageLibraryAsync();

                // if image(s) is selected, upload impage to Firebase storage
                if (!result.canceled) {
                    await uploadAndSendImage(result.assets[0].uri);
                } else {
                    Alert.alert("Permissions haven't been granted.");
                }
            };
        };

        // function to open mobile camera to pickture and upload to chat
        const takePhoto = async () => {
            // define and fetch user permission to access camera
            let permissions = await ImagePicker.requestCameraPermissionsAsync();
            
            // check if permission has been granted to access camera
            if (permissions?.granted) {
                let result = await ImagePicker.launchCameraAsync();

                // if picture is taken via camera, upload image to Firebase storage
                if (!result.canceled) {
                    await uploadAndSendImage(result.assets[0].uri);
                } else {
                    Alert.alert("Permissions haven't been granted.");
                }
            }
            
        };

        // function to genereate unique reference name for images to upload
        const generateReference = (uri) => {
            const timeStampe = (new Date()).getTime();
            const imageName = uri.split("/")[uri.split("/").length - 1];
            return `${userID}-${timeStampe}-${imageName}`;
        };

        // function to upload and send image to Firebase
        // generateReference is called to generate unique name ID
        const uploadAndSendImage = async (imageURI) => {
            // prep image for upload
            const uniqueRefString = generateReference(imageURI);
            const newUploadRef = ref(storage, uniqueRefString);
            const response = await fetch(imageURI);
            const blob = await response.blob();

            // upload image
            uploadBytes(newUploadRef, blob).then(async (snapshot) => {
                const imageURL = await getDownloadURL(snapshot.ref);
                onSend({ image: imageURL });
            })
        };

    };
    

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 10,
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
});

export default CustomActions;