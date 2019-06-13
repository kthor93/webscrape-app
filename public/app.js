// Grab the posts as a json
$.getJSON("/posts", function (data) {
    // For each one
    for (let i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#posts").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
    // Empty the comments from the comment section
    $("#comments").empty();
    // Save the id from the p tag
    const thisId = $(this).attr("data-id");

    // Now make an ajax call for the Post
    $.ajax({
        method: "GET",
        url: "/posts/" + thisId
    })
        // With that done, add the comment information to the page
        .then(function (data) {
            console.log(data);
            // The title of the post
            $("#comments").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#comments").append("<input id='titleinput' name='title' >");
            // A textarea to add a new comment body
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new comment, with the id of the post saved to it
            $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            // If there's a comment in the post
            if (data.comment) {
                // Place the title of the comment in the title input
                $("#titleinput").val(data.comment.title);
                // Place the body of the comment in the body textarea
                $("#bodyinput").val(data.comment.body);
            }
        });
});

// When you click the savecomment button
$(document).on("click", "#savecomment", function () {
    // Grab the id associated with the post from the submit button
    const thisId = $(this).attr("data-id");

    // Run a POST request to change the comment, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/posts/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from comment textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the comments section
            $("#commments").empty();
        });

    // Also, remove the values entered in the input and textarea for comment entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
