'use strict';
const express = require('express');
const colors = require('colors');
const request = require('request');
const ws = require('website-info');
const urlExists = require('url-exists');
const router = express.Router();

/* [id, class] */
router.get('/:tagname/:sitename', function(req, res) {
    var url = "";
    var links = [];
    var htmlTag = req.params.tagname;
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
    //console.log(newWebsite);
    /* urlExists(website, function(err, exists) {
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
                    if (htmlTag === 'id') {
                        if (body.charAt(i) == 'i' && body.charAt(i + 1) == 'd' && body.charAt(i + 2) == '=' && body.charAt(i + 3) == '"') {
                            var index = i + 4;
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

                    if (htmlTag === 'class') {
                        if (body.charAt(i) == 'c' && body.charAt(i + 1) == 'l' && body.charAt(i + 2) == 'a' && body.charAt(i + 3) == 's' && body.charAt(i + 4) == 's' && body.charAt(i + 6) == '"') {
                            var index = i + 7;
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
                }
                for (var i = 0; i < links.length; i++) {
                    //console.log(links[i]);
                    if (links[i] == '' || links[i].length < 1) {
                        links[i].splice(i, 1);
                    }
                }
                var mainObj = {};
                if (htmlTag === 'id') {
                    console.log('scraping ' + website.cyan + ' id anchors ');
                    mainObj = {
                        siteUrl: website,
                        siteInfo: result,
                        idTagNumber: links.length,
                        idTags: links,
                        message: 'Website Exists'
                    }
                }
                if (htmlTag === 'class') {
                    console.log('scraping ' + website.cyan + ' class anchors ');
                    mainObj = {
                        siteUrl: website,
                        siteInfo: result,
                        classTagNumber: links.length,
                        classTags: links,
                        message: 'Website Exists'
                    }
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
