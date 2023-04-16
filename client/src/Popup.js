export default class Popup {
	htmlElement;

	constructor(cssSelector) {
		this.htmlElement = document.querySelector(cssSelector);
	}

	open() {
		this.htmlElement.classList.add(`visible`);
	}

	close() {
		this.htmlElement.classList.remove(`visible`);
	}
}