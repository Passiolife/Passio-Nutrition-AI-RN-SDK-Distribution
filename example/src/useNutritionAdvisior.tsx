import { useEffect, useState } from 'react'

import {
  NutritionAdvisor,
  PassioAdvisorMessageResultStatus,
  PassioAdvisorResponse,
} from '@passiolife/nutritionai-react-native-sdk-v3'
import type { ChatEntity } from './chat/model/chat'

export type SDKStatus = 'Success' | 'Error' | 'Init'

export const useNutritionAdvisor = () => {
  const [configureStatus, setConfigureStatus] = useState<SDKStatus>('Init')
  const [messages, setMessage] = useState<ChatEntity[]>([])
  const [sending, setSending] = useState(false)
  const [ingredientAdvisorResponse, setIngredientAdvisorResponse] =
    useState<PassioAdvisorResponse | null>(null)

  useEffect(() => {
    const initializeNutritionAdvisor = async () => {
      try {
        const status = await NutritionAdvisor.configure('PASSIO_ADVISOR_KEY')
        if (status?.status === 'Success') {
          const conversationResponse = await NutritionAdvisor.initConversation()
          setConfigureStatus(
            conversationResponse?.status === 'Success' ? 'Success' : 'Error'
          )
        } else {
          setConfigureStatus('Error')
        }
      } catch (err) {
        console.error(`PassioSDK Error ${err}`)
        setConfigureStatus('Error')
      }
    }

    initializeNutritionAdvisor()
  }, [])

  const handleAdvisorResponse = async (
    response: PassioAdvisorMessageResultStatus | null,
    message: string | undefined
  ) => {
    setMessage((item) => {
      console.log('response', response)
      if (response?.status === 'Success') {
        const chatResponse: ChatEntity = {
          type: 'response',
          response: response.response,
        }
        return [...item.filter((it) => it.type !== 'typing'), chatResponse]
      } else {
        const chatResponse: ChatEntity = {
          type: 'response',
          response: null,
          message: message,
          error: response?.message,
        }
        return [...item.filter((it) => it.type !== 'typing'), chatResponse]
      }
    })
  }

  const sendMessage = async (message: string) => {
    setMessage((item) => {
      return [
        ...item,
        {
          type: 'text',
          message: message,
        },
        {
          type: 'typing',
        },
      ]
    })
    setSending(true)
    const response = await NutritionAdvisor.sendMessage(message)
    setSending(false)
    handleAdvisorResponse(response, message)
  }

  const sendImage = async (imgUrl: string) => {
    setMessage((item) => {
      return [
        ...item,
        {
          type: 'image',
          uri: imgUrl,
        },
        {
          type: 'typing',
        },
      ]
    })
    setSending(true)
    try {
      const response = await NutritionAdvisor.sendImage(imgUrl)
      handleAdvisorResponse(response, imgUrl)
    } catch (err) {
      console.log('sendImage error', err)
    } finally {
      setSending(false)
    }
  }

  const fetchIngredients = async (response: PassioAdvisorResponse) => {
    setSending(true)
    const responseOfIngredients = await NutritionAdvisor.fetchIngredients(
      response
    )
    if (responseOfIngredients?.status === 'Success') {
      setIngredientAdvisorResponse(responseOfIngredients.response)
    } else {
      console.log('failed response body ==>', JSON.stringify(response))
      console.log(
        'failed response body message ==>',
        JSON.stringify(responseOfIngredients)
      )
      console.warn(responseOfIngredients?.message)
    }
    setSending(false)
  }

  return {
    configureStatus,
    messages,
    ingredientAdvisorResponse,
    sending,
    sendMessage,
    sendImage,
    fetchIngredients,
    setIngredientAdvisorResponse,
  }
}
