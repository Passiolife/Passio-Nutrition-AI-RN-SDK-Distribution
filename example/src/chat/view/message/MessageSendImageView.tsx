import React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'

const { width: ScreenWidth } = Dimensions.get('window')

interface MessageSendImageViewProps {
  imgUrl: string | undefined
}

export const MessageSendImageView = ({ imgUrl }: MessageSendImageViewProps) => {
  const styles = ImageMessageViewStyle()

  return (
    <View style={[styles.msgView, styles.sentMsgView]}>
      <Image
        source={{ uri: `file://${imgUrl}` }}
        resizeMode="contain"
        style={styles.img}
      />
    </View>
  )
}

const ImageMessageViewStyle = () =>
  StyleSheet.create({
    msgView: {
      maxWidth: ScreenWidth * 0.75,
      borderTopEndRadius: 8,
      borderTopStartRadius: 8,
      marginVertical: 16,
      padding: 6,
    },

    sentMsgView: {
      backgroundColor: '#E0E7FF',
      alignSelf: 'flex-end',
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 8,
    },
    img: {
      width: 150,
      height: 150,
    },
  })
