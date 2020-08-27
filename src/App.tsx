import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import {Loop, Transport } from 'tone'
import Rotation from "./components/Rotation"
import InnerLoop from './components/InnerLoop'
import {Controls} from './components/controls/Controls'

export default function App() {
  //audio
  const updateBackground = useCallback(()=>{
    const randomColor = ():number => Math.floor(Math.random()*255)
    return `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`
  },[])

  const [SVGBackground, setSVGBackground] = useState('')

  const [time, setTime] = useState<number>(0)
  const [loops, setLoops] = useState<any[]>([])

  const pulse = useCallback((time)=>{
    setSVGBackground(updateBackground)
    loops.forEach(loop => {
      (loop as any).loop.start()
    })
  }, [loops, setSVGBackground, updateBackground])

  const [outerInterval] = useState<number>(4)
  const [outerLoop] = useState(new Loop(pulse, outerInterval))
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [firstClick, setFirstClick] = useState<boolean>(true)




  useEffect(()=>{
    outerLoop.callback = pulse
  }, [pulse, outerLoop])
  //visual
  const [orbits, setOrbits] = useState<any[]>([])
  const [svgHeight] = useState<number>(window.innerHeight)
  const [svgWidth] = useState<number>(window.innerWidth)
  const [innerRadius, setInnerRadius] = useState<number>(100)

  const raf = useRef<number>(0)
  const animate = useCallback(()=>{
    setTime(Transport.seconds)
    raf.current = requestAnimationFrame(animate)
  }, [])

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
  }, [isPlaying, animate, outerLoop])

  const clear = useCallback(()=> {

    const disposeLoops = new Promise(resolve => {
      loops.forEach(loop => loop.loop.dispose())
      resolve()
    })

    const clearAppStates = async() => {
      startStopLoop()
      await disposeLoops
      setLoops([])
      setOrbits([])
      setFirstClick(true)
      setInnerRadius(100)
    }

    clearAppStates()
  },[setLoops, setOrbits, startStopLoop, loops, setFirstClick, setInnerRadius])
  const [instruments] = useState<any[]>(['celesta', 'harp', 'horn', 'flute', 'oboe', 'bass', 'violin'])
  const createInnerLoop = useCallback(()=> {
    const init = async () => {
      let divisions = Math.ceil(Math.random()*12)
      let instType = instruments[Math.floor(Math.random()*instruments.length)]
      console.log(instType)
      const innerLoop = await new InnerLoop(outerInterval/divisions, instType)
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
      setInnerRadius(innerRadius+50)
      setLoops([...loops, innerLoop])
      setOrbits([...orbits, orbit])
    }
    init()
  }, [setInnerRadius, outerInterval, instruments, setLoops, setOrbits, loops, orbits, svgHeight, svgWidth, innerRadius])

  const handleSVGClick = useCallback(()=>{
    if(firstClick){
      startStopLoop()
      setFirstClick(false)
    }
    createInnerLoop()
  },[firstClick, setFirstClick, startStopLoop, createInnerLoop])

  return (
    <div className="wrapper">
      <div className="outer-container">
        <div className="inner-container">
          <div className="svg-container"style={{
              backgroundColor: SVGBackground
            }}>
            <Controls isPlaying={isPlaying} clear={clear} startStopLoop={startStopLoop}/>
            <svg 
                onClick={handleSVGClick} 
                width={svgWidth} 
                height={svgHeight} 
                >

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


