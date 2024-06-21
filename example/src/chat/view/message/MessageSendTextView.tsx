import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'

interface MessageSendTextViewProps {
  msg: string
}

const { width: ScreenWidth } = Dimensions.get('window')

export const MessageSendTextView = ({ msg }: MessageSendTextViewProps) => {
  const styles = messageSendTextView()
  return (
    <View style={[styles.msgView, styles.sentMsgView]}>
      <Text style={[styles.msgText, styles.sentMsg]}>{msg}</Text>
    </View>
  )
}

const messageSendTextView = () =>
  StyleSheet.create({
    msgView: {
      maxWidth: ScreenWidth * 0.75,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      marginVertical: 16,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },

    sentMsgView: {
      backgroundColor: '#E0E7FF',
      alignSelf: 'flex-end',
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 8,
    },
    msgText: {
      fontSize: 14,
      fontWeight: '400',
    },
    sentMsg: {
      color: '#111827',
    },
  })
