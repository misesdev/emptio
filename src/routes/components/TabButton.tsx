import React, { useEffect, useRef } from "react"
import { TouchableOpacity, StyleSheet } from "react-native"
import * as Animatable from 'react-native-animatable'

type Props = {
    onPress?: any,
    accessibilityState?: any,
    children: any
}

const TabButton = ({ onPress, accessibilityState, children }: Props) => {

    const viewRef = useRef(null)
    const focused = accessibilityState.selected

    useEffect(() => {
        if (focused) {
            viewRef.current.animate({ 0: { scale: .5 }, 1: { scale: 1.5 } })
        } else {
            viewRef.current.animate({ 0: { scale: 1.5 }, 1: { scale: 1 } })
        }
    }, [focused])

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.container, { top: 0 }]}
        >
            <Animatable.View
                ref={viewRef}
                duration={200}
            >
                {children}
            </Animatable.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
    }
})

export default TabButton