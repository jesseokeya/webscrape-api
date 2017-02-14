'use strict';
const express = require('express');
const colors = require('colors');
const request = require('request');
const ws = require('website-info');
const urlExists = require('url-exists');
const router = express.Router();

//Links
router.get('/:sitename', function(req, res) {
    var url = "";
    var links = [];
    var link = req.params.sitename;
    link = link.replace(/\s/g, '');
    link = link.replace(/ /g, '');
    var website = 'http://' + link + '.com' || 'https://' + link + '.com'
    var newWebsite = "";
    var temp = "";
    if (link.charAt(0) === '(') {
        for (var j = 1; j < link.length - 1; j++) {
            newWebsite += link.charAt(j);
        }
        for (var i = 0; i < newWebsite.length; i++) {
            if (newWebsite.charAt(i) != '~') {
                temp += newWebsite.charAt(i);
            }
            if (newWebsite.charAt(i) == '~') {
                temp += '/';
            }
        }
        //console.log(temp);
        if (temp.length > 0) {
            newWebsite = temp;
        }
        website = 'http://' + newWebsite || 'https://' + newWebsite;
    }
    // console.log(newWebsite);
    console.log('scraping ' + website.cyan + ' for links ');
    /*  urlExists(website, function(err, exists) {
          if (err) {
              throw err;
          }
          if (exists) { */
    ws(website, function(err, result) {
        if (err) console.error(err)
        request(website, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = body.replace(/\s/g, '');
                body = body.replace(/ /g, '');
                body = body.toLowerCase();
                for (var i = 0; i < body.length; i++) {
                    if (body.charAt(i) == 'h' && body.charAt(i + 1) == 'r' && body.charAt(i + 2) == 'e' && body.charAt(i + 3) == 'f' && body.charAt(i + 5) == '"') {
                        var index = i + 6;
                        for (var j = index; j < body.length; j++) {
                            if (body.charAt(j) == '"' || body.charAt(j) == "'") {
                                if (url.length >= 1) {
                                    links.push(url);
                                }
                                url = "";
                                break;
                            }
                            url += body.charAt(j);
                        }
                    }
                }
                for (var i = 0; i < links.length; i++) {
                    //console.log(links[i]);
                    if (links[i] == '' || links[i].length < 1) {
                        links[i].splice(i, 1);
                    }
                }
                var mainObj = {
                    siteUrl: website,
                    siteInfo: result,
                    siteLinksNumber: links.length,
                    siteLinks: links,
                    message: 'Website Exists'
                }
                res.send(mainObj);
            }

        });
    });
    /* } else {
        res.json({
            siteUrl: website,
            message: "Something went wrong 😞"
        });
    } */
});


module.exports = router;
