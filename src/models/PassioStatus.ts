/**
 * SDK is not ready due to missing model files. Please download the specified files
 * and call `configure` again, passing in the localFileURLs of the downloaded files.
 */
export type SDKNotReady = {
  mode: 'notReady'
  missingFiles: string[]
}

/**
 * SDK configuration successfully. This status much be reached before calling `startFoodDetection`.
 * It is possible that missing files may still be reported in the event that the SDK is aware of newer
 * model versions than the ones currently loaded. The SDK should still function normally in this case.
 */
export type SDKReadyForDetection = {
  mode: 'isReadyForDetection'
  activeModels: number
  missingFiles: string[]
}

/**
 * SDK failed to configure in an unrecoverable way. Please read the error message for more inforation.
 */
export type SDKError = {
  mode: 'error'
  errorMessage: string
}

/**
 * The possible states of the SDK after calling configure. Switch on status.mode to
 * access the data associated with each state.
 */
export type PassioStatus = SDKNotReady | SDKReadyForDetection | SDKError
