
$(document).ready(function () {
    display()
    console.log("linked")
})


function display() {
    $.getJSON("/articles", function (data) {
        console.log("hi5")
        for (var i = 0; i < data.length; i++) {


            var button = $("<button>")
            button.attr("class", "saveart")
            button.text("Save Article")
            button.on("click", function () {
                var id = $(this).parent("div").attr("id")
                console.log(id)

                $.getJSON("/articles/" + id, function(data){
                    console.log(data)
                })

            })
            $("#articles").append("<div id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].description + "</div>");
            $("#" + data[i]._id).append(button)

        }
    });

}





function clear() {
    console.log("clear")
    $("#articles").empty()
    $.ajax({
        url: "/clear",
        type: 'DELETE',
        success: function (result) { }
    })
}



