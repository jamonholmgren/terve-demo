import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { Platform } from "react-native"
import { anonymousUserId } from "../../screens/chat/user-id"
import { withTerveSync } from "../../sockets/terve-mst"

export const GameCharacterModel = types
  .model("GameCharacter", {
    name: types.string,
    x: types.number,
    y: types.number,
  })
  .actions((self) => ({
    move(x: number, y: number) {
      self.x = x
      self.y = y
    },
  }))

export interface GameCharacter extends Instance<typeof GameCharacterModel> {}
export interface GameCharacterSnapshot extends SnapshotOut<typeof GameCharacterModel> {}
export interface GameCharacterSnapshotIn extends SnapshotIn<typeof GameCharacterModel> {}

const socketHost = Platform.OS === "ios" ? "localhost" : "10.0.2.2"

export const RootStoreModel = types
  .model("RootStore", {
    messages: types.array(types.frozen()),
    gameCharacters: types.array(GameCharacterModel),
  })
  .actions((store) => ({
    addMessage(message: string) {
      store.messages.unshift(message)
    },
    addGameCharacter(gameCharacter: GameCharacterSnapshotIn) {
      store.gameCharacters.push(gameCharacter)
    },
  }))
  .extend(
    withTerveSync({
      socketURL: `ws://${socketHost}:4000/socket`,
      clientId: anonymousUserId,
      storeName: "RootStore",
    }),
  )

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
