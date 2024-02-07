import fs from 'fs'

import path from 'path'

import { Command } from 'commander'
const program = new Command()

program
	.option('-s, --styles', 'Create section file component.scss')
	.option('-p, --page', 'Create page file component.pug in src/pug/pages')
	.parse(process.argv)
const componentName =
	capitalizeFirstLetter(program.args[0]) || 'DefaultComponent'
let componentDirectory
if (program.pug || program.rawArgs.includes('-p')) {
	// Если использована опция -p, создаем файл .pug в директории src/pug/pages
	componentDirectory = path.join('src', 'pug', 'pages')
} else {
	// Иначе, создаем файл .pug в директории src/pug/blocks
	componentDirectory = path.join('src', 'pug', 'blocks', componentName)
}
if (!fs.existsSync(componentDirectory)) {
	fs.mkdirSync(componentDirectory)
}
const componentContent = `extends ../layouts/main.pug
block content 
    `
const componentFilePath = path.join(componentDirectory, `${componentName}.pug`)
fs.writeFileSync(componentFilePath, componentContent)
if (program.styles || program.rawArgs.includes('-s')) {
	const scssContent = `.${componentName.toLowerCase()} {
    
}`
	const scssFilePath = path.join(componentDirectory, `${componentName}.scss`)
	fs.writeFileSync(scssFilePath, scssContent)
	if (!program.pug && !program.rawArgs.includes('-p')) {
		// Если не использована опция -p, добавляем импорт в style.scss
		const styleFilePath = path.join('src', 'sass', 'style.scss')
		const importStatement = `@import '../../components/${componentName}/${componentName}.scss';\n`
		if (!fs.readFileSync(styleFilePath, 'utf-8').includes(importStatement)) {
			fs.appendFileSync(styleFilePath, importStatement)
			console.log(
				`Style import for component '${componentName}' added to style.scss.`
			)
		}
	}
}
console.log(`Component '${componentName}' created successfully.`)
function capitalizeFirstLetter(str) {
	return str ? str.slice(0) : ''
}
