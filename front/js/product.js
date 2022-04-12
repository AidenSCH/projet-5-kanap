//Récupération de l’id du produit à afficher
let str = window.location.href;
let url = new URL(str);
let idProduct = url.searchParams.get("id");
let article = "";
checkId();



// testez l'id récupéré
 function checkId() { 
let idRegExp = new RegExp('^[a-z0-9]{32}$');
    if (idRegExp.test(idProduct)) {
        getArticle();
    } else{
        window.location.replace("index.html");
    }
};



const colorPicked = document.getElementById("colors");
const quantityPicked = document.getElementById("quantity");

// Récupération des articles de l'API
function getArticle() {
    fetch("http://localhost:3000/api/products/" + idProduct)
    .then((res) => {
        return res.json();
    })

    // Répartition des données de l'API dans le DOM
    .then(async function (resultatAPI) {
        article = await resultatAPI;        
        if (article){
            getPost(article);
        }
    })
    .catch((error) => {
        console.log("Erreur de la requête API");
    })
}
    
function getPost(article){
    // Insertion de l'image
    let productImg = document.createElement("img");
    document.getElementById("item__img").appendChild(productImg);
    productImg.src = article.imageUrl;
    productImg.alt = article.altTxt;

    // Modification du titre "h1"
    let productName = document.getElementById('title');
    productName.innerHTML = article.name;

    // Modification du prix
    let productPrice = document.getElementById('price');
    productPrice.innerHTML = article.price;

    // Modification de la description
    let productDescription = document.getElementById('description');
    productDescription.innerHTML = article.description;

    // Insertion des options de couleurs
    for (let colors of article.colors){        
        let productColors = document.createElement("option");
        document.getElementById("colors").appendChild(productColors);
        productColors.value = colors;
        productColors.innerHTML = colors;
    }
    addToCart(article);
}

function popupConfirmation(quantite, name, couleur){
    if(window.confirm(`Votre commande de ${quantite} ${name} ${couleur} est ajoutée au panier
    Pour consulter votre panier, cliquez sur OK`)){
                window.location.href ="cart.html";
            }
}


//Gestion du panier
function addToCart(article) {
    const btn_envoyerPanier = document.getElementById("addToCart");

    //Ecouter le panier avec 2 conditions couleur non nulle et quantité entre 1 et 100
    btn_envoyerPanier.addEventListener("click", (event)=>{
        if (quantityPicked.value > 0 && quantityPicked.value <=100){

    //Recupération du choix de la couleur
    let choixCouleur = colorPicked.value;
                
    //Recupération du choix de la quantité
    let choixQuantite = quantityPicked.value;

    //Récupération des options de l'article à ajouter au panier
    let optionsProduit = {
        idProduit: idProduct,
        couleurProduit: choixCouleur,
        quantiteProduit: Number(choixQuantite),
        nomProduit: article.name,       
        descriptionProduit: article.description,
        imgProduit: article.imageUrl,
        altImgProduit: article.altTxt
    };

    //Initialisation du local storage
    let produitLocalStorage = JSON.parse(localStorage.getItem("produits"));

    

    //Importation dans le local storage
    //Si le panier comporte déjà au moins 1 article
    if (produitLocalStorage) {
    const resultFind = produitLocalStorage.find(  
        (el) => el.idProduit === idProduct && el.couleurProduit === choixCouleur);
        //Si le produit commandé est déjà dans le panier
        if (resultFind) {
            let newQuantite =
            parseInt(optionsProduit.quantiteProduit) + parseInt(resultFind.quantiteProduit);
            resultFind.quantiteProduit = newQuantite;
            
        //Si le produit commandé n'est pas dans le panier
        } else {
            produitLocalStorage.push(optionsProduit);
            
        }
    //Si le panier est vide
    } else {
        produitLocalStorage =[];
        produitLocalStorage.push(optionsProduit);
        
    }

    localStorage.setItem("produits", JSON.stringify(produitLocalStorage));
        console.table(produitLocalStorage);
    popupConfirmation(choixQuantite, article.name, choixCouleur);

}
    });
}