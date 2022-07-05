import React, { FC, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { GestureResponderEvent, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { anonymousUserId } from "../chat/user-id"
import { Character } from "./character"
import { useStores } from "../../models"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const GAME_CANVAS: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.deepPurple,
}

function throttle<T>(func: T, delay: number) {
  let timeout = null

  const newFunc = function (...args) {
    if (timeout === null) {
      func.apply(this, args)

      timeout = setTimeout(() => {
        timeout = null
      }, delay)
    }
  } as unknown as T

  return newFunc
}

export const GameScreen: FC<StackScreenProps<NavigatorParamList, "game">> = observer(
  function GameScreen() {
    const rootStore = useStores()

    useEffect(() => {
      // add my game character if it doesn't exist
      console.tron.logImportant("useEffect")
      if (!rootStore.gameCharacters.find((c) => c.name === anonymousUserId)) {
        rootStore.addGameCharacter({
          name: anonymousUserId,
          x: Math.floor(Math.random() * 300) + 50,
          y: Math.floor(Math.random() * 300) + 50,
        })
      }
    }, [])

    /**
     * Throttle the sending of messages to the server
     * since we don't need to jam through thousands of
     * updates per second every time the user moves their
     * finger.
     */
    const onMove = React.useCallback(
      throttle((event: GestureResponderEvent) => {
        const { nativeEvent } = event
        const { locationX, locationY } = nativeEvent
        const myCharacter = rootStore.gameCharacters.find((c) => c.name === anonymousUserId)

        if (myCharacter) {
          // update the targetX and targetY on the character
          myCharacter.move(locationX, locationY)
        }
      }, 16),
      [throttle],
    )

    // need a ref to the canvas to ensure we are capturing the right
    // touches.
    const canvasRef = useRef(null)

    return (
      <Screen style={ROOT} preset="fixed">
        <Text preset="header" text="game" />
        <View
          ref={canvasRef}
          style={GAME_CANVAS}
          onMoveShouldSetResponder={(event) => true}
          onResponderMove={onMove}
        >
          {rootStore.gameCharacters.map((character) => (
            <Character character={character} key={character.name} />
          ))}
        </View>
      </Screen>
    )
  },
)
