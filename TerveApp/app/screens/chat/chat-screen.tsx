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
import { anonymousUserId } from "./user-id"
import { useStores } from "../../models"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}

export const ChatScreen: FC<StackScreenProps<NavigatorParamList, "chat">> = observer(
  function ChatScreen() {
    const rootStore = useStores()

    return (
      <View testID="ChatScreen" style={FULL}>
        <Screen style={CONTAINER} preset="fixed" backgroundColor={color.transparent}>
          <GiftedChat
            messages={rootStore.messages.slice()}
            onSend={(messages) => {
              rootStore.addMessage(messages[0])
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
