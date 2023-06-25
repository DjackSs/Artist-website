// ======================================================
    // COLOR THEME
// ======================================================

const themeButtons = document.querySelectorAll(`.header-top input[type="radio"]`);

console.log(themeButtons);

const activeTheme = window.localStorage.getItem("theme");

if (themeButtons.length != 0)
{
    for(let button of themeButtons)
    {
        if(button.id === activeTheme)
        {
            button.checked = true;
        }
        
        button.addEventListener("click", ()=>
        {
            
            if(button.id === "light")
            {
                window.localStorage.setItem("theme", "light");
            }
            else if(button.id === "dark")
            {
                window.localStorage.setItem("theme", "dark");
            }
        });
    }
}

// https://www.youtube.com/watch?v=fyuao3G-2qg




// ======================================================
    // ADMIN FETCH 
// ======================================================


// DELETE PRODUCT FETCH

const deleteProductButtons = document.querySelectorAll(".js-removeProduit-button");

if (deleteProductButtons.length != 0)
{
    for(let button of deleteProductButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            // ----------------------fecth settings
            
            const id = button.getAttribute("data-produit");
            
            const url = `/deleteProduct/${id}`;
            
            const options =
            {
                method: "delete",
                header: {"Content-Type": "application/json"}
                
            };
            
            // ----------------------fecth actions
            
            fetch(url, options)
            .then(res =>
            {
                const product = document.querySelector(`#productTable tr[id="${id}`);
                
                product.remove();
                
            })
            .catch(err => console.error(err));
            
        });
    }
    
}

// DELETE CLIENT FETCH

const deleteClientButtons = document.querySelectorAll(".js-removeClient-button");

if (deleteClientButtons.length != 0)
{
    for(let button of deleteClientButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            // ----------------------fecth settings
            
            const id = button.getAttribute("data-client");
            
            const url = `/deleteClient/${id}`;
            
            const options =
            {
                method: "delete",
                header: {"Content-Type": "application/json"}
                
            };
            
            // ----------------------fecth actions
            
            fetch(url, options)
            .then(res =>
            {
                const client = document.querySelector(`#clientTable tr[id="${id}`);
                
                client.remove();
                
            })
            .catch(err => console.error(err));
            
        });
    }
    
}

// PUT PRODUCT FETCH

const editProductButtons = document.querySelectorAll(".js-editProduit-button");

if (editProductButtons.length != 0)
{
    for(let button of editProductButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            const id = button.getAttribute("data-produit");
            
            // ----------------------DOM settings
            
            const oldName = document.querySelector(`#productTable tr[id="${id}"] td:first-child`);
                
            const oldDescription = document.querySelector(`#productTable tr[id="${id}"] td:nth-child(2)`);
            
            const oldCategory = document.querySelector(`#productTable tr[id="${id}"] td:nth-child(3)`);
            
            const oldPrice = document.querySelector(`#productTable tr[id="${id}"] td:nth-child(4)`);
            
            const oldButtons = document.querySelector(`#productTable tr[id="${id}"] td:last-child`);
            
            const oldButtonList = document.querySelectorAll(`#productTable tr[id="${id}"] td:last-child button`);
            
            // ----------------------
            
            const newName = document.createElement('input');
                newName.type="text";
                newName.name="editName";
                newName.value= oldName.innerText;
                
            const newDescription = document.createElement('input');
                newDescription.type="text";
                newDescription.name="editDescription";
                newDescription.value= oldDescription.innerText;
            
            const newCategory = document.createElement("select");
                newCategory.name="editCategory";
                
                const newOption1 = document.createElement("option");
                    newOption1.text="scrapbooking";
                    newOption1.value="scrapbooking";
                    
                const newOption2 = document.createElement("option");
                    newOption2.text="digital_art";
                    newOption2.value="digital_art";
                    
            const newPrice = document.createElement('input');
                newPrice.type="text";
                newPrice.name="editPrice";
                newPrice.value= oldPrice.innerText;
                
            const newButton = document.createElement("input");
                newButton.type="submit";
                newButton.name="Enregistrer";
                
                
            oldName.innerHTML="";
            oldName.append(newName);
            
            oldDescription.innerHTML="";
            oldDescription.append(newDescription);
            
            oldCategory.innerHTML="";
                newCategory.append(newOption1);
                newCategory.append(newOption2);
            oldCategory.append(newCategory);
            
            oldPrice.innerHTML="";
            oldPrice.append(newPrice);
            
            oldButtons.innerHTML="";
            oldButtons.append(newButton);
            
            // ----------------------fecth settings
            
            newButton.addEventListener("click",(e)=>
            {
                e.preventDefault();
                
                const url = `/editProduct/${id}`;
                
                
                const newProductData =
                {
                    nom: newName.value,
                    description: newDescription.value,
                    category: newCategory.value,
                    prix: newPrice.value
                };
            
               const options = 
               {
                    method: 'put',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(newProductData)
                };
                
                fetch(url, options)
                .then(res =>
                {
                    
                    oldName.removeChild(newName);
                    oldName.append(newName.value);
                    
                    oldDescription.removeChild(newDescription);
                    oldDescription.append(newDescription.value);
                    
                    oldCategory.removeChild(newCategory);
                    oldCategory.append(newCategory.value);
                    
                    oldPrice.removeChild(newPrice);
                    oldPrice.append(newPrice.value);
                    
                    oldButtons.removeChild(newButton);
                    
                    for(let oldbutton of oldButtonList)
                    {
                        oldButtons.append(oldbutton);
                        
                    }
                    
                    
                })
                .catch(err => console.error(err));
                
                    
            });
            
            
        });
    }
}


