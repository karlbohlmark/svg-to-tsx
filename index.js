#!/usr/bin/env node
'use strict'

const fs = require("fs");
const path = require("path");
const svgtojsx = require("svg-to-jsx");
const htmltojsx = require("htmltojsx");
const svgo = require("svgo");
const ToJsx = htmltojsx;

var converter = new ToJsx({
    createClass: false
});

const SVGO = new svgo({});

async function svgToTsx(svg, options) {
    const name = options.name
    let exportName = name ? `const ${name}`: 'default'
    const jsxImport = options.jsxImport || "import * as React from 'react'" 
    const propType = options.propType || 'React.SVGAttributes<SVGElement> & React.SVGProps<SVGElement>'
    svg = (await SVGO.optimize(svg, fileName)).data;
    svg = await svgtojsx(svg);
    let jsx = converter.convert(svg);
    let tsx = `{jsxImport}\nexport ${exportName} (props: ${propType})=> ${jsx}`;
    return tsx;
}

if (!module.parent) {
    var file = process.argv[2];
    var name = path.basename(file)
    fs.readFile(file, (err, content) => {
        if (err) {
            throw err
        }
        let result = svgToTsx(content.toString(), {name, jsxImport: "import { jsx } from '../jsx'"});
        result.then(console.log);
    });
}