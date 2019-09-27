const fs = require('fs')
const { parse } = require('json2csv')
const years = [ 2019, 2018, 2017 ]

function buildReport(src, buildJson, buildCsv) {
  fs.readFile(src, 'utf8', (err, data) => {
    if (err) throw err
    const dataSplit = data.split('\r\n')
    const headers = dataSplit[0]
    const projectsRows = dataSplit.filter((row) => { return row !== headers })
    const projectsArrays = projectsRows.map((row) => { return row.split(',') })
    const projects = projectsArrays.map((row) => {
      const project = row[0]
      const jobNumber = project.slice(0,project.indexOf('-'))
      const fullName = project.slice(project.indexOf('-') + 1)
      const name = fullName.slice(0, fullName.indexOf('(')).replace(/\s$/, '')
      const client = fullName.slice(fullName.indexOf('(')).replace('(', '').replace(')', '').replace(/\s$/, '')
      const hours = row[1].replace(/\s$/, '')
      const fees = row[2].replace(/\s$/, '').replace(',', '')

      return {
        "Job Number": jobNumber,
        "Name": name,
        "Client": client,
        "Hours": hours,
        "Fees": fees
      }
    })

    function writeFile(file, data) {
      fs.writeFile(file, data, (err) => {
        if (err) throw err
        console.log(`${file} has been saved!`)
      })
    }

    // Write JSON file
    writeFile(buildJson, JSON.stringify(projects))

    // Write CSV file
    const opts = { headers }
    try {
      const csv = parse(projects, opts)
      writeFile(buildCsv, csv)
    } catch (err) {
      console.error(err)
    }
  })
}

years.map((year) => { buildReport(`./src/${year}.csv`, `./build/${year}.json`, `./build/${year}.csv`) })
