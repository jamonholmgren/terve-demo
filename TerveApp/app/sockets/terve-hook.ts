import { MutableRefObject, useEffect, useRef } from "react"
import { join } from "./terve-socket"
import { TerveCallbacks } from "./terve-types"

type UseChannelHookReturn = { send: (msg: any) => void }

/**
 * Convenience hook to clean up some boilerplate.
 */
export function useChannelRoom(roomName: string, callbacks: TerveCallbacks): UseChannelHookReturn {
  const sendUpdate = useRef(undefined)

  useEffect(() => {
    const { send, leave } = join(roomName, callbacks)
    sendUpdate.current = send
    return () => {
      // clearInterval(timer)
      leave()
    }
  }, [])

  const send = (msg: any) => {
    if (sendUpdate.current) {
      sendUpdate.current(msg)
    } else {
      console.error("Not connected to channel, can't send message: ", msg)
    }
  }

  return { send }
}
