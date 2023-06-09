let productLst;
getProductJson();

async function getProductJson() {
    const response = await fetch('../json/products.json');
    const lst = await response.json(); 
    setProductLst(lst);
}

function setProductLst(lst) {
    productLst = lst;
    // console.log(productLst)

    updateProductDisplay();
}

let filter;
function updateProductDisplay() {
    const container = document.getElementById("admin-products-container");
    var products = "";

    // Ensure the filter is a list
    if (filter == null) filter = Object.keys(productLst);
    else filter = [filter];
    // console.log(filter);

    filter.forEach(type => {
        productLst[type].forEach(product => {
            var imgFolder = product.type.toLowerCase().replace(" ", "-");
        
            products += 
            `<div class="admin-product-container" product-type="${product.type}" product-id="${product.id}">
                <input type="checkbox">
                <img src="../image/product/${imgFolder}/${product.img[0]}" style="background: #707070">
                <div class="admin-detail-grid">
                    <div>
                        <p class="product-title">${product.name}</p>
                        <p class="product-id">#${product.id}</p>
                    </div>
                    <div class="product-description">${product.description}</div>
                    <p class="product-img">${product.img.length}</p>
                    <p class="product-date">${product.date}</p>
                    <div class="product-action">
                        <a class="edit-product-btn" onclick="openProductForm(this)">&#128394 Edit</a>
                        <a class="remove-product-btn" onclick="removeProduct(this)">&#128465 Remove</a>
                    </div>
                </div>
            </div>`
        })
    })

    container.innerHTML = products;

    countProductNum();
}




/* --------------------------------------- Left panel ---------------------------------------*/
const productCategory = document.querySelectorAll(".product-category-container");
productCategory.forEach((element, index) => {
    element.addEventListener("click", () => {
        filterProduct(index);
    })
})

function filterProduct(type) {
    productCategory.forEach((element, index) => {
        if (index == type) element.classList.add("active");
        else element.classList.remove("active");
    })

    if (type > 0) filter = Object.keys(productLst)[type - 1];
    else filter = null;
    updateProductDisplay(filter)
}

function countProductNum() {
    var total = 0;
    var categoryNum = [0];
    Object.keys(productLst).forEach(type => {
        categoryNum.push(productLst[type].length);
    })

    const productCategoryNum = document.querySelectorAll(".product-category-num");
    productCategoryNum.forEach((element, index) => {
        var num = categoryNum[index];
        element.textContent = `(${num})`;
        total += num;
    });

    productCategoryNum[0].textContent = `(${total})`;
}





/* --------------------------------------- Product input form ---------------------------------------*/
const form = document.querySelector("form");

function openProductForm(product) {
    let productForm = document.getElementById("admin-product-form");
    productForm.style.display = "block";
    form.reset();

    productId = Math.round(Date.now() + Math.random());
    editProductID = -1;

    if (product != null) {
        product = product.closest(".admin-product-container");
        var type = product.getAttribute("product-type");
        var id = product.getAttribute("product-id");
        productLst[type].forEach((element, index) => {
            if (id == element.id) {
                productId = Number(id);
                editProductID = index;

                document.querySelector('input[name="product-title"]').value = element.name;
                document.querySelector('input[name="product-type"]').value = element.type;
                tinymce.activeEditor.selection.setContent(element.description);

                var imgFolder = element.type.toLowerCase().replace(" ", "-");
                for (var i = 0; i < element.img.length; i++) {
                    productImagesPreview.push(`../image/product/${imgFolder}/${element.img[i]}`)
                }
                return;
            }
        });
    }

    previewProductImages();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
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
    // console.log(productImagesPreview);
    let images = ""
    productImagesPreview.forEach((image, index) => {
        if (typeof image == "string") {
            images += `
            <div class="img-preview-container">
                <span onclick="deleteImage(${index})">x</span>
                <img src="${image}">
            </div>`
        } else {
            images += `
            <div class="img-preview-container">
                <span onclick="deleteImage(${index})">x</span>
                <img src="${URL.createObjectURL(image)}">
            </div>`
        }
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

let productId;
let editProductID = -1;
function submitProductForm() {
    const productTitle = document.querySelector('input[name="product-title"]').value;
    const productType = document.querySelector('input[name="product-type"]').value;
    const productDescription = tinymce.get("product-description").getContent();
    let productImages = [];

    productImagesPreview.forEach(img => {
        if (typeof img != "string") productImages.push(img.name);
        else productImages.push(img.substring(img.lastIndexOf('/') + 1));
    });
    // console.log(productImages)

    // Get the date when user submit the form
    const date = getDate();
    const updatedDate = `${date[0]}/${date[1]}/${date[2]}`

    // Save everything into an object
    const product = {id: productId, name: productTitle, type: productType, description: productDescription, img: productImages, date: updatedDate};

    if (editProductID > -1) productLst[productType][editProductID] = product;
    else {
        try {productLst[productType].push(product);} 
        catch (e) {productLst[productType] = [(product)];}
    }

    updateProductDisplay();
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






/* --------------------------------------- Remove product from list ---------------------------------------*/
function removeSelected() {
    var selected = document.querySelectorAll(".admin-product-container input:checked");
    selected.forEach(element => {removeProduct(element);});
    // console.log(productLst);

}

function removeProduct(product) {
    product = product.closest(".admin-product-container");
    // console.log(product);

    var type = product.getAttribute("product-type");
    var id = product.getAttribute("product-id");
    productLst[type].forEach((element, index) => {
        if (id == element.id) {
            productLst[type].splice(index, 1);
            updateProductDisplay();
            return;
        }
    });
}





/* --------------------------------------- Update json file ---------------------------------------*/
// Download json file https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
};

function downloadProductsJson() {
    saveTemplateAsFile("products.json", productLst);
}