import * as alt from 'alt-client';
import * as native from 'natives';

let document: alt.RmlDocument;

function drawTemporaryText(msg: string, timeout: number) {
    const everyTick = alt.Utils.drawText2d(
        msg,
        { x: 0.5, y: 0.1 },
        4,
        0.8,
        new alt.RGBA(255, 255, 255, 255),
        true,
        true
    );

    alt.setTimeout(() => everyTick.destroy(), timeout);
}

function onSubmit() {
    const username = document.getElementByID('username').getAttribute('value');
    const password = document.getElementByID('password').getAttribute('value');

    // player: alt.Player, username: string, password: string
    alt.emitServer('crc-login-or-register', username, password);
    native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_MP_SOUNDSET', true);
}

alt.onServer('crc-login-request-auth', async () => {
    native.triggerScreenblurFadeIn(0);
    native.invalidateIdleCam();
    native.invalidateCinematicVehicleIdleMode();
    native.displayRadar(false);
    native.setTimecycleModifier('glasses_black');

    // Show RMLUI window
    document = new alt.RmlDocument('/client/rmlui/index.rml');
    document.show();
    document.focus();
    alt.toggleRmlControls(true);
    alt.showCursor(true);
    alt.toggleGameControls(false);

    const submitButton = document.getElementByID('submit');
    submitButton.on('click', onSubmit);
    submitButton.on('mouseover', () => {
        native.playSoundFrontend(-1, 'HIGHLIGHT', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
    });

    const username = document.getElementByID('username');
    username.on('keydown', () => {
        native.playSoundFrontend(-1, 'Cycle_Item', 'DLC_Dmod_Prop_Editor_Sounds', false);
    });
    username.focus();

    const password = document.getElementByID('password');
    password.on('keydown', () => {
        native.playSoundFrontend(-1, 'Cycle_Item', 'DLC_Dmod_Prop_Editor_Sounds', false);
    });
});

alt.onServer('crc-login-failed', (msg: string) => {
    drawTemporaryText(msg, 3000);
});

alt.onServer('crc-login-done', () => {
    native.triggerScreenblurFadeOut(1000);
    native.clearTimecycleModifier();
    native.displayRadar(true);

    alt.toggleGameControls(true);
    alt.toggleRmlControls(false);
    alt.showCursor(false);

    document.destroy();
    document = undefined;
});

try {
    alt.loadRmlFont('/client/rmlui/fonts/inter-regular.ttf', 'inter-regular', false, false);
    alt.loadRmlFont('/client/rmlui/fonts/inter-black.ttf', 'inter-black', false, true);
    alt.loadRmlFont('/client/rmlui/fonts/inter-bold.ttf', 'inter-bold', false, true);
} catch (err) {}

alt.on('disconnect', () => {
    native.clearTimecycleModifier();
    native.triggerScreenblurFadeOut(0);
    native.doScreenFadeIn(0);
    native.busyspinnerOff();
});
