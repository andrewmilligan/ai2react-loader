import child from 'child_process'
import path from 'path'
import { stringifyRequest } from 'loader-utils'

export default function ai2ReactLoader() {
  const options = {}
  const resourcePath = this.resourcePath
  const resourceDir = path.dirname(resourcePath)
  const resourceName = path.basename(resourcePath, '.ai') // TODO: configurable extension

  const ai2react = path.resolve(__dirname, 'ai2react.js')
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
