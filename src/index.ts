import express, { Request, Response } from 'express'
import axios from 'axios'
import transliterate from './aksun'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req: Request, res: Response) => {
	res.send(
		`<h1 align="center">Sunda Script Transliteration Bot</h1>
		<a style="display: block" align="center" href="https://t.me/aksn_bot">click here</a>`
	)
})

app.post('/transliteration', (req: Request, res: Response) => {
	const { message } = req.body

	if (!message) return res.end()

	if (message.text === '/start') {
		axios
			.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
				chat_id: message.chat.id,
				text: 'Wilujeung sumping ^-^\nWasta abdi Aksun (Aksara Sunda)\n\nTugas abdi nyaeta ngaubah tulisan anu ku anjeun dikirimkeun ka abdi kana tulisan aksara sunda\n**mangga cobian**',
				parse_mode: 'MarkdownV2'
			})
			.then(() => {
				console.log('message posted')
				res.end('ok')
			})
			.catch((err) => {
				console.log('Error:', err)
				res.end('Error: ' + err)
			})
		return
	}

	axios
		.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
			chat_id: message.chat.id,
			text: transliterate(message.text)
		})
		.then(() => {
			console.log('message posted')
			res.end('ok')
		})
		.catch((err) => {
			console.log('Error:', err)
			res.end('Error: ' + err)
		})
})

app.listen(PORT, () => {
	console.log('🚀 successfully launched')
})
