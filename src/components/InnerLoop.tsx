import {Loop, Sampler} from 'tone'
import SampleData from './SampleData.json'


const getInstrumentURLS = (data:any[], instrument:string) => {
  switch(instrument){
    case 'celesta': return {urls: data[0],folder: 'celesta' }
      break
    case 'horn': return {urls: data[1],folder: 'English-Horn'}
      break
    case 'harp': return {urls: data[2],folder: 'harp'}
      break
    case 'flute': return { urls: data[3], folder: 'stac-PB'}
      break
    default: throw 'the instrument does not have a specified url'
  }
}

export default class InnerLoop {
    constructor(
      interval:number, 
      public instrumentType:string = 'horn',
      public loop?:any, 
      public notes?:any[], 
      public note?:string, 
      public instrument?:any, 
    ){
      this.instrumentType = instrumentType
      
      this.instrument = new Promise((res, rej) => {
        let sampler = new Sampler({
          urls: getInstrumentURLS(SampleData, this.instrumentType).urls,
          baseUrl: `./samples/${getInstrumentURLS(SampleData,this.instrumentType).folder}/`,
          onload: ()=> {
            res(sampler)
            console.log("loaded")
          }
        }).toDestination()
      })
      this.loop = new Loop(this.callback, interval) 
      this.notes = ["C2", "D2", "E5"]
      this.note = this.notes[Math.ceil(Math.random()*this.notes.length)]
    }

    
    callback = async (time:number) => {
      let sampler = await this.instrument
      sampler.triggerAttackRelease("A4", "2n", time)
    }
  }
