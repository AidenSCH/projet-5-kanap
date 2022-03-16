 // Insérer les produits dans la page d’accueil
 const canape =  document.getElementById("items");

 fetch("http://localhost:3000/api/products")
 .then((res) => {
  return res.json();
   }
 )

 //Faire le lien entre un a pi de la page d’accueil  
 
 .then(function(canapeData){
   for (let i=0; i<canapeData.length; i++) {
     canape.innerHTML += '<a href="./product.html?id='+canapeData[i]._id+'">'
     + '<article>'
          + '<img src="'+canapeData[i].imageUrl+'" alt="'+canapeData[i].altTxt+'">'
       + '<h3 class="productName">'+canapeData[i].name+'</h3>'
       + '<p class="productDescription">'+canapeData[i].description+'</p>'
      + '</article>'
   + '</a>';
   }
 })
 .catch(function(err){
  canape.innerHTML = 'Oops impossible de contacter le serveur';
 }); 