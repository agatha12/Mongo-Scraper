$(document).ready(function () {
    display()
    savedDisplay()
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
            $("#articles").append(`<div class=article id= ${data[i]._id}> <h4>${data[i].title}</h4> <br> <a href=${data[i].link}>View the article</a> <br /> <p>${data[i].description}</p></div>`);
            $("#" + data[i]._id).append(button)

        }
        

    });

}

function displayscrape() {
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
            $("#articles").append(`<div class=article id= ${data[i]._id}> <h4>${data[i].title}</h4> <br> <a href=${data[i].link}>View the article</a> <br /> <p>${data[i].description}</p></div>`);
            $("#" + data[i]._id).append(button)

        }
        alert(`You have added ${data.length} articles`)

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
                

            $("#savedarticles").append(`<div class=article id= ${data[i]._id}> <p class=line></p> <h4>${data[i].title}</h4> <br> <a href=${data[i].link}>View the article</a> <br /> <p>${data[i].description}</p></div>`);
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

            
            $("#savednotes").append(`<div class=notesdiv id=${data[i]._id}><br /> Note: ${data[i].body}</div><br>`);
            $("#" + data[i]._id).append("<br>")
            $("#" + data[i]._id).append(button)

        }
    });

}






function clear() {

    $("#articles").empty()
    $.ajax({
        url: "/clear",
        type: 'DELETE',
        success: function (result) { }
    })
}



function clearsaved() {
    
    $("#savedarticles").empty()
    $.ajax({
        url: "/clearsaved",
        type: 'DELETE',
        success: function (result) { }
    })
}


