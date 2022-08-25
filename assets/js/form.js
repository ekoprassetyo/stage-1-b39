function submitData() {
  let name = document.getElementById("input-name").value;
  let email = document.getElementById("input-email").value;
  let phone = document.getElementById("input-number").value;
  let subject = document.getElementById("input-subject").value;
  let message = document.getElementById("input-message").value;

  // console.log(name);

  if (name == "") {
    return alert("nama wajib diisi");
  } else if (email == "") {
    return alert("email wajib diisi");
  } else if (phone == "") {
    return alert("phone number wajib diisi");
  } else if (subject == "") {
    return alert("subject wajib diisi");
  } else if (message == "") {
    return alert("message wajib diisi");
  }

  let emailReceiver = "ekop2331@gmail";

  // membuat a href menggunakan javascript
  let a = document.createElement("a");
  a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hallo nama saya ${name}, ${message}, silahkan kontak saya dengan email ${email}, dan no telp saya ${phone}`;
  a.click();
}
