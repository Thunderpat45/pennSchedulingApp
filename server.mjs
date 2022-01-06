#!/usr/bin/env node

import http from 'http';
import path from 'path';
import fs from 'fs';
import process from 'process';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(function(req, res){
    
    let endPath;
    if(req.url === '/'){
        endPath = 'pennSchedule.html'
    }else{
        endPath = req.url
    }

    let filePath = (path.join(__dirname, 'dist', endPath));
    
    let extname = path.extname(filePath)
    let contentType = 'text/html'

    switch(extname){
        case '.js':
            contentType = 'text/javascript'
            break;
        case '.css':
            contentType = 'text/css'
            break;
        case '.json':
            contentType = 'application/json'
            break;
        case '.jpg':
            contentType = 'image/jpg'
            break;
    }
    console.log(filePath);
    console.log(extname);
    console.log(contentType)

    fs.readFile(filePath, function(err, content){
        if(err){ 
            //look into specific error codes, this one is page not found
            if(err.code === "ENEONT"){
                fs.readFile(path.join(__dirname, "errorPage.html"), function(err, content){
                    res.writeHead(200, {'Content-Type': 'text/html'})
                    res.end(content, 'utf-8'); //why utf-8?
                })
            }else{
                //some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`)
            }
        }else{
            res.writeHead(200, {'Content-Type': contentType})
            res.end(content, 'utf-8');
        }       
    })      
})

const port = process.env.PORT || 5000

server.listen(port, function(){
    console.log(`The real deal. Server running on port ${port}`)
})



//get nodemon ? to remove need to restart server in dev over each time; in package.json; script: "start": "node filename"; "dev": "nodemon filename"; then npm run dev

