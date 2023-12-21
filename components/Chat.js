// import react
import { useEffect, useState } from "react";

// import react-native component
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, Keyboard, TouchableOpacity, SectionList, Alert } from "react-native";

// import 3rd party component
import { GiftedChat, Bubble, renderInputToolbar, InputToolbar } from "react-native-gifted-chat"; // gifted-chat

// import Firebase
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { AsyncStorage } from "@react-native-async-storage/async-storage"

const Chat = ({ db, route, navigation, isConnected }) => {

    // extract props
    const { userID, name, bgColor } = route.params;  // backgroundColor for view

    // define useState
    const [messages, setMessages] = useState([]);

    // initialize global variable to hold onSnap function in useEffect
    let unsubMessages;

    // set chatroom title to user specified name
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    // load static system message and user message
    useEffect(() => {

        if (isConnected === true) {

            // unregister current onSnapshot() listener to avoid registering multiple listeners when
            // useEffect code is re-executed
            if (unsubMessages) unsubMessages();
            unsubMessages = null;

            // define query to fetch messages object and sort by createdAt descending
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

            // detect messages object changes and update messages object
            unsubMessages = onSnapshot(q, (documentSnapshot) => {
                // load messages
                let newMessages = [];
                documentSnapshot.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis()),
                    });
                });
                cachedMessages(newMessages);
                setMessages(newMessages);
            });
        } else {
            loadCachedMessages();
        }

        // clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    // function to create and update message in AsyncStorage
    const cachedMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(newMessages))
        } catch (error) {
            console.log(error.messages);
        }
    };

    // function to load messages from AsyncStorage
    // if messages is not found in AsyncStorage, empty array is returned
    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem('messages') || [];
        setMessages(JSON.parse(cachedMessages));
    };

    // initialize GiftChat onSend
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    }

    // custom bubble to set user bubble to black and contact bubble to white
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#000"
                    },
                    left: {
                        backgroundColor: '#fff'
                    }
                }}
            />
        )
    };

    // function to render renderInputToolBar component for GiftedChat
    const renderInputToolbar = (props) => {
        if (isConnected) {
            return <InputToolbar {...props} />
        } else {
            return null;
        }
    }

    return (
        <View style={[styles.container, {backgroundColor: bgColor}]}>
            {/* load GiftChat component including:
                1. load messages
                2. create text messages
             */}
            
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={(messages) => onSend(messages)}
                user={{
                    _id: userID,
                    name: name,
                }}
                renderInputToolbar={renderInputToolbar}
            />
            
            
            {/* unhide messages in android when user taps on textarea  */}
            { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default Chat;