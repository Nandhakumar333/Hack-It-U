$(document).ready(function() {
    $('#myForm').on('submit', function(e) {
        var formdata = $('#myForm').serializeArray();
        /* var editor = document.getElementById("codeArea").value;
        formdata.push({'name': 'codeArea', 'value': editor}); */
        console.log(formdata);
        e.preventDefault();
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/student/compile',
            data: formdata
        }).done(function(data) {
            $.each(data, function(i, field){
                $("#main").append(field + " ");
            });
        })
    })
});

$(document).ready(function() {
    $('#compile').on('click', function(e) {
        var formdata = $('#myForm').serializeArray();
        /* var editor = document.getElementById("codeArea").value;
        formdata.push({'name': 'codeArea', 'value': editor}); */
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/student/check',
            data: formdata
        }).done(function(data) {
            console.log(data);
            createDiv(data.obt, data.exp);
        })
    })
})

function createDiv(out, expec){
    var dynamicHTML = '';
    for(var i=0; i<out.length; i++){
      dynamicHTML += '<div class="split right" style="border:none;">'+
                            '<div style="border-color:#3D8EB9; box-shadow: 1px 1px 1px 1px #888888; margin-bottom: 3px; background-color: #fff;">'+
                                '<pre">'+ out[i].output +'</pre>'+
                                '<pre">'+ expec[i].output +'</pre>'+
                            '</div>'+
                        '</div>';
    }
    $("body").append(dynamicHTML);
}