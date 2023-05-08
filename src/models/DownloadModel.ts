export interface DownloadModelCallBack {
  completedDownloadingFile: (
    completedDownloadingFile: CompletedDownloadingFile
  ) => void
  downloadingError: (downloadingError: DownloadingError) => void
}

export interface CompletedDownloadingFile {
  // It's return left file count of downloading in queue.
  filesLeft: number
}

export interface DownloadingError {
  // It's  message error if download failed for some reason.
  message: string
}
