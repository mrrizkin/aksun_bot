import unicode from './unicode.js'

const sundaahir = (huruf: string): string => {
	if (huruf === 'h' || huruf === 'r' || huruf === 'ng') {
		//@ts-ignore
		return unicode['+' + huruf]
	}

	//@ts-ignore
	return unicode[huruf] + unicode['+O']
}

export default (iStr: string) => {
	console.log(iStr)
	let latin = iStr.toLowerCase()

	const iLength = latin.length
	let idx = 0

	//@ts-ignore
	let tStr = ''
	let oStr = ''
	let r
	let silaba
	let suku
	let polasuku = '0'
	let l
	let i

	const PAT_V = '1'
	const PAT_VK = '2'
	const PAT_KV = '3'
	const PAT_KVK = '4'
	const PAT_KRV = '5'
	const PAT_KRVK = '6'

	// Pola V, VK, K, KV, KVK, KRV, KRVK:
	const KONS = 'kh|sy|[b-df-hj-mp-tv-z]|ng|ny|n'
	const VOK = '[aiuo\u00E9]|eu|e'
	//  VOK  = '[aiuoé]|eu|e'
	const REP = '[yrl]'
	const SILABA = `^(${KONS})?(${REP})?(${VOK})(${KONS})?(${VOK}|${REP})?`
	const KONSONAN = `^(${KONS})`
	const DIGIT = '^([0-9]+)'

	while (idx < iLength) {
		suku = ''
		r = latin.match(SILABA)
		if (r != null) {
			// cari pola:
			if (r[1] != undefined) {
				if (r[4] != undefined) {
					if (r[2] != undefined) {
						if (r[5] != undefined) {
							polasuku = PAT_KRV
						} else {
							polasuku = PAT_KRVK
						}
					} else {
						if (r[5] != undefined) {
							polasuku = PAT_KV
						} else {
							polasuku = PAT_KVK
						}
					}
				} else {
					if (r[2] != undefined) {
						polasuku = PAT_KRV
					} else {
						polasuku = PAT_KV
					}
				}
			} else {
				if (r[4] != undefined) {
					if (r[5] != undefined) {
						polasuku = PAT_V
					} else {
						polasuku = PAT_VK
					}
				} else {
					polasuku = PAT_V
				}
			}

			// bentuk:
			if (polasuku == PAT_KRVK) {
				suku = r[1] + r[2] + r[3] + r[4]
				//@ts-ignore
				silaba = unicode[r[1]]
				//@ts-ignore
				silaba += unicode['+' + r[2] + 'a']
				//@ts-ignore
				silaba += unicode[r[3]]
				silaba += sundaahir(r[4])
			} else if (polasuku == PAT_KRV) {
				suku = r[1] + r[2] + r[3]
				//@ts-ignore
				silaba = unicode[r[1]]
				//@ts-ignore
				silaba += unicode['+' + r[2] + 'a']
				//@ts-ignore
				silaba += unicode[r[3]]
			} else if (polasuku == PAT_KVK) {
				suku = r[1] + r[3] + r[4]
				//@ts-ignore
				silaba = unicode[r[1]]
				//@ts-ignore
				silaba += unicode[r[3]]
				silaba += sundaahir(r[4])
			} else if (polasuku == PAT_KV) {
				suku = r[1] + r[3]
				//@ts-ignore
				silaba = unicode[r[1]]
				//@ts-ignore
				silaba += unicode[r[3]]
			} else if (polasuku == PAT_VK) {
				suku = r[3] + r[4]
				//@ts-ignore
				silaba = unicode[r[3].toUpperCase()]
				silaba += sundaahir(r[4])
			} else {
				suku = r[3]
				//@ts-ignore
				silaba = unicode[suku.toUpperCase()]
			}
			oStr += silaba
			tStr += suku + '(' + polasuku + '):'
		} else {
			r = latin.match(KONSONAN)
			if (r != null) {
				suku = r[1]
				silaba = sundaahir(suku)
				oStr += silaba
				tStr += suku + ';'
			} else {
				r = latin.match(DIGIT)
				if (r != null) {
					silaba = '|'
					suku = r[1]
					l = suku.length
					i = 0
					while (i < l) {
						//@ts-ignore
						silaba += unicode[suku.substr(i, 1)]
						i += 1
					}
					silaba += '|'
					oStr += silaba
				} else {
					suku = latin.substr(0, 1)
					silaba = suku
					oStr += suku
				}
				tStr += suku + '(?)'
			}
		}
		latin = latin.substr(suku.length)
		idx += suku.length
	}

	return oStr
}
