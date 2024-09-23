import path from 'path'
import typescript from 'typescript'
import { createMatchPath } from 'tsconfig-paths'
import { getFormat, load, resolve as BaseResolve, transformSource } from 'ts-node/esm'
import os from 'os'
import * as fs from "node:fs";

const { readConfigFile, parseJsonConfigFileContent, sys } = typescript

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const configFile = readConfigFile('./tsconfig.json', sys.readFile)
if (typeof configFile.error !== 'undefined') {
    throw new Error(`Failed to load tsconfig: ${configFile.error}`)
}

const { options } = parseJsonConfigFileContent(
    configFile.config,
    {
        fileExists: sys.fileExists,
        readFile: sys.readFile,
        readDirectory: sys.readDirectory,
        useCaseSensitiveFileNames: true,
    },
    __dirname,
)

export { load, getFormat, transformSource }  // こいつらはそのまま使ってほしいので re-export する

const baseUrlResolve = (baseUrl) => {
    if (os.platform() === 'win32') {
        return baseUrl.slice(1).replace('/', '\\')
    }

    return baseUrl
}

const matchedSpecifierResolve = (matchedSpecifier) => {
    if (fs.existsSync(matchedSpecifier) && fs.statSync(matchedSpecifier).isDirectory()) {
        if (os.platform() === 'win32') {
            return `file://${matchedSpecifier}/index.ts`
        }

        return `${matchedSpecifier}/index.ts`
    }


    if (os.platform() === 'win32') {
        if (fs.existsSync(`${matchedSpecifier}.ts`)) {
            return `file://${matchedSpecifier}.ts`
        } else if (fs.existsSync(`${matchedSpecifier}`) && fs.statSync(matchedSpecifier).isDirectory()) {
            return `file://${matchedSpecifier}/index.ts`
        }
    }

    if (fs.existsSync(`${matchedSpecifier}.ts`)) {
        return `${matchedSpecifier}.ts`
    } else if (fs.existsSync(`${matchedSpecifier}`) && fs.statSync(matchedSpecifier).isDirectory()) {
        return `${matchedSpecifier}/index.ts`
    }

    return `${matchedSpecifier}.ts`
}

const matchPath = createMatchPath(baseUrlResolve(options.baseUrl), options.paths)

export async function resolve(specifier, context, defaultResolve) {
    const matchedSpecifier = matchPath(specifier)
    return BaseResolve(  // ts-node/esm の resolve に tsconfig-paths で解決したパスを渡す
        matchedSpecifier ? matchedSpecifierResolve(matchedSpecifier) : specifier,
        context,
        defaultResolve,
    )
}
