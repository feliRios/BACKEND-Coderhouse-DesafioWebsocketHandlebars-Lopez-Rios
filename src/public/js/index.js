const socket = io();
const cards = document.querySelector(".cards");

socket.on("productAdded", (data) => {
  cards.innerHTML += ` <article class="container" id="product-${data.productId}">
                          <div class="header">
                            <h3>${data.product.title}</h3>
                            <span>ID: ${data.productId}</span>
                          </div>
                          <div class="body">
                            <p>Desc: <em>${data.product.description}</em></p>
                            <span>Precio: <em>${data.product.price}</em></span>
                            <span>Codigo: <em>${data.product.code}</em></span>
                          </div>
                          <div class="footer">
                            <span>Stock: ${data.product.stock}</span>
                            <p>Categoria: <em>${data.product.category}</em></p>
                          </div>
                        </article>
                    `
  console.log(data);
});

socket.on("productRemoved", (data) => {
  const pid = data;
  const prodToRemove = document.getElementById(`product-${pid}`);
  cards.removeChild(prodToRemove);
})

function addProduct(){
  const product = {
    title: document.getElementById("producttitle").value,
    description: document.getElementById("productdesc").value,
    price: parseInt(document.getElementById("productprice").value),
    thumbnail: [document.getElementById("productthumb").value] || [],
    code: parseInt(document.getElementById("productcode").value),
    stock: parseInt(document.getElementById("productstock").value),
    status: document.getElementById("productstatus").value.trim() || true,
    category: document.getElementById("productcategory").value
  }
  socket.emit("productAdd", product);
  return false;
}

function deleteProduct(){
  const pid = parseInt(document.getElementById("productid_delete").value);
  socket.emit("productDelete", pid);
  return false;
}
