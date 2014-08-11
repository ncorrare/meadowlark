var fortunes = [
        "Rivers need springs",
        "Conquer your fears or they will conquer you",
        "Do not fear what you don't know",
        "Whenever possible, keep it simple",
        "You will have a pleasant surprise",

];

exports.getFortune = function() {
	var idx = Math.floor(Math.random() * fortuneCookies.length);
	return fortuneCookies[idx];
};
