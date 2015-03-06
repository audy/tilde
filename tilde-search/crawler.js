#!/usr/bin/env node

var Crawler = require("crawler");
var url = require("url");
var colors = require("colors");
var crypto = require('crypto');
var S = require("string");
var elasticsearch = require("elasticsearch");

// we'll need this later
var md5sum = crypto.createHash('md5')

// setup elastic search connection
// (you need to run create-index first)
var client = new elasticsearch.Client({
  host: "https://evcufwhlri:ogu3ru8vwz@tilde-3814253334.us-east-1.bonsai.io"
});

// todo: this should actually *use* the bulk part of the bulk API
es_insert = function(uri, title, body) {
  console.log('inserting: '.blue + title);
  client.create({
    index: 'tildes',
    type: 'page',
    id: title,
    body: {
      title: title,
      body: body,
      uri: uri
    }
  }, function(error, response) {
    // I should catch the errors
  });
}

crawl_page = function(error, result, $) {
  console.log('crawling: '.white + result.uri);

  var title = $('title').text();
  var body = S($('body').html()).stripTags().s;

  es_insert(result.uri, title, body);

  // find links, add to queue
  $('a').each(function(index, a) {

    var new_url = $(a).attr("href");

   // we only care about tilde.town for now
   if (new_url.match(/http:\/\/tilde\.town/)) {
      c.queue(new_url);
      console.log('queuing: '.green + new_url);
    }

  });
}


// das web-crawler
var c = new Crawler({
  maxConnections: 10,
  rateLimits: 100, // let's take it slow
  cache: true,
  callback: function(a, b, c) {
    try {
      crawl_page(a, b, c)
    } catch(e) {
      console.log(e);
    } }
});

// get started
c.queue('http://tilde.town');
