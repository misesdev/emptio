import { useService } from "@src/providers/ServiceProvider"
import { useTranslateService } from "@src/providers/TranslateProvider"
import { MessageActionType } from "../conversation/commons/OptionGroup"
import { showDeleteOptions } from "../conversation/commons/DeleteOptionsBox"
import { RefObject, useCallback, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import useChatStore from "@services/zustand/useChatStore"
import { pushMessage } from "@services/notification"
import { User } from "@services/user/types/User"
import { Utilities } from "@src/utils/Utilities"
import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { BackHandler, FlatList } from "react-native"

type Props = { 
    chatMessages: NDKEvent[];
    listRef: RefObject<FlatList>; 
    selectedItems: RefObject<Set<NDKEvent>>; 
}
const useConversation = ({ listRef, chatMessages, selectedItems }: Props) => {

    const { useTranslate } = useTranslateService()
    const [highLigthIndex, setHighlightIndex] = useState<number|null>(null)
    const { selectionMode, toggleSelectionMode } = useChatStore()
    const [shareVisible, setShareVisible] = useState(false)
    const { messageService } = useService()

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (selectionMode) {
                    toggleSelectionMode(false)
                    selectedItems.current?.clear()
                    return true 
                }
                return false 
            }

            const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)

            return () => backHandler.remove() 
        }, [selectionMode])
    )

    const focusMessage = useCallback((event: NDKEvent|null) => {
        try {
            if(event) 
            {
                const index = chatMessages.findIndex(e => e.id == event.id)
                if(index != -1) {
                    listRef.current?.scrollToIndex({ viewPosition: .5, animated: true, index })
                    setHighlightIndex(index)
                    //setTimeout(() => setHighlightIndex(null), 350)
                }
            }
        } catch {}
    }, [chatMessages, highLigthIndex, listRef])
    
    const forwardMessages = (follow: User) => {
        setShareVisible(false)
        selectedItems.current?.forEach(async event => {
            await messageService.send({ 
                receiver: follow.pubkey, 
                message: event.content, 
                forward: true 
            })
        })
        pushMessage(`${useTranslate("feed.videos.shared-for")} ${Utilities.getUserName(follow, 20)}`)
        selectedItems.current?.clear()
        toggleSelectionMode(false)
    }

    const onGroupAction = useCallback((option: MessageActionType) => {
        if(option == "delete") showDeleteOptions()
        if(option == "copy" && selectedItems.current) {
            toggleSelectionMode(false)
            Utilities.copyToClipboard([...selectedItems.current].map(e => e.content).reverse().join("\n\n"))
            selectedItems.current?.clear()
        }
        if(option == "forward") setShareVisible(true) 
        if(option == "cancel") {
            toggleSelectionMode(false)
            selectedItems.current?.clear()
        }
    }, 
        [selectionMode, toggleSelectionMode, setShareVisible, selectedItems.current])
    
    return {
        highLigthIndex,
        setHighlightIndex,
        shareVisible,
        setShareVisible,
        forwardMessages,
        focusMessage,
        onGroupAction
    }
}

export default useConversation
