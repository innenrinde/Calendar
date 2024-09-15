export default function init() {
	String.prototype.ucfirst = function() {
		if (!this) return ;
		return this.toLowerCase().replace(/(?:^|\s)([a-z])/g, u => u.toUpperCase());
	}
}