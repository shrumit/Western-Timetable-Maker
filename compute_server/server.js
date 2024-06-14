/*
Copyright (C) Shrumit Mehta 2024

This file is part of Western Timetable Maker.

Western Timetable Maker is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Western Timetable Maker is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Western Timetable Maker.  If not, see <http://www.gnu.org/licenses/>.
*/


const express = require('express');
const { execFile } = require('child_process');
const nodeCache = require( "node-cache" );

const cache = new nodeCache();
const app = express();

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/compute', function(req, res) {
  
  if (!req.body || !req.body.length || !req.body.forEach) {
    res.status(400).send();
    console.log('bad req.body:'+ JSON.stringify(req.body));
    return;
  }

  const cacheKey = JSON.stringify(req.body);
  const value = cache.get(cacheKey)
  if (value) {
    res.send(value);
    return;
  }
  
  let args = []
  let numCourseComps = req.body.length

  args.push(numCourseComps)
  req.body.forEach(function(coursecomp) {
    args.push(coursecomp.length)
    coursecomp.forEach(function(section) {
      args.push(...section)
    })
  })

  // console.log('args:' + args)
  const child = execFile('./main', [...args], (error, stdout, stderr) => {
    if (error) {
      console.log('ERROR:'+error)
      console.log('STDERR:'+stderr)
      console.log('STDOUT:'+stdout)
      res.status(500).send(error)
      console.log('req.body:'+ JSON.stringify(req.body))
      return;
    }

    let result = []
    let info = {}

    // for every evaluator scheme
    stdout.split('\n').forEach(function(line) {
      if (line.length == 0) return
      let lineArr = line.split(' ');
      let typeName = lineArr[0] // name of the evaluator
      if (typeName === 'info') {
        info.validCount = lineArr[1]
        return
      }
      lineArr.splice(0,2) // remove type name and number of tables
      let evalResults = []
      while (lineArr.length) {
        let table = {}
        table.score = lineArr[0]
        lineArr.splice(0,1) // remove score
        table.sections = lineArr.splice(0,numCourseComps)
        evalResults.push(table)
      }
      // sort tables by score
      evalResults.sort(function(a,b) {
        return b.score - a.score
      })
      result.push({type: typeName, tables: evalResults})
    })
    
    let payload = {info: info, schemes: result};
    res.send(payload);
    
    try {
      cache.set(cacheKey, payload);
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  })
})

app.get('/cache-stats', function(req, res) {
  res.send(cache.getStats());
});


const port = process.argv[2] || 8081;
app.listen(port, 'localhost', function(){
  console.log("Compute server started at " + port);
});
