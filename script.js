
var slideshow = function () {
	console.log(2344);
	//var pictures = [$('#hike'), $('#widoki'), $('#cabin')];
	var pictures = $('.slideshow div')
	i = 0
	setInterval(function () {
 	  //  pictures[i % pictures.length].fadeOut(1500);
  	//	pictures[(i + 1) % pictures.length].fadeIn(1500);
  		pictures.eq(i % pictures.length).fadeOut(1500);
  		pictures.eq((i + 1) % pictures.length).fadeIn(1500);
  	  	i = i + 1
	}, 3000);
}

$(document).ready(function(){
	slideshow();
})
console.log(2344);