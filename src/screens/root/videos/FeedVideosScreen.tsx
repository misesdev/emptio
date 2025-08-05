import { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { View, FlatList, SafeAreaView } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import useFeedVideos from "./hooks/useFeedVideos"
import FeedVideoViewer from "./FeedVideoViewer"
import VideosHeader from "./commons/VideosHeader"
import { useCallback } from "react"
import theme from "@src/theme"

const FeedVideosScreen = ({ navigation }: StackScreenProps<any>) => {

    const { 
        savedVideos, paused, playingIndex, setPlayingIndex, 
        setSource, fetchVideos 
    } = useFeedVideos({ navigation })

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if(viewableItems.length > 0 && viewableItems[0].index != null) {
            setPlayingIndex(viewableItems[0].index)
        }
    }, [])

    const renderItem = useCallback(({ item, index }:{ item: NDKEvent, index: number }) => {
        return <FeedVideoViewer event={item} paused={index !== playingIndex || paused} />
    }, [playingIndex, paused])

    const EndLoader = () => (
        <View style={{ paddingVertical: 100 }}>
            <ActivityIndicator size={24} color={theme.colors.white} />
        </View>
    )

    return (
        <SafeAreaView style={theme.styles.container}>
            <FlatList pagingEnabled
                data={savedVideos}
                style={{ flex: 1 }}
                renderItem={renderItem}
                keyExtractor={(item: NDKEvent) => item.id??""}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 80 }} 
                onViewableItemsChanged={onViewableItemsChanged}
                onEndReached={fetchVideos}
                onEndReachedThreshold={.2}
                maxToRenderPerBatch={3}
                initialNumToRender={3}
                windowSize={3}
                snapToAlignment="center"
                decelerationRate="fast"
                ListFooterComponent={<EndLoader />}
                removeClippedSubviews // experimental
            />
            <VideosHeader onChangeSource={setSource} />
        </SafeAreaView>
    )
}

export default FeedVideosScreen
