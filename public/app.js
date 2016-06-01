var counter = 0;


$.getJSON('/articles', function(data) {
	
 
  	$('#articles').append('<article data-id="' + data[0]._id + '"><a href="https://news.vice.com/' + data[0].link +'"<h3>'+ data[0].title + '</h3></a><br/><p>'+ data[0].body + '</p></article>');
  	//console.log(counter);
   // if(data.note){
     


//previous button
  	$('#left').on('click', function(){
  	counter--;
  		$('#articles').text('');
  		if( counter >= 0) {
  			
  			$('#articles').append('<article data-id="' + data[counter]._id + '"><a href="https://news.vice.com/' + data[counter].link +'"<h3>'+ data[counter].title + '</h3></a><br/><p>'+ data[counter].body + '</p></article>');
  			//console.log(counter);
  			return;
  		} else {
  			counter = data.length-1;
  			$('#articles').append('<article data-id="' + data[data.length-1]._id + '"><a href="https://news.vice.com/' + data[data.length-1].link +'"<h3>'+ data[data.length-1].title + '</h3></a><br/><p>'+ data[data.length-1].body + '</p></article>');
	  		//console.log(counter);
	  		return;
  		}
  	})

//next button
  	$('#right').on('click', function(){
  	counter++;
  		$('#articles').text('');
  		if( counter <= data.length-1) {
  			
  			$('#articles').append('<article data-id="' + data[counter]._id + '"><a href="https://news.vice.com/' + data[counter].link +'"<h3>'+ data[counter].title + '</h3></a><br/><p>'+ data[counter].body + '</p></article>');
  			//console.log(counter);
  			return;
  		} else {
  			counter = 0;
  			$('#articles').append('<article data-id="' + data[0]._id + '"><a href="https://news.vice.com/' + data[0].link +'"<h3>'+ data[0].title + '</h3></a><br/><p>'+ data[0].body + '</p></article>');
	  		//console.log(counter);
	  		return;
  		}
  	})

/// get initial note ////
var thisId = $('#articles').children().attr('data-id');
$.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);

      if(data.note){
        $('#notedisplay').append('<h3 data-id="'+ data.note._id + '">'+ data.note.title + '</h3');
        $('#notedisplay').append('<p>' + data.note.body + '</p>');
      } else {
        $('#notedisplay').append('<h3> There are no notes to display </h3');
        $('#notedisplay').append('<p> Please add a note </p>');
      }

    });


});







////Get Notes ////////

$(document).on('click', 'button', function(){
  $('#notedisplay').empty();
  var thisId = $('#articles').children().attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);

      if(data.note){
        $('#notedisplay').append('<h3 data-id="'+ data.note._id + '">'+ data.note.title + '</h3');
        $('#notedisplay').append('<p>' + data.note.body + '</p>');
      } else {
      	$('#notedisplay').append('<h3> There are no notes to display </h3');
        $('#notedisplay').append('<p> Please add a note </p>');
      }

    });
});




/////////////////////





$('#addnote').on("click", function(){

	var data = {
      title: $('#noteinputtitle').val().trim(),
      body: $('#noteinput').val().trim()
    }

    var thisId = $('#articles').children().attr('data-id');
    //alert(thisId);

    var URL = "/articles/" + thisId;
	//var currentURL = window.location.origin;

	$.post( URL, data)
		.done(function(data){
			console.log(data);
		})

	$('#noteinputtitle').val('');
	$('#noteinput').val('');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);

      $('#notedisplay').empty();

      if(data.note){
        $('#notedisplay').append('<h3 data-id="'+ data.note._id + '">'+ data.note.title + '</h3');
        $('#notedisplay').append('<p>' + data.note.body + '</p>');
      } else {
        $('#notedisplay').append('<h3> There are no notes to display </h3');
        $('#notedisplay').append('<p> Please add a note </p>');
      }

    });



	return false;

});	



/////remove note //////
$('#removenote').on('click', function(){

  var thisId = $('#notedisplay').children().attr('data-id');
  alert(thisId);

  var URL = "/remove/" + thisId;

  $.post( URL)
    .done(function(data){
      console.log(data.note);
    });


  //   $.ajax({
  //   method: "GET",
  //   url: "/articles/" + thisId,
  // })
  //   .done(function( data ) {
  //     console.log(data);

  //     if(data.note){
  //       $('#notedisplay').append('<h3 data-id="'+ data.note._id + '">'+ data.note.title + '</h3');
  //       $('#notedisplay').append('<p>' + data.note.body + '</p>');
  //     } else {
  //       $('#notedisplay').append('<h3> There are no notes to display </h3');
  //       $('#notedisplay').append('<p> Please add a note </p>');
  //     }

  //   });


})
