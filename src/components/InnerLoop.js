import {Loop, Synth} from 'tone'

export default class InnerLoop {
    constructor(interval){
      this.instrument = new Synth().toDestination()
      this.loop = new Loop(this.callback, interval) 
      this.notes = ["C2", "D2", "E2", "F#3", "G3", "A2", "B3"]
      this.note = this.notes[Math.ceil(Math.random()*this.notes.length)]
    }
    callback = (time) => {
      console.log(time)
      this.instrument.triggerAttackRelease(this.note, "8n", time)
    }
  }