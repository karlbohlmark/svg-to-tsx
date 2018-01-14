#!/usr/bin/env node
'use strict'

const fs = require("fs");
const path = require("path");
const svgtojsx = require("svg-to-jsx");
const svgo = require("svgo");

const SVGO = new svgo({});

async function svgToTsx(svg, options) {
    const name = options.name
    let exportName = name ? `const ${name} =`: 'default'
    const jsxImport = options.jsxImport || "import * as React from 'react'" 
    const propType = options.propType || 'React.SVGAttributes<SVGElement> & React.SVGProps<SVGElement>'
    svg = (await SVGO.optimize(svg, name)).data;
    let jsx = await svgtojsx(svg);
    jsx = jsx.replace(/(<svg [^>]*)>/, '$1 {...props}>');
    let tsx = `${jsxImport}\nexport ${exportName} (props: ${propType})=> ${jsx}`;
    return tsx;
}

if (!module.parent) {
    const opts = {}
    const files = []
    const args = process.argv.slice(2)
    for(let i = 0; i < args.length; i++) {
        const arg = args[i]
        if (arg.startsWith('--')) {
            opts[arg.slice(2)] = args[i + 1]
            i++
        } else {
            files.push(arg)
        }
    }
    var file = files[0]
    
    var name = path.basename(file)
    let extension = path.extname(name)
    name = name.replace(extension, '')
    name = name[0].toUpperCase() + name.slice(1)
    name = name.replace(/-\w/g, function(m) {
        return m[1].toUpperCase();
    });
    // console.log(name, extension)

    const options = { name }
    
    if (opts.name) {
        options.name = name
    }
    if (opts.jsx) {
        options.jsxImport = opts.jsx
    }
    if (opts.prop) {
        options.propType = options.prop
    }
    

    fs.readFile(file, (err, content) => {
        if (err) {
            throw err
        }
        let result = svgToTsx(content.toString(), options);
        result.then(console.log);
    });
}