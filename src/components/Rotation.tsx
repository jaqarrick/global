import React, {useMemo, Fragment} from 'react'
import Colors from './Colors'

const Rotation = (props:any) => {
    const {radius, cx, cy, division, fill, strokeWidth} = props.orbit
    const {time, interval} = props
    let originX = useMemo(() => cx, [cx])
    let originY = useMemo(() => cy, [cy])
    const d = useMemo(() => 360 / division, [division])
    let trackRadius = useMemo(() => radius , [radius])
    const clicker = useMemo(()=> time*360/(interval), [time, interval])
    // useEffect(()=> console.log(clicker), [clicker])
    const degreesToRadians = (degrees:number):number => degrees * (Math.PI/180)
    let rate = useMemo(()=>degreesToRadians(clicker),[clicker])
    const rotationColor = useMemo(()=> Colors(), [])

    return (
        <Fragment >  
        {/* when Colors() is called a new RG needs to be created! */}
            <defs>
                <radialGradient id="rg1">
                    <stop offset="0%" stopColor={rotationColor} />
                    <stop offset="100%" stopColor="rgb(6, 6, 80)" />
                </radialGradient>
            </defs>
            <circle r={radius} cx={originX} cy={originY} stroke="none" strokeWidth={strokeWidth} fill={fill} />
           {[...Array(division)].map((_, i) => {
                const initialDeg = i*d
                const initialRadian = degreesToRadians(initialDeg)
                const orbitX = originX + ((trackRadius)*Math.sin(initialRadian+rate))
                const orbitY = originY - ((trackRadius)*Math.cos(initialRadian+rate))
                // <circle key={i} cx={orbitX} cy={orbitY} r="2" stroke="black" fill="url(#rg1)" />

                return (
                
                   <ellipse key={i} cx={orbitX} cy = {orbitY} rx = "120" ry = "20" fill = "url(#rg1)" />
                   
               )
           })} 
        </Fragment>
    )
}

export default Rotation