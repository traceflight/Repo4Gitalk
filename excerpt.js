// # Excerpt Helper
// Usage: `{{excerpt}}`, `{{excerpt words="50"}}`, `{{excerpt characters="256"}}`
//
// Attempts to remove all HTML from the string, and then shortens the result according to the provided option.
//
// Defaults to words="50"

var downsize = require('downsize');
var proxy = require('./proxy'),
    _ = require('lodash'),
    SafeString = proxy.SafeString,
    getMetaDataExcerpt = proxy.metaData.getMetaDataExcerpt;

module.exports = function excerpt(options) {
    var truncateOptions = (options || {}).hash || {},
        excerptText = this.custom_excerpt ? String(this.custom_excerpt) : String(this.html);

    truncateOptions = _.pick(truncateOptions, ['words', 'characters', 'append', 'round']);
    _.keys(truncateOptions).map(function (key) {
        switch (key) {
            case "words":
            case "characters":
                truncateOptions[key] = parseInt(truncateOptions[key], 10);
                break;
            case "round":
                truncateOptions[key] = String(truncateOptions[key]).toLowerCase() === "true";
                break;
		}
    });

    if (!_.isEmpty(this.custom_excerpt)) {
        truncateOptions.characters = this.custom_excerpt.length;
        if (truncateOptions.words) {
            delete truncateOptions.words;
        }
    }

	var result = downsize(String(this.html), truncateOptions);

    // Strip inline and bottom footnotes
    result = result.replace(/<a href="#fn.*?rel="footnote">.*?<\/a>/gi, '');
    result = result.replace(/<div class="footnotes"><ol>.*?<\/ol><\/div>/, '');
    // Strip other html
    result = result.replace(/<\/?[^>]+>/gi, '');
    result = result.replace(/(\r\n|\n|\r)+/gm, ' ');

    return new SafeString(result);
};
