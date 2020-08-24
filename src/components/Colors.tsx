const Colors = () => {
    const colors = [
        'rgb(205, 120, 119)',
        'rgb(162, 119, 205)',
        'rgb(11, 23, 91)',
        'rgb(225, 161, 210)',
        'rgb(6, 6, 80)',
    ]
    const randomIndex = Math.floor(Math.random()*colors.length)

    return colors[randomIndex]
}

export default Colors