// CLOSE BUYING FETCH

const closeBuyingButtons = document.querySelectorAll(".js-closeBuying-button");

if(closeBuyingButtons.length != 0)
{
    for(let button of closeBuyingButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            const id = button.getAttribute("data-card");
            
            
            // ----------------------DOM settings
            
            const article = document.querySelector(`article[id="${id}`);
            
            // ----------------------fecth settings
            
            const url = `/closeBuying/${id}`;
            
            const options = 
               {
                    method: 'put',
                    headers: {'content-type': 'application/json'}
                };
                
            fetch(url, options)
            .then(res =>
            {
                    
                article.remove();
                    
                    
            })
            .catch(err => console.error(err));
            
        });
    }
}

// CLOSE CUSTOM FETCH

const closeCustomButtons = document.querySelectorAll(".js-closeCustom-button");

if(closeCustomButtons.length != 0)
{
    for(let button of closeCustomButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            const id = button.getAttribute("data-custom");
            
            
            // ----------------------DOM settings
            
            const article = document.querySelector(`article[id="${id}`);
            
            // ----------------------fecth settings
            
            const url = `/closeCustom/${id}`;
            
            const options = 
               {
                    method: 'put',
                    headers: {'content-type': 'application/json'}
                };
                
            fetch(url, options)
            .then(res =>
            {
                    
                article.remove();
                    
                    
            })
            .catch(err => console.error(err));
            
        });
    }
}



// ======================================================
    // CLIENT FETCH
// ======================================================


// ADD TO CARD FETCH

const addProductButtons = document.querySelectorAll(".js-addProduit-button");

if(addProductButtons.length != 0)
{
    for(let button of addProductButtons )
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
              // ----------------------fecth settings
            
            const idClient = button.getAttribute("data-addClient");
            
            const idProduct = button.getAttribute("data-addProduct");
            
 
            const url = `/addToCard/${idClient}`;
            
            const data =
            {
                idUserPanier: idClient,
                idProduit: idProduct
            };
            
            
            const options = 
               {
                    method: 'post',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(data)
                };
            
            // ----------------------fecth actions
            
            fetch(url, options)
            .then(res =>
            {
                
                const articleProduit = document.getElementById(`${idProduct}`);
                
                button.remove();
                
                articleProduit.append("Ajouté!");
                
               
                
            })
            .catch(err => console.error(err));
            
            
            
        });
    }
}


// DELETE FROM CARD FETCH

const deleteProductCardButtons = document.querySelectorAll(".js-removeProduitPanier-button");


if(deleteProductCardButtons.length != 0)
{
    for(let button of deleteProductCardButtons)
    {
        button.addEventListener("click", (e)=>
        {
            // ----------------------fecth settings
            
            const id = button.getAttribute("data-produit");
            
            const url = `/deleteProduitPanier/${id}`;
            
            const options =
            {
                method: "delete",
                header: {"Content-Type": "application/json"}
                
            };
            
            // ----------------------fecth actions
            
            fetch(url, options)
            .then(res =>
            {
                // ---------------reload the page to update the total price in Database
                window.location.reload();
                
            })
            .catch(err => console.error(err));
            
        });
    }
}


// CUSTOM COMMANDE FETCH

const customOrderButton = document.querySelector(".js-customOrder-button");

if(customOrderButton)
{
    customOrderButton.addEventListener("click", (e)=>
    {
        (e).preventDefault();
        
        const id = customOrderButton.getAttribute("data-userId");
        
        const textArea = document.querySelector(".customOrderArea");
        
        const commande = 
        {
            commande: textArea.value
            
        };
        
        const url = `/order/${id}`;
        
        const options = 
            {
                method: 'post',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(commande)
                
            };
                
        fetch(url, options)
        .then(res =>
        {
            textArea.value = "";
                
        })
        .catch(err => console.error(err));
                
        
    });
}

    


