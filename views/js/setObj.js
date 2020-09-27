$(document).ready(function() {
    $("a[id^='Take']").on('click', function() {
        //alert(this.id);
        var obj = {
            Id: this.id,
            Taken: false
        };
        document.cookie = `User=${JSON.stringify(obj)}; max - age=1000; SameSite = None; Secure`;
        localStorage.setItem("User", JSON.stringify(obj));
    });
});