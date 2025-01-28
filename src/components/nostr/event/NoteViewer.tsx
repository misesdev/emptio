import theme from '@/src/theme';
import { View, Image, StyleSheet, Linking } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import { WebView } from 'react-native-webview';
import { Video } from 'react-native-video';
import { ButtonLink } from '@components/form/Buttons';

type VideoProps = { url: string }

const VideoScreen = ({ url }: VideoProps) => {
    return (
        <View style={styles.contentContainer}>
            <Video controls repeat
                source={{ uri: url }}
                style={styles.video}
                resizeMode='contain'
            />
        </View>
    )
}

type Props = { note: string }

const NoteViewer = ({ note }: Props) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const isImageUrl = (url: string): boolean => {
        return /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/.test(url.toLowerCase());
    };

    const isVideoUrl = (url: string): boolean => {
        return /\.(mp4|webm|ogg|mov|avi|mkv|flv)(\?.*)?$/.test(url.toLowerCase());
    };

    const renderText = (matchingString: string, matches: string[]) => {
        const url = matches[0];
        if (isImageUrl(url)) {
            return <Image source={{ uri: url }} style={styles.image} />
        } else if(isVideoUrl(url)) {
            return <VideoScreen url={url} />
            // return <View style={{}}>
            //     <ButtonLink 
            //         label={url} 
            //         color={theme.colors.blue} 
            //         onPress={() => Linking.openURL(url)}
            //     />
            // </View>
        } else {
            // return (
            //     <TouchableOpacity onPress={() => Linking.openURL(url)}>
            //         <View style={styles.previewContainer}>
            //             <WebView 
            //                 source={{ uri: url }}
            //                 style={[styles.webview,{ width: 280, height: "auto" }]}
            //                 scalesPageToFit={false}
            //                 scrollEnabled={false}
            //             />
            //         </View>
            //     </TouchableOpacity>
            // )
            return ( 
                <ButtonLink 
                    label={url} 
                    color={theme.colors.blue} 
                    onPress={() => Linking.openURL(url)}
                />
            )
        }
    }

    return (
        <View style={styles.webview}>
            <ParsedText
                style={styles.text}
                parse={[{ 
                    pattern: urlRegex, 
                    style: styles.link, 
                    renderText: renderText 
                }]}
            >
                {note}
            </ParsedText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    text: {
        color: theme.colors.gray,
    },
    link: {
        color: theme.colors.blue,
        textDecorationLine: 'underline',
    },
    image: {
        width: "90%",
        height: 200,
        margin: 10,
        resizeMode: 'contain',
        marginVertical: 10,
        borderRadius: 14,
    },
    previewContainer: {
        width: "96%",
        height: 130,
        marginVertical: 10,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.white
    },
    video: {
        width: "100%",
        height: 250,
        marginVertical: 10,
        borderRadius: 14,
    },
    webview: {
        padding: 0,
    },
    contentContainer: {
        flex: 1,
        padding: 10,
        paddingHorizontal: 50,
    },
    // video: {
    //   width: 350,
    //   height: 275,
    // },
    controlsContainer: {
        padding: 10,
    },
});

export default NoteViewer;