// DELETE COMMANDE FETCH

const deleteCommandeButtons = document.querySelectorAll(".js-removeCommande-button");

if(deleteCommandeButtons.length != 0)
{
    for(let button of deleteCommandeButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            
            // ----------------------fecth settings
            
            const id = button.getAttribute("data-commande");
            
            const url = `/deleteCommande/${id}`;
            
            const options =
            {
                method: "delete",
                header: {"Content-Type": "application/json"}
                
            };
            
            // ----------------------fecth actions
            
            fetch(url, options)
            .then(res =>
            {
                const commande = document.querySelector(`section article[id="${id}"`);
                
                commande.remove();
                
            })
            .catch(err => console.error(err));
            
            
        });
    }
}


// ======================================================
    // DIALOGUE FETCH
// ======================================================

const dialogueButtons = document.querySelectorAll(".js-dialogue-button");

if(dialogueButtons.length != 0)
{
    for(let button of dialogueButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            // ----------------------fecth settings
            
            const id = button.getAttribute("data-commande");
            
            const reply = 
            {
                comment: document.querySelector(`article[id="${id}"] textarea`).value,
                idUser: button.getAttribute("data-client"),
                idTransmitter: button.getAttribute("data-transmitter")
            };
            
            
            const url = `/dialogue/${id}`;
            
                const options = 
                {
                    method: 'post',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(reply)
                };
            
            // ----------------------fecth actions
            
            fetch(url, options)
            .then(res =>
            {
                
                const textArea = document.querySelector(`article[id="${id}"] textarea`);
                
                textArea.value = "";
                
                const dialogueDiv = document.querySelector(`article[id="${id}"] > div`);
                
                
                const pseudoP = document.createElement("p");
                const pseudo =document.querySelector(`article[id="${reply.idTransmitter}"] p:first-child`).innerHTML;
                
                pseudoP.append(pseudo);
                
                const dateP = document.createElement("p");
                const date = new Date().toDateString();
                
                dateP.append(date);
                
                const comentP = document.createElement("p");
                
                comentP.append(reply.comment);
                
                dialogueDiv.append(pseudoP);
                
                dialogueDiv.append(dateP);
                
                dialogueDiv.append(comentP);
               
                
            })
            .catch(err => console.error(err));
            
            
        });
    }
}


// ======================================================
    // EDIT PROFILE FETCH
// ======================================================

const editProfileButton = document.querySelector(".js-editProfile-button");

if(editProfileButton)
{
    editProfileButton.addEventListener("click", (e)=>
    {
        (e).preventDefault();
        
        const id = editProfileButton.getAttribute("data-profile");
        
        // ----------------------DOM settings
        
        const article = document.querySelector(`article[id="${id}"]`);
        
        const oldPseudo = document.querySelector(`article[id="${id}"] p:first-child`);
        
        const oldEmail = document.querySelector(`article[id="${id}"] p:nth-child(2)`);
        
        
        const newPseudo = document.createElement('input');
            newPseudo.type="text";
            newPseudo.name="editName";
            newPseudo.value= oldPseudo.innerText;
                    
        const newEmail = document.createElement('input');
            newEmail.type="text";
            newEmail.name="editName";
            newEmail.value= oldEmail.innerText;
                    
        const newButton = document.createElement("input");
            newButton.type="submit";
            newButton.value="Modifier";
            
        
        
        oldPseudo.innerHTML="";
            oldPseudo.append(newPseudo);
                
        oldEmail.innerHTML="";
            oldEmail.append(newEmail);
            
        article.removeChild(editProfileButton);
        
        article.append(newButton);
        
        newButton.addEventListener("click", (e)=>
        {
            e.preventDefault();
            
            const url = `/editProfile/${id}`;
                    
                    
            const newProfile =
            {
                pseudo: newPseudo.value,
                email: newEmail.value
            };
                
            const options = 
            {
                method: 'put',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(newProfile)
            };
                    
            fetch(url, options)
            .then(res =>
            {
                        
                oldPseudo.removeChild(newPseudo);
                oldPseudo.append(newPseudo.value);
                        
                oldEmail.removeChild(newEmail);
                oldEmail.append(newEmail.value);
                        
                        
                article.removeChild(newButton);
                        
                article.append(editProfileButton);
                        
                        
            })
            .catch(err => console.error(err));
                    
            
        });
        
        
        
    });
    
}
