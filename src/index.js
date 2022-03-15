import child from 'child_process'
import path from 'path'
import fs from 'fs'
import { getOptions, stringifyRequest } from 'loader-utils'
import { validate } from 'schema-utils'
import schema from './schema'

const defaultOptions = {
  aiOutputDir: 'ai2html-output',
  skipBuild: false,
}

export default function ai2ReactLoader() {
  const options = {
    ...defaultOptions,
    ...getOptions(this),
  }

  validate(schema, options, {
    name: 'Ai2React Loader',
    baseDataPath: 'options',
  })

  const resourcePath = this.resourcePath
  const resourceDir = path.dirname(resourcePath)
  const resourceExt = path.extname(resourcePath)
  const resourceName = path.basename(resourcePath, resourceExt)

  const ai2reactDir = path.dirname(require.resolve('ai2react'))
  const ai2react = options.ai2react || path.join(ai2reactDir, 'ai2react.js')

  const sourceName = path.join(options.aiOutputDir, `${resourceName}.js`)
  const sourcePath = path.resolve(resourceDir, sourceName)
  const sourceModule = stringifyRequest(this, sourcePath)
  const relativeSourcePath = path.relative(process.cwd(), sourcePath)

  if (!options.skipBuild) {
    try {
      // Run ai2react on the AI file
      child.execSync(`osascript -e 'tell application id "com.adobe.illustrator"
        activate
        open POSIX file "${resourcePath}" without dialogs
        do javascript file "${ai2react}"
      end tell'`)
    } catch(error) {
      if (fs.existsSync(sourcePath)) {
        // We failed to convert the AI file but we can fall back on existing
        // code (e.g., someone without Illustrator is running the project and
        // working on other aspects)
        const msg = `ai2react failed to generate code from Illustrator file. Falling back to existing module ${relativeSourcePath}`
        this.emitError(new Error(msg))
      } else {
        // We failed to convert and have to bail because we don't have
        // pre-existing code
        const msg = `ai2react failed to generate code from Illustrator file. This is fatal because the generated module does not already exist at ${relativeSourcePath}`
        throw new Error(msg)
      }
    }
  } else {
    if (!fs.existsSync(sourcePath)) {
      const msg = `ai2react-loader skipBuild is true but generated module does not exist at ${relativeSourcePath}`
      throw new Error(msg)
    }
  }

  const esModule = (typeof options.esModule !== 'undefined')
    ? options.esModule
    : true

  return `${esModule ? 'export default' : 'module.exports ='} require(${sourceModule}).default;`;
}
