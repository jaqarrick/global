import {Loop, Sampler} from 'tone'
import SampleData from './SampleData.json'
import ScaleLibrary from './Scales'
import reverb from './AudioRack'


const getInstrumentURLS = (data:any[], instrument:string) => {
  switch(instrument){
    case 'celesta': return {urls: data[3],folder: 'celesta' }
    case 'horn': return {urls: data[0],folder: 'English-Horn'}
    case 'harp': return {urls: data[4],folder: 'harp'}
    case 'flute': return { urls: data[5], folder: 'stac-PB'}
    case 'oboe': return {urls: data[1], folder: 'Oboe'}
    case 'bass': return {urls: data[2], folder: 'bass'}
    case 'violin': return {urls: data[6], folder: 'violin'}
    default: throw console.error('the instrument does not have a specified url'); 
  }
}

console.log(SampleData)
export default class InnerLoop {
    constructor(
      interval:number, 
      public instrumentType:string = 'horn',
      public loop?:any, 
      public notes?:any[], 
      public note?:string, 
      public instrument?:any, 
      public allNotes?:any[],
      public scale?:any[],
      public scaleRoot?:string,
      public scaleLibrary?:any
    ){
      this.instrumentType = instrumentType

      this.instrument = new Promise((res, rej) => {
        let sampler = new Sampler({
          urls: getInstrumentURLS(SampleData, this.instrumentType).urls,
          baseUrl: `./samples/${getInstrumentURLS(SampleData,this.instrumentType).folder}/`,
          onload: ()=> {
            res(sampler)
            console.log(sampler)
            console.log("loaded")
          }
        }).connect(reverb)
      })
      this.loop = new Loop(this.callback, interval) 
      this.scaleLibrary = new ScaleLibrary()
    }

    currentScale = () => this.scaleLibrary.noteToFrequency()
    randomFr = (scale:any[]=this.currentScale()):number => {
      const randomIndex = Math.floor(Math.random()*scale.length)
      return scale[randomIndex]
    }

    
    

    callback = async (time:number) => {
      let sampler = await this.instrument
      sampler.triggerAttackRelease(this.randomFr(), "2n", time, 0.3)
    }
  }
