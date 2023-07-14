import * as alt from 'alt-server';
import * as crc from '@stuyk/cross-resource-cache';
import { Account } from 'alt-crc';

const COLLECTION_NAME = 'account';
const loginRequest: { [id: string]: boolean } = {};
let isDatabaseReady = false;

crc.database.onReady(() => {
    isDatabaseReady = true;
});

alt.log(`~c~[CRC] Login Started`);

alt.on('playerConnect', (player: alt.Player) => {
    loginRequest[player.id] = true;
    player.dimension = player.id + 1;
    player.visible = false;
    player.frozen = true;
    player.pos = new alt.Vector3(0, 0, 100);
    player.emit('crc-login-request-auth');
});

alt.on('playerDisconnect', (player: alt.Player) => {
    delete loginRequest[player.id];
});

/**
 * Creates an account, and returns the account data.
 *
 * @param {string} username
 * @param {string} password
 * @return {Promise<Account>}
 */
async function createAccount(username: string, password: string) {
    const passwordHash = crc.utility.password.create(password);
    const documentID = await crc.database.create<Account>({ username, password: passwordHash }, COLLECTION_NAME);
    return await crc.database.get<Account>({ _id: documentID }, COLLECTION_NAME);
}

alt.onClient('crc-login-or-register', async (player: alt.Player, username: string, password: string) => {
    if (!username || !password) {
        player.emit('crc-login-failed', 'No username or password provided');
        return;
    }

    if (!loginRequest[player.id]) {
        player.kick('No login request found. Rejoin server.');
        return;
    }

    // Lookup account by username
    let account: Account = await crc.database.get<Account>({ username }, COLLECTION_NAME);
    if (!account) {
        account = await createAccount(username, password);
    }

    // Check if the password matches, if not cancel
    if (!crc.utility.password.check(password, account.password)) {
        player.emit('crc-login-failed', 'Bad username or password');
        return;
    }

    player.emit('crc-login-done');

    alt.log(`Authorized: ${account.username}`);

    player.dimension = 0;

    // player: alt.Player, account: { _id: string, username: string, password: string }
    alt.emit('crc-login-finish', player, account);
});
