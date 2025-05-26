export interface Proxy {
  /// Set the base URL of the target proxy endpoint
  proxyUrl: string
  /// Set the needed headers to all of the requests
  proxyHeaders?: Record<string, string>
}
