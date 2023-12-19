// import react
import { useEffect, useState } from "react";

// import react-native component
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, Keyboard, TouchableOpacity, SectionList, Alert } from "react-native";

// import 3rd party component
import { GiftedChat, Bubble } from "react-native-gifted-chat"; // gifted-chat

// import Firebase
import { collection, getDocs, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {

    // extract props
    const { userID, name, bgColor } = route.params;  // backgroundColor for view

    // define useState
    const [messages, setMessages] = useState([]);

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

    // load static system message and user message
    useEffect(() => {
        // TESTING ONLY: REMOVED FROM USE
        // setMessages([
        //     {
        //         _id: 1,
        //         text: "Hello developer",
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: "React Native",
        //             avatar: "https://placeimg.com/140/140/any",
        //         },
        //     },
        //     {
        //         _id: 2,
        //         text: 'You have entered the chat room',
        //         createdAt: new Date(),
        //         system: true,
        //     },
        // ]);

        // define query to fetch messages object and sort by createdAt descending
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

        // detect messages object changes and update messages object
        const unsubMessages = onSnapshot(q, (documentSnapshot) => {
            // load messages
            let newMessages = [];
            documentSnapshot.forEach(doc => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis()),
                });
            });
            setMessages(newMessages);
        })

        // clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);
    
    // set chatroom title to user specified name
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

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