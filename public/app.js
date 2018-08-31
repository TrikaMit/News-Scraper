$(document).ready(function () {$('.commentDiv').hide()});
$.getJSON("/articlespopulated", function (data) {
    const articleList = $("<ul class='list-group'>");
    let title, link, img, form, comments, commentSection;
    $.each(data, function (i, article) {
        console.log(article);
        title = $("<li class='list-group-item'>").append(`<p id='title-text'>${article.title}</p>`);
        link = $(`<div><a href='${article.link}' target='_blank'>Read the full article</a></div>`)
        img = $(`<div><img src='${article.image}' class='img-fluid' alt='article image'></div>`)
        form = $(`<div class="form-group">
        <input type="text" class="form-control" name="Name" id="name" data-id='${article._id}' aria-describedby="helpId" placeholder="name">
        <input type="text" class="form-control" name="Comment" id="comment" data-id='${article._id}' aria-describedby="helpId" placeholder="comment">
            </div>
            <button type='submit' class='btn btn-dark' data-id='${article._id}'>Add a Comment</button>`)
        comments = (`<div><button type="button" class="btn btn-light" data-id='${article._id}'>
        View Comments <span class="badge badge-info">${article.comments.length}</span>
        </button></div>`)

        commentSection = $(`<div class='commentDiv' id='div${article._id}'><ul class='list-group'></div>`)
        let name, comment;

        $.each(article.comments, function (i, comments) {
            name = $("<li class='list-group-item'>").append(`<p id="nameTitle">User: ${comments.title}</p>`);
            comment = $(`<p>Comment: ${comments.body}</p>`)
            name.append(comment).append(`<button id=${comments._id} type="delete"><i class="fa fa-remove" aria-hidden="true"></i></button>`)
            commentSection.append(name)          
        })

        title.append(link).append(img).append(form).append('<br>').append(comments).append(commentSection);
        articleList.append(title);

    })
    $("#article-area").append(articleList);
});

$(document).on('click', 'button[type=submit]', function () {
    event.preventDefault();
    console.log(this);
    let id = $(this).attr('data-id');
    let name = $(`[data-id=${id}][id='name']`).val().trim();
    let comment = $(`[data-id=${id}][id='comment']`).val().trim();
    if (name.length > 0 && comment.length > 0) {
        console.log(name, comment)
        $.ajax({
            method: "POST",
            url: "/articles/" + id,
            data: {
                title: name,
                body: comment
            }
        })
        location.reload();
    } else {
        console.log("please enter both a name and a comment!")
    }
});

// let id;
$(document).on('click', 'button[type=button]', function () {
    event.preventDefault();
    let id = $(this).attr('data-id');
    $(`#div${id}`).toggle();
})

$(document).on('click', 'button[type=delete]', function() {
    event.preventDefault();
    let id = $(this).attr('id');
    $.ajax({
        method: "DELETE",
        url: "/comments/" + id,
        data: {
            id: id
        }
    })
    location.reload();
})