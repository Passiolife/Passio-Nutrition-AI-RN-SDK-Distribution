import { useEffect, useState } from 'react'

import {
  CompletedDownloadingFile,
  DownloadingError,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v2'

export type SDKStatus = 'init' | 'downloading' | 'error' | 'ready'

export const usePassioSDK = ({
  key,
  debugMode = false,
  autoUpdate = false,
}: {
  key: string
  debugMode?: boolean
  autoUpdate?: boolean
}) => {
  const [loadingState, setLoadingState] = useState<SDKStatus>('init')
  const [leftFile, setDownloadingLeft] = useState<number | null>(null)

  useEffect(() => {
    async function configure() {
      try {
        const status = await PassioSDK.configure({
          key: key,
          debugMode: debugMode,
          autoUpdate: autoUpdate,
        })
        switch (status.mode) {
          case 'notReady':
            return
          case 'isReadyForDetection':
            setLoadingState('ready')
            return
          case 'error':
            console.error(`PassioSDK Error ${status.errorMessage}`)
            setLoadingState('error')
            return
        }
      } catch (err) {
        console.error(`PassioSDK Error ${err}`)
        setLoadingState('error')
      }
    }
    configure()
  }, [key, debugMode, autoUpdate])

  useEffect(() => {
    const callBacks = PassioSDK.onDownloadingPassioModelCallBacks({
      completedDownloadingFile: ({ filesLeft }: CompletedDownloadingFile) => {
        setDownloadingLeft(filesLeft)
      },
      downloadingError: ({ message }: DownloadingError) => {
        console.log('DownloadingError ===>', message)
      },
    })
    return () => callBacks.remove()
  }, [])

  return {
    loadingState,
    leftFile,
  }
}

export const useCameraAuthorization = () => {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function getAuth() {
      const isAuthorized = await PassioSDK.requestCameraAuthorization()
      setAuthorized(isAuthorized)
    }
    getAuth()
  }, [])

  return authorized
}
