const { duplicate } = require('./streambox')
const { transform } = require('./streambox')
const { csv2json } = require('./streambox')
const { catPipewc } = require('./streambox')
const { upperCase } = require('voca')

//duplicate('./Ch0pin.jpg')

// transform('./test.txt', /Ch0pin/g, function(strToReplace){
//     return strToReplace.toUpperCase()
// })

//transform('./test.txt', /Ch0pin/g, upperCase, false)

// csv2json('./Comp0ser.csv')

catPipewc('./pipeWC', '.sh', result => {
    console.log(result)
})