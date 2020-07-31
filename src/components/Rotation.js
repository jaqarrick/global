import React, {useMemo} from 'react'


const Rotation = (props) => {

    const {radius, cx, cy, division, fill, stroke} = props.orbit
    const {time, interval} = props
    let originX = useMemo(() => cx, [cx])
    let originY = useMemo(() => cy, [cy])
    const d = useMemo(() => 360 / division, [division])
    let trackRadius = useMemo(() => radius , [radius])
    const clicker = useMemo(()=> time*360/1000, [time])

    const degreesToRadians = degrees => degrees * (Math.PI/180)
    let rate = useMemo(()=>degreesToRadians(clicker),[clicker])
    console.log(radius)
    

    return (
        <>
            <circle r={radius} cx={originX} cy={originY} stroke="none" fill={fill} />
           {[...Array(division)].map((_, i) => {
                const initialDeg = i*d
                const initialRadian = degreesToRadians(initialDeg)
                const orbitX = originX + ((trackRadius)*Math.sin(initialRadian+rate))
                const orbitY = originY - ((trackRadius)*Math.cos(initialRadian+rate))
                console.log(originX, originY)

                

                return (
                   <circle key={i} cx={orbitX} cy={orbitY} r="10" stroke="black" fill="black" />
               )
           })} 
        </>
    )
}

export default Rotation