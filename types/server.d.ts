import * as alt from 'alt-server';
import { Account } from '../shared/interfaces';

declare module 'alt-server' {
    interface ICustomEmitEvent {
        'crc-login-finish': <T = Account>(player: alt.Player, account: T) => void;
    }
}
