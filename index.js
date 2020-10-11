const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////////////
// Files

// Blocking, synchronous way
// const data= fs.readFileSync('./1-node-farm/starter/txt/input.txt', 'utf-8');
// console.log(data);

// const textOut = `This is what we know about the avacodo : $(data).\n Created on ${Date.now()}`;
// fs.writeFileSync('./1-node-farm/starter/txt/output.txt', textOut);
// console.log('File written');

// Non-blocking, asynchronous way
// fs.readFile('./1-node-farm/starter/txt/start.txt', 'utf-8', (err,data1) => {
//     if (err) return console.log('ERROR!!')

//     fs.readFile(`./1-node-farm/starter/txt/${data1}.txt`, 'utf-8', (err,data2) => {
//         console.log(data2);

//         fs.readFile('./1-node-farm/starter/txt/append.txt', 'utf-8', (err,data3) => {
//             console.log(data3);

//             fs.writeFile('./1-node-farm/starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written.');
//             });
//         });
//     });
// });
// console.log('Will read file');

////////////////////////////////////
// SERVER

const replaceTemp = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const data = fs.readFileSync(`./1-node-farm/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`./1-node-farm/starter/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`./1-node-farm/starter/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`./1-node-farm/starter/templates/template-card.html`, 'utf-8');

// Each time a new request function hits the server
// this call back function would be called. 
// res - gives us lots of tools to send out a respons
// req - various information about request like URL etc.
const server = http.createServer((req, res) => {
    const pathName = req.url;

    // Overview page
    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(ele => replaceTemp(tempCard, ele)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        
        res.end(output);

    // Product Page
    } else if (pathName === '/product') {
        res.end('This is the product');


    // API
    } else if (pathName === '/api'){
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);
    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>This page cannot be found</h1>');
    }
});

// listen takes a couple of parameters
// first is port
// second is host
// third (optional) a call back function
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening for a request on port 8000');
});

