import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import React from 'react'
import { BottomBar } from './view'
import { useChat } from './useChat'
import type { ChatEntity } from './model/chat'
import { MessageSendTextView } from './view/message/MessageSendTextView'
import { MessageResponseView } from './view/message/MessageResponseView'
import { MessageSendImageView } from './view/message/MessageSendImageView'
import { TypingView } from './view/message/TypingView'
import IngredientsView from './view/IngredientsView'

interface Props {
  onClose: () => void
}

export const ChatScreen = ({ onClose }: Props) => {
  const {
    inputMessage,
    messages,
    ingredientAdvisorResponse,
    sending,
    configureStatus,
    onChangeTextInput,
    onPressSendBtn,
    onPressPlusIcon,
    onCloseIngredientView,
    fetchIngredients,
  } = useChat()
  const styles = chatStyle()

  const renderItem = ({ item }: { item: ChatEntity }) => {
    switch (item.type) {
      case 'text':
        return (
          <MessageSendTextView
            msg={
              item.type === 'text'
                ? item.message ?? ''
                : item.response?.markupContent ?? ''
            }
          />
        )
      case 'response':
        return (
          <MessageResponseView
            response={item.response}
            error={item.error}
            onResponse={fetchIngredients}
          />
        )
      case 'image':
        return <MessageSendImageView imgUrl={item.uri} />
      case 'typing':
        return <TypingView />
      default:
        return <></>
    }
  }

  return (
    <>
      <SafeAreaView style={styles.body}>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={onClose}>
            <Image
              style={styles.closeText}
              source={require('../assets/back.png')}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.body, styles.container]}>
            <View style={styles.chatBody}>
              <View style={styles.chatBodyContainer}>
                <FlatList
                  data={messages}
                  keyExtractor={(_item, index) => index.toString()}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  style={styles.flatListStyle}
                />
              </View>
            </View>
            <View style={styles.bottomView}>
              {configureStatus === 'Success' ? (
                <BottomBar
                  inputValue={inputMessage}
                  textInputChnageHandler={onChangeTextInput}
                  sendBtnHandler={onPressSendBtn}
                  plusIconHandler={onPressPlusIcon}
                  sending={sending}
                />
              ) : (
                <ActivityIndicator />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
        {ingredientAdvisorResponse && (
          <IngredientsView
            response={ingredientAdvisorResponse}
            onClose={onCloseIngredientView}
          />
        )}
      </SafeAreaView>
    </>
  )
}

// Styles for the component
const chatStyle = () =>
  StyleSheet.create({
    body: {
      backgroundColor: 'rgba(242, 245, 251, 1)',
      flex: 1,
    },
    chatBody: {
      flex: 1,
    },
    bottomView: {
      marginBottom: 40,
    },
    container: {
      paddingHorizontal: 16,
    },
    closeButton: {},
    closeText: {
      margin: 16,
      height: 24,
      width: 24,
    },
    chatBodyContainer: {
      flex: 1,
    },
    flatListStyle: {
      marginBottom: 10,
    },
  })
