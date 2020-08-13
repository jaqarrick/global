import React, {useMemo, useEffect} from 'react'


const Rotation = (props) => {
    const {radius, cx, cy, division, fill, stroke, strokeWidth} = props.orbit
    const {time, interval} = props
    let originX = useMemo(() => cx, [cx])
    let originY = useMemo(() => cy, [cy])
    const d = useMemo(() => 360 / division, [division])
    let trackRadius = useMemo(() => radius , [radius])
    const clicker = useMemo(()=> time*360/(interval*1000), [time])

    const degreesToRadians = degrees => degrees * (Math.PI/180)
    let rate = useMemo(()=>degreesToRadians(clicker),[clicker])
    

    return (
        <>
            <circle r={radius} cx={originX} cy={originY} stroke={stroke} strokeWidth={strokeWidth} fill={fill} />
           {[...Array(division)].map((_, i) => {
                const initialDeg = i*d
                const initialRadian = degreesToRadians(initialDeg)
                const orbitX = originX + ((trackRadius)*Math.sin(initialRadian+rate))
                const orbitY = originY - ((trackRadius)*Math.cos(initialRadian+rate))

                return (
                   <circle key={i} cx={orbitX} cy={orbitY} r="10" stroke="black" fill="black" />
               )
           })} 
        </>
    )
}

export default Rotation