import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import React from 'react'
import { Images } from '../../assets'

interface BottomBarProps {
  inputValue: string
  textInputChnageHandler: (val: string) => void
  sendBtnHandler: () => void
  plusIconHandler?: () => void
  sending: boolean
}

export const BottomBar = ({
  inputValue,
  sendBtnHandler,
  textInputChnageHandler,
  plusIconHandler,
  sending,
}: BottomBarProps) => {
  const styles = BottomBarStyle()
  return (
    <View style={styles.row}>
      <View style={[styles.row, styles.inputContainer]}>
        <TouchableOpacity onPress={plusIconHandler} style={styles.plusIconView}>
          <Image
            source={Images.PLUS_ICON}
            resizeMode="contain"
            style={styles.plusIcon}
          />
        </TouchableOpacity>
        <TextInput
          placeholder="Type your message here..."
          style={styles.input}
          value={inputValue}
          onChangeText={(val) => textInputChnageHandler(val)}
        />
      </View>
      <View>
        {sending ? (
          <ActivityIndicator style={styles.sendBtn} />
        ) : (
          <TouchableOpacity onPress={sendBtnHandler} style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

// Styles for the component
const BottomBarStyle = () =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 42,
    },
    inputContainer: {
      flex: 1,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      padding: 1,
      height: '100%',
    },
    plusIcon: {
      width: 16,
      height: 16,
    },
    plusIconView: {
      paddingHorizontal: 14,
      backgroundColor: '#4F46E5',
      borderRadius: 4,

      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      fontSize: 14,
      fontWeight: '400',
      marginHorizontal: 16,
    },
    sendBtn: {
      paddingHorizontal: 16,
      backgroundColor: '#4F46E5',
      borderRadius: 6,
      marginStart: 8,
      minWidth: 60,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendBtnText: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      color: '#fff',
    },
  })
