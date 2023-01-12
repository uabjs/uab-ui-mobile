import type { IApi } from 'father'
import fs from 'fs'
import path from 'path'

export default (api: IApi) => {
  api.modifyConfig(memo => {
    setTimeout(() => {
      ;['README.md', 'LICENSE', 'package.json'].forEach(name => {
        let fileContent = fs.readFileSync(path.resolve(__dirname, '../', name))

        if (name === 'package.json') {
          const rawJSON = fileContent.toString()
          const parsed = JSON.parse(rawJSON)
          delete parsed.scripts
          delete parsed.devDependencies
          delete parsed.publishConfig
          delete parsed.files
          delete parsed.resolutions
          delete parsed.packageManager
          const stringified = JSON.stringify(parsed, null, 2)
          fileContent = Buffer.from(stringified)
        }

        fs.writeFileSync(path.resolve(__dirname, '../dist', name), fileContent)
      })
    }, 1000)
    return memo
  })
}
