import React, {useMemo} from 'react'
import Colors from './Colors'

const Rotation = (props:any) => {
    const {radius, cx, cy, division, fill, stroke, strokeWidth} = props.orbit
    const {time, interval} = props
    let originX = useMemo(() => cx, [cx])
    let originY = useMemo(() => cy, [cy])
    const d = useMemo(() => 360 / division, [division])
    let trackRadius = useMemo(() => radius , [radius])
    const clicker = useMemo(()=> time*36000/(interval*1000), [time, interval])
    // useEffect(()=> console.log(clicker), [clicker])
    const degreesToRadians = (degrees:number):number => degrees * (Math.PI/180)
    let rate = useMemo(()=>degreesToRadians(clicker),[clicker])
    const rotationColor = useMemo(()=> Colors(), [])

    return (
        <>  
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

                return (
                   <circle key={i} cx={orbitX} cy={orbitY} r="20" stroke="black" fill="url(#rg1)" />
               )
           })} 
        </>
    )
}

export default Rotation