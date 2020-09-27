function change() {
    let val = localStorage.getItem("User");
    if (val) {
        let data = JSON.parse(val);
        data['Taken'] = true;
        localStorage.setItem("User", JSON.stringify(data));
        if (data.Taken) {
            console.log("Already Taken", data.Id);
        } else {
            console.log("Not Taken");
        }
    } else {
        console.log("Not Taken");
    }
}