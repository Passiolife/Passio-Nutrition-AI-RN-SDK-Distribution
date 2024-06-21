import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'

const { width: ScreenWidth } = Dimensions.get('window')

export const TypingView = () => {
  const styles = ResponseViewStyle()
  const content = 'typing...'

  return (
    <TouchableOpacity style={[styles.msgView, styles.receivedMsgView]}>
      <Text style={[styles.msgText, styles.receivedMsg]}>{content}</Text>
    </TouchableOpacity>
  )
}

// Styles for the component
const ResponseViewStyle = () =>
  StyleSheet.create({
    msgView: {
      maxWidth: ScreenWidth * 0.75,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      marginVertical: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    receivedMsgView: {
      backgroundColor: '#6366F1',
      alignSelf: 'flex-start',
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 0,
    },

    msgText: {
      fontSize: 14,
      fontWeight: '400',
    },

    receivedMsg: {
      color: '#FFFFFF',
    },
  })
