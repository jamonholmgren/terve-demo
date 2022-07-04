# Example chat & game app using Elixir/Phoenix and Ignite+React Native

This is an example app that uses Phoenix channels to broadcast chat messages and also allows for realtime game updates.

<table>
<tr>
<td>
<img width="200" alt="image" src="https://user-images.githubusercontent.com/1479215/177112570-d8c5f2c3-10e5-4016-b7ab-b4780d88401a.png">
</td>
<td>
<img width="200" alt="image" src="https://user-images.githubusercontent.com/1479215/177112707-afa538c0-9c38-48e9-b1e8-6dfc50777996.png">
</td>
</tr>
</table>

## React Native

On the React Native side, we're using [Ignite](https://github.com/infinitered/ignite) and Expo. This is in the folder `TerveApp`.

The important parts are mainly in:

```
TerveApp
  app
    sockets
      terve-socket.ts
    screens
      chat
        chat-screen.tsx
      game
        game-screen.tsx
```

The `terve-socket.ts` file exports a `join` function that lets you do something like this:

```tsx
const { send, leave } = join("lobby", {
  onJoined(resp) {
    console.tron.logImportant("room joined", resp);
  },
  onClosed() {
    console.tron.logImportant("room closed");
  },
  onError(err) {
    console.tron.logImportant("socket error", err);
  },
  onMessage(msg) {
    console.tron.logImportant("socket message", msg);
  },
});

// send can send to the channel
send({ something: "here" });
// leave will leave the channel
leave();
```

Since you often want to run this in a hook, I've provided one
in `terve-hook.ts` in that same folder:

```tsx
const { send } = useChannelRoom("lobby", {
  onMessage(msg) {
    // do something with onMessage, like add the
    // chat to your state or something
  },
});

// do something with `send`, like add new messages
// or update the game state
send({ can: "really be anything" });
```

It'll automatically leave that channel when the component unmounts.

## Elixir/Phoenix

In the `terve` folder, you'll find an Elixir + Phoenix app. This app contains just a few important files:

```
terve
  lib
    terve_web
      channels
        room_channel.ex
        user_socket.ex
      endpoint.ex
```

You'll see the changes made to enable some channels, ready to connect via sockets.

That's it for now! I spent an evening getting all this to work.

Thanks to many different articles for their help during this, including these:

- https://shift.infinite.red/prototyping-a-chat-app-with-react-native-and-phoenix-5e65677a8217
- https://hexdocs.pm/phoenix/channels.html#tying-it-all-together

Jamon Holmgren ([@jamonholmgren](https://twitter.com/jamonholmgren) on Twitter)
