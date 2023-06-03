const form = document.querySelector("form");

function openProductForm(product) {
    let productForm = document.getElementById("admin-product-form");
    productForm.style.display = "block";
    form.reset();

    if (product != null) {

    }

    previewProductImages();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // let movieLst = JSON.parse(localStorage.getItem('movieLst')) || [];
    // movieLst.push(getMovieDetails());
    // // Sorting the movieLst based on watched date
    // sortOrder(movieLst, true, 2);
    // localStorage.setItem('movieLst', JSON.stringify(movieLst));
    // // console.log(JSON.parse(localStorage.getItem('movieLst')));
    submitProductForm();
    closeProductForm();
});

// Preview uploaded images https://medium.com/@mignunez/how-to-upload-and-display-multiple-images-with-javascript-93239e206034
let productImagesPreview = [];
let imageInput = document.getElementById("product-img");
let imageOutput = document.querySelector("#product-img-preview > div");
imageInput.addEventListener("change", () => {
    const files = imageInput.files
    for (let i = 0; i < files.length; i++) {
        productImagesPreview.push(files[i])
    }
    previewProductImages();
})

function previewProductImages() {
    let images = ""
    productImagesPreview.forEach((image, index) => {
        images += `
        <div class="img-preview-container">
            <span onclick="deleteImage(${index})">x</span>
            <img src="${URL.createObjectURL(image)}">
        </div>`
    })
    imageOutput.innerHTML = images;
}

function deleteImage(index) {
    productImagesPreview.splice(index, 1);
    previewProductImages();
}

function closeProductForm() {
    let productForm = document.getElementById("admin-product-form");
    productForm.style.display = "none";
    productImagesPreview = [];
}

function submitProductForm() {
    const productId = Math.round(Date.now() + Math.random());
    const productTitle = document.querySelector('input[name="product-title"]').value;
    const productType = document.querySelector('input[name="product-type"]').value;
    const productDescription = tinymce.get("product-description").getContent();
    let productImages = [];
    
    // Get the date when user submit the form
    const date = getDate();
    const updatedDate = `${date[0]}/${date[1]}/${date[2]}`
    console.log(updatedDate);

    // Save everything into an object
    const product = {id: productId, name: productTitle, type: productType, description: productDescription, img: productImages, date: updatedDate};
}

// A function to retrieve the date
// @param day (number): A number / integer that will be subtracted by today date, which helps to search for the date in the past (e.g. yesterday -> 1)
function getDate() {
    // Get date function https://www.freecodecamp.org/news/javascript-get-current-date-todays-date-in-js/
    const date = new Date();

    // Return the date in double digits https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
    let d = ("0" + date.getDate()).slice(-2);
    let m = ("0" + (date.getMonth() + 1)).slice(-2);
    let y = date.getFullYear();

    return [d, m, y];
}