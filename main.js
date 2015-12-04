require.config({
    paths: {
        text: "https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min"
    }
});
require([
	'./visualiser',
	"./uploader"
], function(){
    $("body").addClass("loaded");
});
