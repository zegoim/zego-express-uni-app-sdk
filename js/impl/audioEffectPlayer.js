var nativeEngine = uni.requireNativePlugin('ZegoExpressUniAppSDK-ZegoExpressUniAppEngine');

/**
 * @typedef {Object} ZegoAudioEffectPlayer
 * @property {number} getIndex 
 */

export default class ZegoAudioEffectPlayer {
    constructor(playerMap) {
        if (playerMap['playerID'] == null) {
            throw new Error('no leagal playerID');
        }
        this.getIndex = playerMap['playerID'];
    }

    start(audioEffectID, path, config) {
        nativeEngine.startAudioEffectPlayer(this.getIndex, audioEffectID, path, config);
    }
    stop(audioEffectID) {
        nativeEngine.stopAudioEffectPlayer(this.getIndex, audioEffectID);
    }
    pause(audioEffectID) {
        nativeEngine.pauseAudioEffectPlayer(this.getIndex, audioEffectID);
    }
    resume(audioEffectID) {
        nativeEngine.resumeAudioEffectPlayer(this.getIndex, audioEffectID);
    }
}