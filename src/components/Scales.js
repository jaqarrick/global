import teoria from 'teoria';
import {Frequency} from 'tone'

export default class ScaleLibrary {
    constructor(){
        this.allNotes = this.generateAllNotes()
        this.allTeoriaNotes = this.generateTeoriaNotes()
        this.allScales = [
            'minor',
            'major',
            'ionian',
            'dorian',
            'phrygian',
            'lydian',
            'mixolydian',
            'aeolian',
            'locrian',
            'majorpentatonic',
            'minorpentatonic',
            'chromatic',
            'harmonicchromatic',
            'blues',
            'doubleharmonic',
            'flamenco',
            'harmonicminor',
            'melodicminor',
            'wholetone'
        ]
    }
    generateTeoriaNotes = () =>  this.allNotes.map(stringNote => teoria.note(stringNote))
    generateAllNotes = () => teoria.note('c1').scale('chromatic').simple()
    generateRandomRoot = () => {
        let randomIndex = Math.floor(Math.random()*this.allNotes.length)
        return this.allTeoriaNotes[randomIndex]
    }
    generateScale = (root=teoria.note('c3'), scale="lydian", octave=3) => {
        const baseScale = root.scale(scale).simple()
        return baseScale.map(note => note+octave)
    }
    noteToFrequency = (arrayOfNotes=this.generateScale(teoria.note('c2'))) => {
        return arrayOfNotes.map(note => {
            const midi = Frequency(note).toMidi()
            const hz = Frequency(midi, "midi").toFrequency()
            return hz   
        })
    }
}
