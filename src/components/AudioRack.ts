import {Volume, Compressor, Limiter, Reverb} from 'tone'

const masterVol = new Volume().toDestination()
const masterLimiter = new Limiter().connect(masterVol)
const masterCompressor = new Compressor().connect(masterLimiter)
const reverb = new Reverb().connect(masterCompressor)

export default reverb


