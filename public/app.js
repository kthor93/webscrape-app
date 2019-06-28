$.getJSON("/posts", function (data) {
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        $("#posts").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

$(document).on("click", "p", function () {
    $("#comments").empty();

    const thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/posts/" + thisId
    }).then(function (data) {
            console.log(data);

            $("#comments").append("<h2>" + data.title + "</h2>");
            $("#comments").append("<input id='titleinput' name='title' >");
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            if (data.comment) {
                $("#titleinput").val(data.comment.title);
                $("#bodyinput").val(data.comment.body);
            }
        });
});

$(document).on("click", "#savecomment", function () {
    const thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/posts/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function (data) {
            console.log(data);

            $("#commments").empty();
        });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
