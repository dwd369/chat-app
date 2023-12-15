import { StyleSheet, View, TextInput, Text, Button, TouchableOpacity, ImageBackground, Image } from "react-native";
import { useState } from "react";

const Start = ( { navigation } ) => {

    // define local backgroundImage
    const backgroundImage = require("../assets/background-image.png");
    const icon = require("../assets/icon.svg");

    // define useState
    const [name, setName] = useState();
    const [bgColor, setBgColor] = useState();

    // Start Screen UI
    return (
        <View style={styles.container}>
            {/* set backgroundImage */}
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                {/* Chat App title text */}
                <Text style={styles.title}>Chat App</Text>

                {/* create inputContainer to host Name textbox, background color buttons, and Start Chat button*/}
                <View style={styles.inputContainer}>
                    
                    {/* textInput to enter user name*/}
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your Name'
                    />
                    
                    {/* choose background color label text */}
                    <Text style={styles.colorButtonLabel}>Choose Background Color</Text>

                    {/* container to host the background color selection buttons */}
                    <View style={styles.colorButtonContainer}>
                        {/* Chat screen background color selection buttons */}
                        <TouchableOpacity
                            style={[styles.colorButton, styles.bgColor1]}
                            onPress={() => {
                                setBgColor(styles.bgColor1.backgroundColor)
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.colorButton, styles.bgColor2]}
                            onPress={() => {
                                setBgColor(styles.bgColor2.backgroundColor)
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.colorButton, styles.bgColor3]}
                            onPress={() => {
                                setBgColor(styles.bgColor3.backgroundColor)
                            }}
                        />
                        <TouchableOpacity
                            style={[styles.colorButton, styles.bgColor4]}
                            onPress={() => {
                                setBgColor(styles.bgColor4.backgroundColor)
                            }}
                        />
                    </View>

                    {/* button to go to Chat screen */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Chat', {name, bgColor})}
                    >
                        <Text style={styles.buttonText}>Start Chatting</Text>
                    </TouchableOpacity>
                    </View>

            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: '1',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
        resizeMode: "cover",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    title: {
        fontSize: 45,
        fontWeight: "600",
        color: "white",
        alignSelf: "center",
        marginBottom: 250
    },
    inputContainer: {
        height: "44%",
        width: "88%",
        backgroundColor: "white",
        alignItems: "center",
        marginBottom: 30,
        // textAlign: "center",
        justifyContent: "space-evenly",
        
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
    },
    colorButtonLabel: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        margin: 10,
        textAlign: "left",
        alignSelf: "flex-start",
        marginLeft: 20,
    },
    colorButtonContainer: {
        display: "flex",
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-evenly",
    },
    colorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    bgColor1: {
        backgroundColor: '#090C08'
    },
    bgColor2: {
        backgroundColor: '#474056'
    },
    bgColor3: {
        backgroundColor: '#8A95A5'
    },
    bgColor4: {
        backgroundColor: '#B9C6AE'
    },
    button: {
        backgroundColor: "#757083",
        width: "88%",
        alignItems: "center",
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        fontSize: 16,
        fontWeight: 600
    },
    buttonText: {
        color: '#fff',
    }

})

export default Start;