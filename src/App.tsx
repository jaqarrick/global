import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import './App.css';
import { Synth, MonoSynth, Loop, Transport } from 'tone'
import Rotation from "./components/Rotation"
import InnerLoop from './components/InnerLoop'
import { Tone } from 'tone/build/esm/core/Tone';
import SampleData from './components/SampleData.json'
import { Instrument } from 'tone/build/esm/instrument/Instrument';

export default function App() {
  //audio


  const [time, setTime] = useState<number>(0)
  const [loops, setLoops] = useState<any[]>([])

  const pulse = useCallback((time)=>{
    loops.forEach(loop => {
      (loop as any).loop.start()
    })
  }, [loops])

  const [outerInterval, setOuterInterval] = useState<number>(4)
  const [outerLoop, setOuterLoop] = useState(new Loop(pulse, outerInterval))
  const [isPlaying, setIsPlaying] = useState<boolean>(false)


  useEffect(()=>{
    outerLoop.callback = pulse
  }, [pulse, outerLoop])
  //visual
  const [orbits, setOrbits] = useState<any[]>([])
  const [svgHeight, setSvgHeight] = useState<number>(window.innerHeight)
  const [svgWidth, setSvgWidth] = useState<number>(window.innerWidth)
  const [innerRadius, setInnerRadius] = useState<number>(100)

  const raf = useRef<number>(0)
  const animate = useCallback(()=>{
    setTime(Transport.seconds)
    raf.current = requestAnimationFrame(animate)
  }, [time])

  const startStopLoop = useCallback(()=>{
    if(!isPlaying){
      animate()
      outerLoop.start()
      Transport.start()
    } else if (isPlaying) {
      cancelAnimationFrame(raf.current)
      Transport.pause()
      outerLoop.stop()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying, animate, Transport, outerLoop])


  const createInnerLoop = useCallback(()=> {
    const init = async () => {
      let divisions = Math.ceil(Math.random()*16)
      const innerLoop = await new InnerLoop(outerInterval/divisions, 'celesta')
      console.log(innerLoop)
      const createOrbit = (
      //defaults
        radius=75, 
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
    }
    init()
  }
    , [setInnerRadius, outerInterval, setLoops, setOrbits, loops, orbits, svgHeight, svgWidth, innerRadius])


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


