import { Linking, View } from "react-native"
import { ButtonLink } from "../../form/Buttons"
import theme from "@/src/theme"

type ScreenProps = { url: string }

const LinkError = ({ url }: ScreenProps) => {
    return (
        <View style={{ position: "relative", width: "100%", padding: 10 }}>
            <ButtonLink 
                label={url} 
                style={{ marginVertical: 0 }}
                color={theme.colors.blue} 
                onPress={() => Linking.openURL(url)}
            />
        </View>
    )
}

export default LinkError
