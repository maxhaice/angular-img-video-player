export interface ApiCallPlayListInterface{
  screenKey: string,
  breakpointInterval: number,
  playlists: PlayList[],
}

export interface PlayList{
  channelTime: number,
  playlistKey: string,
  playlistItems: PlayListItem[]
}

export interface PlayListItem{
  creativeKey: string,
  creativeLabel: string,
}
