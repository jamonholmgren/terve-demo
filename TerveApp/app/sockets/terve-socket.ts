import { Socket } from "phoenix"
import { Platform } from "react-native"

const userToken = "Something?"

const socketURLs = {
  // iOS simulators use localhost like you'd expect
  ios: "ws://localhost:4000/socket",

  // Android emulators use 10.0.2.2 for the host machine
  android: "ws://10.0.2.2:4000/socket",
}

let socketURL = socketURLs[Platform.OS] // TODO: put prod URL here

const socket = new Socket(socketURL, { params: { token: userToken } })
socket.connect()

type Callbacks = {
  onJoined?: (resp: any) => void
  onClosed?: () => void
  onMessage?: (resp: any) => void
  onTimeout?: (resp: any) => void
  onError?: (resp: any) => void
}

export function join(room: string, callbacks: Callbacks = {}) {
  // Now that you are connected, you can join channels with a topic:
  let channel = socket.channel(`room:${room}`, {})

  channel
    .join()
    .receive("ok", (resp) => {
      if (callbacks.onJoined) callbacks.onJoined(resp)
    })
    .receive("error", (resp) => {
      if (callbacks.onError) callbacks.onError(resp)
    })
    .receive("timeout", (resp) => {
      if (callbacks.onTimeout) callbacks.onTimeout(resp)
    })

  channel.on("message", (resp) => {
    if (callbacks.onMessage) callbacks.onMessage(resp)
  })

  channel.onError((event) => {
    if (callbacks.onError) callbacks.onError(event)
  })

  channel.onClose(() => {
    if (callbacks.onClosed) callbacks.onClosed()
  })

  return {
    send(payload: any) {
      channel.push("message", payload)
    },
    leave() {
      channel.leave()
    },
  }
}

export function disconnect() {
  socket.disconnect()
}
