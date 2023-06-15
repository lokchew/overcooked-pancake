
// Functions to call when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    getProductJson();
    createFooter();
});

let productLst;
async function getProductJson() {
    const response = await fetch('json/products.json');
    const lst = await response.json(); 
    productLst = lst;

    var productsContainer = document.querySelectorAll(".showcase-products");
        productsContainer.forEach(element => {
        var type = element.parentElement.getAttribute("product");
        var formattedType = type.replace("-", " ");
        var showcaseNum = productLst[formattedType].length;
        if (productsContainer.length > 1 && productLst[formattedType].length > 4) showcaseNum = 4;
        // console.log(showcaseNum)

        var images = "";
        for (var i = 0; i < showcaseNum; i++) {
            var product = productLst[formattedType][i];
            images += `
            <div class="showcase-product">
                <div class="showcase-product-img"><div style="background-image: url('image/product/${type}/${product.img[0]}');">
                </div></div>
                <p>${product.name}</p>
                <button onclick="createProductPage('${product.name}')">View Details</button>
            </div>
            `
        }
        element.innerHTML = images;
    });
}

function createProductPage(product) {
    // Create a new HTML page dynamically
    window.open(`product/template.html`);

    // // Create a new webpage
    // const newWebpage = document.createElement('html');

    // newWebpage.innerHTML = ``;

    // // Convert the modified template to a string
    // const webpageString = new XMLSerializer().serializeToString(newWebpage);

    // const newWindow = window.open("product.html");
    // newWindow.document.open();
    // newWindow.document.write(webpageString);
    // newWindow.document.close();
}

function createFooter() {
    var footer = document.createElement("footer");
    footer.innerHTML = `
    <div id="footer-contact">
        <div>
            <p class="uppercase">Contact email:</p>
            <p>everydayistremendous@gmail.com</p>
        </div>
        <div>
            <p class="uppercase">Working hours:</p>
            <p>MON - SUN 1pm to 9pm</p>
        </div>
    </div>
    <span></span>
    <div id="footer-connect">
        <p>FOLLOW US</p>
        <div id="connect-platforms">
            <a style="background-image: url('image/footer/instagram.png');" href=""></a>
        </div>
        <p style="font-size: 12px;">© 2023, I You We They</p>
    </div>
    `
    document.querySelector("body").appendChild(footer);
}