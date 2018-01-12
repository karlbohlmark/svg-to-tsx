# svg-to-tsx

A node module and cli for converting svg:s to tsx (Typescript jsx components)

### Usage

```bash
# Outputs to stdout
svg-to-tsx icons.svg

# Use --jsx to specify jsx import statement. Below is the default
svg-to-tsx --jsx "import * as React from 'react'" icons.svg

# Override the name of the exported component (defaults to identifierified file name)
svg-to-tsx --name Logo smth.svg
```

```js
import * as fs from 'fs'
import { svgToTsx } from 'jsx-to-tsx'

let tsxSource = await svgToTsx(fs.readFileSync('icon.svg').toString(), { name: 'MyIcon' })
```