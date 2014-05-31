var gtfsFiles = {
  required: [
    '/agency.txt',
    '/stops.txt',
    '/routes.txt',
    '/trips.txt',
    '/stop_times.txt',
    '/calendar.txt'
  ],
  optional: [
    '/calendar_dates.txt',
    '/fare_attributes.txt',
    '/fare_rules.txt',
    '/shapes.txt',
    '/frequencies.txt',
    '/transfers.txt',
    '/feed_info.txt'
  ]
}
gtfsFiles.valid = gtfsFiles.required.concat(gtfsFiles.optional)
gtfsFiles.isValid = function (filename) {
  return gtfsFiles.valid.indexOf(filename) > -1
}

module.exports = gtfsFiles