import * as alt from 'alt-server';
import { Account } from '../shared/interfaces';

declare module 'alt-server' {
    interface ICustomEmitEvent {
        'crc-login-finish': (player: alt.Player, account: Account) => void;
    }
}
