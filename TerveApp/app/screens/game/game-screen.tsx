import React, { FC, useEffect, useRef } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { anonymousUserId } from "../chat/user-id"
import { join } from "../../sockets/terve-socket"
import { CharacterType } from "./character-type"
import { Character } from "./character"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const GAME_CANVAS: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.deepPurple,
}

const throttle = (func, delay) => {
  let timeout = null

  return function (...args) {
    if (timeout === null) {
      func.apply(this, args)

      timeout = setTimeout(() => {
        timeout = null
      }, delay)
    }
  }
}

export const GameScreen: FC<StackScreenProps<NavigatorParamList, "game">> = observer(
  function GameScreen() {
    const startX = Math.floor(Math.random() * 300) + 50
    const startY = Math.floor(Math.random() * 300) + 50

    const [characters, setCharacters] = React.useState<CharacterType[]>([
      {
        name: anonymousUserId,
        // randomize position
        x: startX,
        y: startY,
      },
    ])
    const sendUpdate = React.useRef(undefined)

    function updateCharacter(character: CharacterType) {
      // console.tron.log("onMove", character.x, character.y)

      setCharacters((oldCharacters) => {
        const newCharacters = [...oldCharacters]
        const index = newCharacters.findIndex((c) => c.name === character.name)
        if (index >= 0) {
          newCharacters[index] = character
        } else {
          newCharacters.push(character)
        }
        return newCharacters
      })
    }

    useEffect(() => {
      const { send, leave } = join("game", {
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
          // console.tron.logImportant("socket message", msg)
          updateCharacter(msg)
        },
      })

      sendUpdate.current = send

      return () => {
        // clearInterval(timer)
        leave()
      }
    }, [])

    /**
     * Throttle the sending of messages to the server
     * since we don't need to jam through thousands of
     * updates per second every time the user moves their
     * finger.
     */
    const onMove = React.useCallback(
      throttle((event) => {
        const { nativeEvent } = event
        const { locationX, locationY } = nativeEvent

        // android sometimes sends a 0,0 location, so ignore
        if (locationX === 0 && locationY === 0) return

        const character = characters.find((c) => c.name === anonymousUserId)
        if (character) {
          // update the targetX and targetY
          sendUpdate.current({
            ...character,
            x: locationX,
            y: locationY,
          })
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
          // onStartShouldSetResponder={(event) => true}
          onMoveShouldSetResponder={(event) => {
            // check if it's the parent component or a child
            return true
          }}
          onResponderMove={onMove}
        >
          {characters.map((character) => (
            <Character character={character} key={character.name} />
          ))}
        </View>
      </Screen>
    )
  },
)
