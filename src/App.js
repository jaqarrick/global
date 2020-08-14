import React, { useState, useCallback, useMemo, useEffect } from 'react';
import './App.css';
import { Synth, MonoSynth, Loop, Transport } from 'tone'
import Rotation from "./components/Rotation"
import InnerLoop from './components/InnerLoop'
import { Tone } from 'tone/build/esm/core/Tone';


export default function App() {
  //audio
  const [time, setTime] = useState(0)
  const [loops, setLoops] = useState([])

  const pulse = useCallback((time)=>{
    loops.forEach(loop => {
      loop.loop.start()
    })
  }, [loops])

  const [outerInterval, setOuterInterval] = useState(4)
  const [outerLoop, setOuterLoop] = useState(new Loop(pulse, outerInterval))
  const [transport] = useState(Transport)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transportTime, setTransportTime] = useState()


  useEffect(()=>{
    outerLoop.callback = pulse
  }, [pulse, outerLoop])
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
    let divisions = Math.ceil(Math.random()*8)
    const innerLoop = new InnerLoop(outerInterval/divisions)
    const createOrbit = (
      //defaults
      radius=40, 
      stroke="none", 
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
    const orbit = createOrbit(innerRadius,"black", "none", 3, svgWidth/2, svgHeight/2, divisions)
    setInnerRadius(innerRadius+20)
    setLoops([...loops, innerLoop])
    setOrbits([...orbits, orbit])
  }, [setInnerRadius, outerInterval, setLoops, setOrbits, loops, orbits, svgHeight, svgWidth, innerRadius])


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


