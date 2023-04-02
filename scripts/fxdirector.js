let fxDirector = {}

fxDirector.assetsURI = document.currentScript.src.replace(/\/[^/]+?\/[^/]+?$/, "/") + "assets/"
fxDirector.globalVolume = 1

fxDirector.playSound = function(path, volume, playbackRate) {
    let audio = new Audio(this.assetsURI + path)
    audio.volume = (volume || 1) * this.globalVolume
    audio.playbackRate = playbackRate || 1
    audio.play()
}

/** @type {HTMLAudioElement?} */
fxDirector._bgsAudio = null

fxDirector.playBgs = function(path, volume, playbackRate) {
    this.fadeoutBgs(0)

    let audio = new Audio(this.assetsURI + path)
    audio.volume = (volume || 1) * this.globalVolume
    audio.playbackRate = playbackRate || 1
    audio.loop = true
    audio.play()
    this._bgsAudio = audio
}

fxDirector.fadeoutBgs = function(duration) {
    if (!this._bgsAudio) { return }
    duration = duration || 1

    const target = this._bgsAudio
    const interval = setInterval(() => {
        if (duration == 0 || target.volume <= 0 || target.paused) {
            if (fxDirector._bgsAudio === target) { fxDirector._bgsAudio = null }
            target.pause()
            return clearInterval(interval)
        }
        target.volume = Math.max(target.volume - 1/(duration * 20), 0)
    }, 50)
}