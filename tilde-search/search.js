#!/usr/bin/env node

var elasticsearch = require("elasticsearch");
var color = require("colors");

var term = process.argv[2];

console.log("results for: \"" + term.green + "\"");

var client = new elasticsearch.Client({
  host: "http://localhost:8000"
});

client.search({
  q: term,
}).then(function (body) {
  var hits = body.hits.hits;
  for(i in hits) {
    console.log(i.white + ' - ' + hits[i]._source.title.blue + ' - ' + '[' + hits[i]._source.uri.white + ']');
  }
  process.exit();
}, function(error) {
  console.trace(error.message);
});
