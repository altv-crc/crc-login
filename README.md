# [CRC][TS] alt:V Login

<sup>Supported by <a href="https://github.com/orgs/altv-crc/">CRC</a></sup>

A login system that uses username / password for authentication.

Does not provide any account recovery methods. Just a simple login with username / password.

## Requires

- [crc-db](https://github.com/altv-crc/crc-db)
- [alt:V TypeScript Project](https://github.com/Stuyk/altv-typescript)
- [alt:V Cross Resource Cache](https://github.com/altv-crc/lib-cross-resource-cache)
- [VSCode - alt:V Event Suggestions](https://marketplace.visualstudio.com/items?itemName=stuyk.altv-event-suggestions)

_Highly recommended to get the extension, for better event handling._

## Installation

0. Install NPM packages

```ts
npm i @stuyk/cross-resource-cache
```

1. Install [crc-db resource](https://github.com/altv-crc/crc-db)

2. Create a folder in your `src` folder called `crc-login`.

3. Add the `TypeScript` files from this resource, to that folder.

4. Modify `server.toml` and ensure it loads whatever you named the folder.

In the case of the example above it should be `crc-login`.

```
resources = [ 
    'crc-db',
    'crc-login',
    'core',
    'dbg_reconnect'
]
```

1. Listen for `crc-login-finish` event.

When a bearer token is passed from a `client` you will get general account information through an `alt.on` event.

You should be listening to this event from some other resource.

```ts
interface Account {
    // MongoDB Document ID
    _id: string;
    // Account Data
    username: string;
    password: string;
}

alt.on('crc-login-finish', (player: alt.Player, account: Account) => {
    player.frozen = false;
    player.model = 'mp_m_freemode_01';
    player.visible = true;
    player.spawn(0, 0, 72);
});
```

# Preview

![](https://i.imgur.com/C8tRaYN.png)