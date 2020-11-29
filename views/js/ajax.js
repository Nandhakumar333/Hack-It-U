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
            $("#main").html("Test Cases Passed: " + data.pass + " Of " + data.total);
        })
    })
});

$(document).ready(function() {
    $('#compile').on('click', function(e) {
        var formdata = $('#myForm').serializeArray();
        let code = localStorage.getItem('code');
        formdata[1].value = code;
        console.log(formdata)
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/student/check',
            data: formdata
        }).done(function(data) {
            console.log(data);
            let obt = data.obt;
            let  exp = data.exp;
            console.log(obt, exp);
            var dynamicHTML;
            for(var i=0; i<obt.length; i++){
                $("#main").append("Expected: " + exp[i].output + "   Obtained: " + obt[i].output + "<br><br>");
            }
        })
    })
})