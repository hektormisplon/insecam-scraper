const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk')

const baseUrl = 'http://insecam.org'
const numPages = 3

console.log(chalk.greenBright.bgBlack(`\n Scraping ${chalk.underline.bold(baseUrl)} for camera's`))

const getWebsiteContent = async url => {
  try {
    const res = await axios.get(url)
    const $ = cheerio.load(res.data)
    let cameraEndpoints = []
    await $('.thumbnail-item__wrap').each(function () {
      cameraEndpoints.push(`${baseUrl}${($(this).attr('href'))}`)
    })

    return cameraEndpoints
  } catch (err) {
    console.error(err)
  }
}

/*
 * Save data to output file
 */
const save = (data, output) => {
  !fs.existsSync('./output') && fs.mkdirSync('./output');
  fs.appendFile(`./output/${output}`, data + ',', err => err && console.log(err))
}

/*
 * Loop through pages & save urls
 */
for (let i = 1; i < 3; i++) getWebsiteContent(`${baseUrl}/en/bycountry/US?page=${i}`).then(data => save(data, 'cam_urls.csv'))
