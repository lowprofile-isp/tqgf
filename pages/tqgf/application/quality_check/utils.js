// 富文本转纯文本
export const htmlToText = (html) => {
	if (html) {
		return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/ig, '')
	}
	return html
}