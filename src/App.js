import React, { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import { Synth, MonoSynth, Loop, Transport } from 'tone'
import Rotation from "./components/Rotation"


export default function App() {
  //audio
  const [time, setTime] = useState(0)
  const [loops, setLoops] = useState([])

  const bass = useMemo(()=>new MonoSynth().toMaster(),[])
  const pulse = useCallback((time)=>{
    loops.forEach(loop => {
      loop.playNotes((loop.instrument, "C2", time, loop.timesToPlay))
    })
  }, [bass, loops])

  const [outerInterval, setOuterInterval] = useState(60)

  const [outerLoop, setOuterLoop] = useState(new Loop(pulse, outerInterval))
  const [transport] = useState(Transport)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transportTime, setTransportTime] = useState()

  
  //visual
  const [orbits, setOrbits] = useState([])
  const [svgHeight, setSvgHeight] = useState(window.innerHeight)
  const [svgWidth, setSvgWidth] = useState(window.innerWidth)
  const [innerRadius, setInnerRadius] = useState(100)





  const animate = useCallback((time)=>{
    setTime(time)
    requestAnimationFrame(animate)
  }, [])

  const startStopLoop = useCallback(()=>{
    if(!isPlaying){
      requestAnimationFrame(animate)
      outerLoop.start(0)
      transport.start()
    } else if (isPlaying) {
      cancelAnimationFrame(animate)
      transport.stop()
      outerLoop.stop()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, animate, transport, outerLoop])


  const createInnerLoop = useCallback(()=> {
    //get array of times to TAR
    let divisions = 8
    const createTimesToPlay = (divisions, interval) => {
      const times = []
      for(let i = 0; i<divisions; i++){
        times.push(i*(interval/divisions))
      }
      return times
    }

    const timesToPlay = createTimesToPlay(divisions, outerInterval)

    const newLoop = {
      divisions: divisions,
      times: timesToPlay,
      playNotes: (instrument, note, time, timesToPlay) => {
        timesToPlay.forEach(timeToPlay => {
          instrument.triggerAttackRelease(note, "16n", timeToPlay, 0.5)
        })
      },
      instrument: new Synth().toDestination()
    }
    const createOrbit = (
      //defaults
      radius=40, 
      stroke="black", 
      fill="none", 
      strokeWidth=3,
      cx=svgWidth/2, 
      cy=svgHeight/2, 
      division=divisions) =>{
        const orbit = {
          radius: radius,
          strokeWidth: strokeWidth,
          stroke: stroke,
          fill: fill,
          cx: cx,
          cy: cy,
          division: division
        }
      return orbit

      }
    const orbit = createOrbit(innerRadius)
    console.log(orbit.division)
    setInnerRadius(innerRadius+20, "black", "none", 3, svgWidth/2, svgHeight/2, divisions)
    setLoops([...loops, newLoop])
    setOrbits([...orbits, orbit])




  }, [setInnerRadius, outerInterval, setLoops, setOrbits, loops, orbits])

  useEffect(()=>{
    console.log(loops, orbits)
  }, [loops,orbits])
  return (
    <div className="wrapper">
      <div className="outer-container">
        <button onClick={startStopLoop}>
            {isPlaying ? "stop" : "start"}
          </button>
          <button onClick={()=>createInnerLoop()}>
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
    </div>
  )
}


