import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, Keyboard, TouchableOpacity } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
    const { name, bgColor } = route.params;
    const [messages, setMessages] = useState([]);
    const onSend = (newMessage) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage))
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
    }

    // load static system message and user message
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: "Hello developer",
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            },
            {
                _id: 2,
                text: 'You have entered the chat room',
                createdAt: new Date(),
                system: true,
            },
        ]);
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
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
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