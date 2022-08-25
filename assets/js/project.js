let dataBlog = [];
function addBlog(event) {
  event.preventDefault();

  let inputName = document.getElementById("input-project-name").value;
  let startDate = document.getElementById("date-start").value;
  let endDate = document.getElementById("date-end").value;
  let description = document.getElementById("description").value;
  let image = document.getElementById("image-upload").files;

  let nodeJs = document.getElementById("nodeJs").checked;
  let reactJs = document.getElementById("reactJs").checked;
  let nextJs = document.getElementById("nextJs").checked;
  let typeScript = document.getElementById("typeScript").checked;

  if (nodeJs) {
    nodeJs = document.getElementById("nodeJs").value;
  } else {
    nodeJs = "";
  }
  if (reactJs) {
    reactJs = document.getElementById("reactJs").value;
  } else {
    reactJs = "";
  }
  if (nextJs) {
    nextJs = document.getElementById("nextJs").value;
  } else {
    nextJs = "";
  }
  if (typeScript) {
    typeScript = document.getElementById("typeScript").value;
  } else {
    typeScript = "";
  }

  // console.log(nodeJs);
  // console.log(reactJs);
  // console.log(nextJs);
  // console.log(typeScript);

  // untuk membuat url gambar, agar gambar tampil
  image = URL.createObjectURL(image[0]);

  if (inputName == "") {
    return alert("nama project wajib diisi");
  } else if (startDate == "") {
    return alert("tanggal wajib diisi");
  } else if (endDate == "") {
    return alert("tanggal wajib diisi");
  } else if (description == "") {
    return alert("deskripsi wajib diisi");
  } else if (image == "") {
    return alert("gambar wajib diisi");
  }

  let blog = {
    inputName,
    startDate,
    endDate,
    description,
    image,
    author: "Eko Pras Setyo",
    postAt: "15 Agustus 2022",
  };

  dataBlog.push(blog);
  // console.log(dataBlog.length);
  console.log(blog);

  renderBlog();
}

function renderBlog() {
  console.log(dataBlog);
  document.getElementById("add-blog-container").innerHTML = "";

  // blogContainer.innerHTML = "";

  for (let index = 0; index < dataBlog.length; index++) {
    document.getElementById("add-blog-container").innerHTML += `
      <div>
        <a href="blog-detail.html">
          <div>
            <img src="${dataBlog[index].image}" alt="Blog Image" />
          </div>
          <div class="blog_title">
            <h4>${dataBlog[index].inputName}</h4>
            <p>
              ${dataBlog[index].description}
            </p>
          </div>
          <div>
          <i class="fa-brands fa-${dataBlog[index].nodeJs}"></i>
          <i class="fa-brands fa-${dataBlog[index].reactJs}"></i>
          <i class="fa-brands fa-${dataBlog[index].nextJs}"></i>
          <i class="fa-brands fa-${dataBlog[index].typeScript}"></i>
          </div>
          <div>
            <p>${dataBlog[index].postAt} | ${dataBlog[index].author}</p>
          </div>
        </a>
        <div>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
        `;
  }
}
