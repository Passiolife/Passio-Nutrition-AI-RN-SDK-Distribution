/**
 * An object defining the configuration options for the Passio SDK
 */
export type ConfigurationOptions = {
  /**
   * Your Passio SDK key
   */
  key: string

  /**
   * Set to `true` to enable debug logging
   */
  debugMode?: boolean

  /**
   * Set to `true` to enable download of AI models from Passio's servers.
   * Occurs once per SDK version or again if the app is deleted and reinstalled.
   * Does not automatically update to future model versions. When the SDK is updated,
   * it will delete the old models and download the newest version.
   */
  autoUpdate?: boolean

  /**
   * Provide local copies of Passio models that you've either bundled within your app or
   * downloaded from your own servers. The SDK will copy and decrypt the files and delete
   * the original files to free up disk space.
   *
   * You don't need to supply the localModelURLs each time you configure the SDK.
   * Only if you configure the SDK and it returns status "notReady" with missingFiles listed
   * do you need to retrieve the missing files and call configure again, passing the file URLs
   * in this field.
   */

  localModelURLs?: string[]

  /**
   * Added remoteOnly flag to the PassioConfiguration class.
   * With this flag enabled, the SDK won't download the files needed for local recognition. In this case only remote recognition is possible
   * default: false
   */
  remoteOnly?: boolean
}
