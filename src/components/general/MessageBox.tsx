import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { ButtonDanger } from "@components/form/Buttons";
import theme from "@src/theme";

type typeMessage = "alert" | "error" | "success";

type alertBoxProps = {
    title?: string,
    message: string,
    type?: typeMessage
}

var showMessageFunction: (config: alertBoxProps) => void;

const MessageBox = () => {

    const [title, setTitle] = useState<string>();
    const [type, setType] = useState<typeMessage>();
    const [message, setMessage] = useState<string>();
    const [baseColor, setBaseColor] = useState<string>(theme.colors.red);
    
    const [visible, setVisible] = useState(false);

    showMessageFunction = ({ title, message, type } : alertBoxProps) => {
        setType(type);
        setTitle(title);
        setMessage(message);
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
    }

    useEffect(() => { 
        switch(type) {
            case "alert":
                setBaseColor(theme.colors.gray)
                break;
            case "success":
                setBaseColor(theme.colors.green);
                break;
        }
    }, [visible]);

    return (
        <Modal animationType="slide" onRequestClose={handleClose} visible={visible}>
            <View style={[styles.box, {...StyleSheet.absoluteFillObject}]}>

                <Text style={{ color: baseColor, fontSize: 62, fontWeight: 'bold'}}> { title ?? "Oops!" } </Text>

                <Text style={styles.message}> {message} </Text>

                <View style={styles.sectionButtons}>
                    <ButtonDanger title="Close" style={{ minWidth: 120 }} onPress={handleClose} />
                </View>

            </View>
        </Modal>
    );
}

export const showMessage = (config: alertBoxProps) => {
    setTimeout(() => { showMessageFunction(config) }, 100);
}

const styles = StyleSheet.create({
    box: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.black
    },
    message: {
        fontSize: 16,
        paddingHorizontal: 5,
        paddingVertical: 50,
        marginVertical: 30,
        marginHorizontal: 15,
        color: theme.colors.gray,
        textAlign: 'center'
    },
    sectionButtons: {
        bottom: 50,
        position: "absolute",
        flexDirection: "row"
    }
});

export default MessageBox;