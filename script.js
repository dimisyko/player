
class player {
    constructor({ el, timer, totalTime, indicator, mute }) {
        this.el = el
        this.timer = timer
        this.totalTime = totalTime
        this.indicator = indicator
        this.mute = mute
        this.state = false
        this.event()
    }
    runVideo() {
        this.el.paused ? this.el.play() : this.el.pause()
    }
    condition(el) {
        return el < 10 ? `0${el} ` : `${el}`
    }
    currentTime(el, time){
        const minutes = parseInt(time / 60)
        const secondes = parseInt(time % 60) 
        return el.textContent = this.condition(minutes) + " : " + this.condition(secondes)
    }
    time() {
        this.currentTime(this.timer, this.el.currentTime)
        this.totalTimeVideo()
        const currentIndicator = this.el.currentTime / this.el.duration
        this.indicator.style.transform = "scale3d(" + currentIndicator + ", 1, 1)"
    }
    totalTimeVideo(){
        this.currentTime(this.totalTime, this.el.duration)  
    }
    mouseDown(e) {
        this.state = true
        const downX = e.clientX || e.targetTouches[0].clientX
        this.el.currentTime =  (downX - this.indicator.getBoundingClientRect().left) / this.indicator.parentElement.getBoundingClientRect().width * this.el.duration
    }
    mouseMove(e) {
        if (!this.state) return
        const moveX = e.clientX || e.targetTouches[0].clientX
        const drag = (moveX - this.indicator.getBoundingClientRect().left) / this.indicator.parentElement.getBoundingClientRect().width
        const clamp = Math.max(0, Math.min( drag, 1))
        this.el.currentTime = clamp * this.el.duration
        this.indicator.style.transform = "scale3d(" + clamp + ", 1, 1)"
        this.currentTime(this.timer, this.el.currentTime)
    }
    mouseUp() {
        this.state = false
    }
    muted(){
        this.el.muted = !this.el.muted
    }
    endVideo() {
        this.el.currentTime = 0
    }
    event() {
        this.el.addEventListener('click', this.runVideo.bind(this))
        this.el.addEventListener('timeupdate', this.time.bind(this))
        this.el.addEventListener('loadeddata', this.time.bind(this))
        this.el.addEventListener('ended', this.endVideo.bind(this))
        this.mute.addEventListener('click', this.muted.bind(this))
        this.indicator.parentElement.addEventListener('mousedown', this.mouseDown.bind(this))
        window.addEventListener('mousemove', this.mouseMove.bind(this))
        window.addEventListener('mouseup', this.mouseUp.bind(this))
        this.indicator.parentElement.addEventListener('touchstart', this.mouseDown.bind(this))
        window.addEventListener('touchmove', this.mouseMove.bind(this))
        window.addEventListener('touchend', this.mouseUp.bind(this))

    }
}

new player({
    el: document.querySelector('video'),
    timer: document.querySelector('.txt'),
    totalTime : document.querySelector('.total'),
    indicator: document.querySelector('.bar'),
    mute : document.querySelector('.muted')
})