
const path = require('path')
const fs = require('fs')

const getSampleInstruments = () => {
	const directoryPath = path.join(__dirname, "../public/samples")
	const files = fs.readdirSync(directoryPath)
	return files.filter(file => {
		if(file != '.DS_Store') return file
	})
}
const printList = (folder, index) => {
	const directoryPath = path.join(__dirname, `../public/samples/${folder}`)
	const files = fs.readdirSync(directoryPath)
	const urlObject = files.reduce((acc, curr) => {
		if(curr != '.DS_Store') 
		return {...acc, [curr.substr(index,2).toString()]: curr}
	}, {})
	return urlObject
}


const getURLs = (instruments) => {
	const urls = instruments.map(inst => {
		switch(inst){
			case 'celesta': 
				return (printList(inst, 0))
				break
			case 'English-Horn':
				return (printList(inst, 0))
				break
			case 'harp':
				return(printList(inst, 7))
				break
			case 'stac-PB':
				return(printList(inst, 13))
				break
			default: throw "folder not found"
		}
	})
	// const directoryPath = path.join(__dirname, "../public/samples/celesta")
	// const files = fs.readdirSync(directoryPath)
	// const urls = files.reduce((acc, curr) => {
    //     if(curr != '.DS_Store') 
    //     return {...acc, [curr.substr(0,2).toString()]: curr}
	// }, {})
	return urls
}

console.log(getURLs(getSampleInstruments()))

fs.writeFile('./src/components/SampleData.json', JSON.stringify(getURLs(getSampleInstruments())), err => {
    if(err) return console.log(err)
})


