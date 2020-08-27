import './Controls.css'
import React from 'react'


export interface ControlsProps {
    isPlaying: boolean,
    startStopLoop():any
    clear():any
}

export const Controls: React.FC<ControlsProps> = ({isPlaying=false, startStopLoop, clear}) => {
    return (
        <div className="controls-container">
            <button onClick={startStopLoop}> {isPlaying ? <div>&#x25A0;</div> : <div>&#x25BA;</div>} </button>
            <button onClick={clear}> <div className="reset-button">&#8635;</div> </button>
        </div>
    )
}