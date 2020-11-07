var PythonShell = require('python-shell');
//Python shell lets you use the Python interpreter in interactive mode, just as an OS shel
const fetchCommentPage = require('youtube-comment-api')
var videoId = "";
var fs = require("fs");
var comment_array=[]
var all_text="";

var express = require('express');
// Express.js is a framework used for Node and it is most commonly used as a web application for node js.
var cors = require('cors');
//his post shows how to enable Cross Origin Resource Sharing CORS in Node. CORS essentially means cross-domain requests
var app = express();
var bodyParser= require('body-parser');
//arser is which allows express to read the body and then parse that into a Json object that we can understand.
app.use(cors());
app.use(bodyParser.json());

var jsonfile = require('jsonfile')
var file = 'test.json'
//When exchanging data between a browser and a server, the data can only be text.

//JSON is text, and we can convert any JavaScript object into JSON, and send JSON to the server.

//We can also convert any JSON received from the server into JavaScript objects.


app.post('/make_csv',function(req,res){

	all_text="";
	comment_array=[];
	console.log("hello");
	videoId=req.body.videoId;
        console.log(videoId);
	fetchCommentPage(videoId)
	  .then(commentPage => {

		try{
			if(commentPage.comments.length!=0)
			{
				for(var i=0;i<commentPage.comments.length;i++)
				{
					comment_array.push(commentPage.comments[i].text);
					all_text=all_text+commentPage.comments[i].text;
				}
			}
		}catch(err)
		{
			console.log(err);
		}


	    return fetchCommentPage(videoId, commentPage.nextPageToken)
	  })
	  .then(commentPage => {

		try{
			if(commentPage.comments.length!=0)
			{
				for(var i=0;i<commentPage.comments.length;i++)
				{
					comment_array.push(commentPage.comments[i].text);
					all_text=all_text+commentPage.comments[i].text;
				}

			}

		}catch(err)
		{
			console.log(err);
		}
	})

	setTimeout(function(){
		console.log(comment_array);
		var array_tatti=[];
		var comment_object={text:all_text};
		array_tatti.push(comment_object);
		fs.writeFile("./comments.csv", JSON.stringify(array_tatti), function(err) {
		  if(err) {
			console.log(err);
		  }
		  else {
		    console.log("Output saved to /comments.csv");
			if(comment_array.length!=0)
			{
				PythonShell.run('script.py', function (err) {
					// file reading results .csv
					console.dir(jsonfile.readFileSync(file))
					res.send({"val":jsonfile.readFileSync(file)});
				  console.log('finished');
				});
			}else {
				res.send({"val":"-1"});
			}
		  }
		});

 },15000)
});

app.listen(3000);
