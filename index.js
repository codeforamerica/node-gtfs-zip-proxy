var http = require('http')

var gtfsFiles = require('./gtfsPackage')
var github = require('vinyl-github')
var zip = require('gulp-zip')
var buffer = require('gulp-buffer')
var fs = require('fs')
var filter = require('gulp-filter')
var csv = require('binary-csv')
var through = require('through2')
var File = require('vinyl')
var trailer = require('gulp-trailer')


http.createServer(function (req, res) {
  res.setHeader('content-type', 'application/zip')
  res.setHeader('Content-Disposition','attachment; filename=gtfs.zip')
  getGtfsFeed(process.env.REPO)
    .on('data', function (file) {
      res.setHeader('content-length', file.contents.length)
      res.write(file.contents)
      res.end()
    })
}).listen(process.env.PORT)

function getGtfsFeed(repo) {


  var info = {
    feed_publisher_name: 'unknown',
    feed_publisher_url: 'http://unknown',
    feed_lang: 'en',
    feed_start_date: 0,
    feed_end_date: 0,
    feed_version: 'version' ,
    feed_id: 'id'
  }

  var rev = '-'
  
  return github.src(repo)
    .pipe(buffer())
    .pipe(filter(function (file) {
      return gtfsFiles.isValid(file.path)
    }))
    .on('data', function (file) {
      info.feed_version = file.ref
      if (file.path === '/calendar.txt') {
        parseCalendar(file.contents, info)
      }
      if (file.path === '/agency.txt') {
        parseAgency(file.contents, info)
      }
      if (file.path === '/feed_info.txt') {
        parseInfo(file.contents, info)
      }
    })
    .on('data', function (x) {
      console.log(x.path)
    })
    .pipe(trailer('feed_info.txt', function (cb) {
      console.log('writing trailer...', info)
      cb(null, new Buffer(writePairs(info)))
    }))
    .pipe(zip('gtfs.zip'))

}

// get the earliest and latest calendar dates covered by this feed
function parseCalendar(file, info) {
  var parser = csv()
  var table = file.toString().split('\n').map(function (row) {
    return row.split(',')
  })
  var headers = table.splice(0,1)[0]
  var cols = table[0].length
  var startCol = headers.indexOf('start_date')
  var endCol = headers.indexOf('end_date')

  info.feed_start_date = table.reduce(function (start, row) {
    var rowStart = parseInt(row[startCol])
    return rowStart ? Math.min(start, rowStart) : start
  }, now())


  info.feed_end_date = table.reduce(function (end, row) {
    var rowEnd = parseInt(row[endCol])
    return rowEnd ? Math.max(end, rowEnd) : end
  }, now() + 1)

}

function now() {
  var t = new Date()
  var y = t.getFullYear()
  var m = t.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = t.getDate()
  d = d < 10 ? '0' + d : d
  return parseInt('' + y + m + d)
}

function parseAgency(file, info) {
  var table = parsePairs(file)

  info.feed_publisher_name = table.agency_name
  info.feed_publisher_url = table.agency_url
  // [ISO639-1] recommends that language codes be written in lowercase
  info.feed_lang = table.agency_lang.toLowerCase()
  info.feed_id = table.agency_name
}

function parsePairs(buffer) {
  var parser = csv()
  var table = buffer.toString().split('\n').map(function (row) {
    return row.split(',')
  })
  var headers = table[0]
  return headers.reduce(function (o, key, i) {
    o[key] = table[1][headers.indexOf(key)]
    return o
  }, {})

}

function writePairs(obj) {
  var headers = []
  var cells = []
  Object.keys(obj).forEach(function (key) {
    headers.push(key)
    cells.push(obj[key])
  })
  return new Buffer(headers.join(',') + '\n' + cells.join(',')) 
}

function parseInfo(file, info) {
  // todo: if a feed already has a feed_info.txt file specified, use it
}

