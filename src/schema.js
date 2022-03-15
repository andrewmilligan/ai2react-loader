export default {
  properties: {
    ai2react: {
      description: 'The path to an ai2react.js script for Adobe Illustrator',
      type: 'string',
    },
    aiOutputDir: {
      description: 'The name of the directory in which ai2react will generate output',
      type: 'string',
    },
    skipBuild: {
      description: 'Skip running ai2react and use pre-built code',
      type: 'boolean',
    },
  },
}
