import React from 'react';
import './App.css';
import Tone from 'tone'
import Rotation from "./components/Rotation"



class Wrapper extends React.Component {
  render(){
    return(
      <div className="container">
        {this.props.children}
      </div>
    )
  }


}
export default class App extends React.Component {
  constructor(props){
    super(props)

    //audio
    let loops = []
    let outerInterval = 1
    const outerLoop = new Tone.Loop(this.pulse, outerInterval)
    let transport = Tone.Transport
    let isPlaying = false
    let transportTime
    let time = 0


    //visual
    let orbits = []
    const svgHeight = 1000
    const svgWidth = 1000
    let innerRadius = 100


    this.state = {
      transportTime,
      isPlaying,
      loops,
      outerInterval,
      transport,
      outerLoop,
      orbits, 
      svgHeight, 
      svgWidth,
      innerRadius, 
      time
    }
  }

  createOrbit = (
      {radius=10, 
      stroke="black", 
      fill="none", 
      cx=this.state.svgWidth/2, 
      cy=this.state.svgHeight/2, 
      hasOrbit=false, 
      division=0}) => {
    let orbit = {
        radius: radius,
        stroke: stroke,
        fill: fill,
        cx: cx,
        cy: cy,
        hasOrbit: hasOrbit,
        division: division
    }
    return orbit
  }

  componentDidMount() {
    let width = window.innerWidth
    let height = window.innerHeight

    this.setState({
      svgHeight: height,
      svgWidth: width,
    })

  }

  pulse = time => {
    if(this.state.loops.length > 0){
      this.state.loops.forEach(loop => {
        loop.loop.start(0)
      })
    }
  }
  

  animate = (time) => {
    this.setState({
      time: time
    })
    requestAnimationFrame(this.animate)
  }
  startStopLoop = () => {
    if(!this.state.isPlaying){
      this.rafID = requestAnimationFrame(this.animate)
      this.state.outerLoop.start(0)
      this.state.transport.start()
      
    } else if (this.state.isPlaying){
      cancelAnimationFrame(this.animate)
      this.state.transport.stop()
      this.state.outerLoop.stop()
    }
    this.setState({
      isPlaying: !this.state.isPlaying
    })



  }

  createInnerLoop = (division = 8, callback) => {
  
    let synth = new Tone.PluckSynth().toMaster()
    callback = ((time) => {
      synth.triggerAttackRelease("C4", "16n", time, 0.5)
    })

    

    let randomDivision = 4
    let interval = this.state.outerInterval / randomDivision
    const innerLoop = {
      division: randomDivision,
      synth,
      interval,
      loop: new Tone.Loop(callback, interval)
    }

    let radius = this.state.innerRadius+20
    //add svg orbit
    let orbit = this.createOrbit({
      radius: radius,
      
      hasOrbit: true,
      division: randomDivision
    })


    this.setState({
      loops: [...this.state.loops, innerLoop],
      orbits: [...this.state.orbits, orbit],
      innerRadius: radius
    })
  }


  render() {

    const {orbits, svgHeight, svgWidth, time, outerInterval} = this.state
    return(
      <Wrapper className="wrapper">
         <div className="outer-container">
         <button onClick={this.startStopLoop}>
              {this.state.isPlaying ? "stop" : "start"}
            </button>
            <button onClick={()=>this.createInnerLoop()}>
              new division
            </button>
          <div className="inner-container">
            <div className="svg-container">
              <svg width={svgWidth} height={svgHeight}>
                {orbits.map((orbit, i) => {
                  return (
                    <Rotation time={time} key={i} interval={outerInterval} orbit={orbits[i]} />
                  )
                })}
              </svg>
            </div>
          </div>
         </div>
      </Wrapper> 
    )
  }
}


