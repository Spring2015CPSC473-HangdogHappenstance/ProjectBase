//Created by Mario.

var chat = function () {
	"use strict";

	var responseJSON;

	//When person clicks we will take the event object and get the id, given it's the friend_jd from the JSON object.
	//We hide the jumbotron temporarily when the user wants to chat.
	$("a").on("click", function (event){
		console.log(event.currentTarget.id); //Verifies the id of the friend you are chatting with.
		
		//Temporarily hide it while we put a new display. Conside saving that state somehow so we can
		//call it back without the new stuff that gets added to jumbotron.
		$(".jumbotron").hide();

		//Post to get back the JSON object with the Friend_id as the referrence.
		$.post("/query_mail", {"id": event.currentTarget.id})
			.done(function (data) {
				//When done display the JSON object to console. This is where I stopped because the JSON object never came back.
				responseJSON = data;
				console.log(responseJSON);
		});   

		//==============================================================================================

		//Generate a chat window in class chat-area with a textarea and submit button.
		//An iOS-like back button on the corner of the chat-area can take you "back" to
		//the chat list. Possible delete button rests in here so that when the user hits it
		//they can remove chat boxes or the entire set. When mail is read, make sure to change
		//Read value in JSON array to true.


		//Code goes here


		//==============================================================================================

		//When user hits the back button, $(.chat-area).empty() and $(.jumbotron).unhide()
		//At this point the chat box should update what you just chatted with your friend.


		//Code goes here

		//==============================================================================================

		//IF the user is talking to this person for the first time, it should render a similar page to
		//the one in the top except this creates a new object based on the different fields in the chat
		//like subject and to whom they are speaking to.


		//Code goes here

		//==============================================================================================

	});
};

$(document).ready(chat);