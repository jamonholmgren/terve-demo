import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { GiftedChat, IMessage } from "react-native-gifted-chat"
import { color, spacing } from "../../theme"
import { join } from "../../sockets/terve-socket"
import { anonymousUserId } from "./user-id"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}

export const ChatScreen: FC<StackScreenProps<NavigatorParamList, "chat">> = observer(
  function ChatScreen() {
    const [messages, setMessages] = React.useState<IMessage[]>([])
    const sendMessage = React.useRef(undefined)

    function addMessage(message: IMessage) {
      setMessages((oldMessages) => [message, ...oldMessages])
    }

    useEffect(() => {
      const { send, leave } = join("lobby", {
        onJoined(resp) {
          console.tron.logImportant("room joined", resp)
        },
        onClosed() {
          console.tron.logImportant("room closed")
        },
        onError(err) {
          console.tron.logImportant("socket error", err)
        },
        onMessage(msg) {
          console.tron.logImportant("socket message", msg)
          addMessage(msg)
        },
      })

      // timer = setInterval(() => {
      //   send({ body: `Hey there from ${Platform.OS}!`, sent: Date.now() })
      // }, 1000)

      sendMessage.current = send

      return () => {
        // clearInterval(timer)
        leave()
      }
    }, [])

    return (
      <View testID="ChatScreen" style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
          <GiftedChat
            messages={messages}
            onSend={(messages) => {
              sendMessage.current(messages[0])
            }}
            user={{
              _id: anonymousUserId,
              name: anonymousUserId,
              avatar: "https://placeimg.com/140/140/any",
            }}
          />
        </Screen>
      </View>
    )
  },
)
