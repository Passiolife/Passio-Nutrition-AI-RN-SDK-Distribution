import { useEffect, useState } from 'react'

import {
  CompletedDownloadingFile,
  DownloadingError,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v2'
import { downloadFile } from './utils/downloadFile'

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
  const [localModelURLs, setLocalModelURLs] = useState<string[] | undefined>()
  const [missingFiles, setMissingFiles] = useState<string[]>([])
  const [loadingState, setLoadingState] = useState<SDKStatus>('init')
  const [leftFile, setDownloadingLeft] = useState<number | null>(null)

  useEffect(() => {
    async function configure() {
      try {
        const status = await PassioSDK.configure({
          key: key,
          debugMode: debugMode,
          autoUpdate: autoUpdate,
          localModelURLs: autoUpdate ? undefined : localModelURLs,
        })
        switch (status.mode) {
          case 'notReady':
            setMissingFiles(status.missingFiles)
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
  }, [key, localModelURLs, debugMode, autoUpdate])

  useEffect(() => {
    if (!missingFiles.length) {
      return
    }
    async function download() {
      setLoadingState('downloading')
      const downloads = missingFiles.map(downloadFile)
      try {
        const localFiles = await Promise.all(downloads)
        setLocalModelURLs(localFiles)
      } catch (err) {
        console.error(`PassioSDK Error ${err}`)
        setLoadingState('error')
      }
    }
    download()
  }, [missingFiles])

  useEffect(() => {
    const callBacks = PassioSDK.onDowloadingPassioModelCallBacks({
      completedDownloadingFile: ({ filesLeft }: CompletedDownloadingFile) => {
        console.log('filesLeft ===>', filesLeft)
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
