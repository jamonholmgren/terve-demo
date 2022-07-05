import React, { useEffect, useRef } from "react"
import { Text } from "../../components"
import { color } from "../../theme"
import { Animated } from "react-native"
import { anonymousUserId, randomUsername } from "../chat/user-id"
import { GameCharacter } from "../../models"
import { observer } from "mobx-react-lite"

export const Character = observer(function Character({ character }: { character: GameCharacter }) {
  const xAnim = useRef(new Animated.Value(character.x)).current
  const yAnim = useRef(new Animated.Value(character.y)).current

  useEffect(() => {
    Animated.spring(xAnim, {
      toValue: character.x,
      useNativeDriver: false,
      isInteraction: true,
    }).start()
    Animated.spring(yAnim, {
      toValue: character.y,
      useNativeDriver: false,
      isInteraction: true,
    }).start()
  }, [character.x, character.y])

  const backgroundColor =
    anonymousUserId === character.name ? color.palette.orangeDarker : color.palette.angry

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: xAnim,
        top: yAnim,
        borderRadius: 25,
        backgroundColor,
        overflow: "hidden",
        width: 50,
        height: 50,
        marginLeft: -25,
        marginTop: -25,
        borderWidth: 2,
        borderColor: color.palette.orange,
        borderStyle: "solid",
      }}
    >
      <Text
        style={{
          color: color.palette.white,
          fontSize: 20,
          padding: 10,
          textAlign: "left",
          textAlignVertical: "center",
        }}
        key={character.name}
        text={character.name}
      />
    </Animated.View>
  )
})
