var nativeEngine = uni.requireNativePlugin('zego-ZegoExpressUniAppSDK_ZegoExpressUniAppEngine');

/**
 * @typedef {Object} ZegoMediaPlayer
 * @property {number} index 
 */

export default class ZegoMediaPlayer {
    constructor(playerMap) {
        if (playerMap['playerID'] == null) {
            throw new Error('no leagal playerID');
        }
        this.index = playerMap['playerID'];
    }

    loadResource(resource, callback) {
        nativeEngine.loadResource(this.index, resource, callback);
    }
    start() {
        nativeEngine.startMediaPlayer(this.index);
    }

    enableAux(enable) {
        nativeEngine.enableMediaPlayerAux(this.index, enable);
    }
    stop() {
        nativeEngine.stopAudioEffectPlayer(this.index);
    }
    pause() {
        nativeEngine.pauseAudioEffectPlayer(this.index);
    }
    resume() {
        nativeEngine.resumeAudioEffectPlayer(this.index);
    }
}