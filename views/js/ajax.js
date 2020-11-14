$(document).ready(function() {
    $('#myForm').on('submit', function(e) {
        var formdata = $('#myForm').serializeArray();
        console.log(formdata);
        e.preventDefault();
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/student/compile',
            data: formdata
        }).done(function(data) {
            $("#main").html("Test Cases Passed: " + data.pass);
        })
    })
});

$(document).ready(function() {
    $('#compile').on('click', function(e) {
        var formdata = $('#myForm').serializeArray();
        e.preventDefault();
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/student/check',
            data: formdata,
            success: function(data) {
                console.log(data);
                createDiv(data.obt, data.exp);
                alert('Success!')
            },
            error: function(jqXHR, textStatus, err) {
                //show error message
                alert('text status '+textStatus+', err '+err)
            }
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