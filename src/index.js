import child from 'child_process'
import path from 'path'
import { getOptions, stringifyRequest } from 'loader-utils'
import { validate } from 'schema-utils'
import schema from './schema'

export default function ai2ReactLoader() {
  const options = getOptions(this)

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
  child.execSync(`osascript -e 'tell application id "com.adobe.illustrator"
    activate
    open POSIX file "${resourcePath}" without dialogs
    do javascript file "${ai2react}"
  end tell'`)

  const sourceName = path.join('ai2html-output', `${resourceName}.js`)
  const sourcePath = path.resolve(resourceDir, sourceName)
  const sourceModule = stringifyRequest(this, sourcePath)

  const esModule = (typeof options.esModule !== 'undefined')
    ? options.esModule
    : true

  return `${esModule ? 'export default' : 'module.exports ='} require(${sourceModule}).default;`;
}
