import type { PassioAdvisorResponse } from '@passiolife/nutritionai-react-native-sdk-v3'
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'

const { width: ScreenWidth } = Dimensions.get('window')

interface MessageResponseViewProps {
  response: PassioAdvisorResponse | null | undefined
  error?: string
  onResponse: (response: PassioAdvisorResponse) => void
}

export const MessageResponseView = ({
  response,
  onResponse,
  error,
}: MessageResponseViewProps) => {
  const styles = ResponseViewStyle()

  const onPress = async () => {
    if (response) {
      onResponse(response)
    }
  }

  const content = response?.markupContent ?? ''
  const ingredients = response?.extractedIngredients

  const renderText = () => {
    let output = ''

    if (ingredients && ingredients.length > 0) {
      output = ingredients.map((i) => '\n' + i.recognisedName + '\n').join('')
    } else if (content) {
      output = content
    } else if (error) {
      output = error
    } else {
      output = 'Something went wrong, please try again'
    }
    return output
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.msgView, styles.receivedMsgView]}
    >
      <Text style={[styles.msgText, styles.receivedMsg]}>{renderText()}</Text>
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
