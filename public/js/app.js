
$(document).ready(function () {
    display()
    savedDisplay()
    console.log("linked")
})


function display() {
    $.getJSON("/articles", function (data) {
        
        for (var i = 0; i < data.length; i++) {


            var button = $("<button>")
            button.attr("class", "saveart")
            button.text("Save Article")
            button.on("click", function () {
                var id = $(this).parent("div").attr("id")
                console.log(id)
                $(this).remove()

                $.getJSON("/articles/" + id, function(data){
                    console.log(data)
                })

            })
            $("#articles").append("<div id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].description + "</div>");
            $("#" + data[i]._id).append(button)

        }

    });

}



function savedDisplay() {
    console.log("hola")
    $.getJSON("/savedarticles", function (data) {
        
        for (var i = 0; i < data.length; i++) {
            var button = $("<button>")
            button.attr("class", "delart")
            button.text("Delete Article")
            button.on("click", function () {
                var id = $(this).parent("div").attr("id")
                console.log(id)
                $.ajax({
                    url: "/delsaved/"+id,
                    type: 'DELETE',
                    success: function (result) {location.reload(); }
                }).then(function(){
                    console.log("why")
                    location.reload();
                })

             
                })
                var button2 = $("<button>")
                button2.attr("class", "notebutton")
                button2.text("Notes")
                button2.val(data[i]._id)
                button2.on("click", function(){
                    var id = $(this).val()
                    $("#submitBtn").val(id);
                    notedisplay(id)
                    $("#note-modal").modal("toggle");
                })

            $("#savedarticles").append("<div id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].description + "</div>");
            $("#" + data[i]._id).append(button)
            $("#" + data[i]._id).append(button2)

        }
    });

}

function notedisplay(id) {

    $("#savednotes").empty()

    $.getJSON(`/notes/${id}`, function (data) {
        console.log(data)
        for (let i = 0; i < data.length; i++) {


            const button = $("<button>")
            button.attr("class", "delnote")
            button.text("Delete Note")
            button.val(data[i]._id)
            button.on("click", function () {
                const id = $(this).val()
                $.ajax({
                    url: `/delnote/${id}`,
                    type: 'DELETE',
                    success: function (result) { notedisplay(data[i].articleId) }
                })
            })

            
            $("#savednotes").append("<div id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "</div>");
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



function clearsaved() {
    console.log("clear")
    $("#savedarticles").empty()
    $.ajax({
        url: "/clearsaved",
        type: 'DELETE',
        success: function (result) { }
    })
}


