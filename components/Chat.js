import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

const Chat = ({ route, navigation }) => {

    const { name, bgColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: bgColor}]}>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    }
})

export default Chat;