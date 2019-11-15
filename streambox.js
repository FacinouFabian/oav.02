const fs = require('fs')
const path = require('path')
const { Transform } = require('stream')

function getDuplicateName(filename){
    const ext = path.extname(filename)
    const base = path.basename(filename, ext)
    return `${base}.copy${ext}`
}

function getJSON(filename){
    const ext = path.extname(filename)
    const base = path.basename(filename, ext)
    return `${base}.json`
}

function duplicate(filename){
    const outputFileName = getDuplicateName(filename)
    const file = fs.createReadStream(filename)
    const newFile = fs.createWriteStream(outputFileName)
    file.pipe(newFile)

    file.on('end', () => {
        console.log(`File ${filename} successfully duplicated!!`)
    })
}

function transform(filename, re, cb, inStdout = true){
    if (inStdout){
        let content = ''

        rstream.on('data', chunk => {
            content += chunk.toString().replace(re, cb)
        })

        rstream.on('end', () => {
            console.log(content)
        })
    }else{
        const outputFileName = getDuplicateName(filename)
        const rstream = fs.createReadStream(filename)
        const wstream = fs.createWriteStream(outputFileName)
        const tstream = new Transform({
        transform(chunk, encoding, callback){
                this.push(chunk.toString().replace(re,  cb))
                callback()
            }
        })
        rstream.pipe(tstream).pipe(wstream)
    }
}

function csv2json(filename){
    const outputFileName = getJSON(filename)
    const rstream = fs.createReadStream(filename)
    let obj = {}
    let tab
    let activities
    let date
    let t = ''
    rstream.on('data', chunk => {
        chunk = chunk.toString().replace(/\r/g, '')
        tab = chunk.toString().split(/\n/)
        keys = tab[0]
        values = tab[1]
        splitKeys = keys.split(';')
        splitValues = values.split(';')
        
        for (const elt in splitKeys){
            if(splitKeys[elt] === 'birth' | splitKeys[elt] === 'death'){
                date = splitValues[elt]
                date = date.split('/')
                splitValues[elt] = `${date[2]}-${date[1]}-${date[0]}`
                obj[splitKeys[elt]] = splitValues[elt]
            }
            if (splitKeys[elt] === 'activities'){
                activities = splitValues[elt].split(',')
                splitValues[elt] = activities
                obj[splitKeys[elt]] = splitValues[elt]
            }else{
                obj[splitKeys[elt]] = splitValues[elt]
            }
        }
        
    })

    rstream.on('end', () => {
        fs.writeFile(outputFileName, JSON.stringify(obj), function (err) {
            if (err) throw err;
            console.log('Created JSON!');
          });
    })
}

/// PIPE WC 1 ///

function catPipewc(directory, type, cb){

    let count = 0

    fs.readdir(directory, function(err, items) {

        for (const item of items){

            const rstream = fs.createReadStream(directory+'/'+item)
            const ext = path.extname(item)

            if(ext === type){
                rstream.on('data', chunk => {
                    count += chunk.toString().length
                })

                rstream.on('end', () => {
                    console.log(count)
                })
            }
        }
        cb(count)
    })
}

/// PIPE WC 2 (PROMISE)///

function catPipewc(directory, type, cb){

    let count = 0

    fs.readdir(directory, function(err, items) {

        for (const item of items){

            const rstream = fs.createReadStream(directory+'/'+item)
            const ext = path.extname(item)

            if(ext === type){
                rstream.on('data', chunk => {
                    count += chunk.toString().length
                })

                rstream.on('end', () => {
                    console.log(count)
                })
            }
        }
        cb(count)
    })
}

/// EXO 6 ///
function convertToJSON(){

}

module.exports = {
    duplicate,
    transform,
    csv2json, 
    catPipewc
}