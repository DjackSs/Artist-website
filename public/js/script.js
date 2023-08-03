// ======================================================
    // COLOR THEME
// ======================================================

const themeButtons = document.querySelectorAll(`.header-top input[type="radio"]`);

const activeTheme = window.localStorage.getItem("theme");

if (themeButtons.length != 0)
{
    const body = document.querySelector("body");
    
    const waveTop = document.querySelector(".breakTop");
    
    const waveBot = document.querySelector(".breakBot");
    
    for(let button of themeButtons)
    {
        if(button.id === activeTheme)
        {
            button.checked = true;
            
            if(button.id === "light" && waveTop)
            {
                
                waveBot.style.backgroundImage = `url("/assets/image/wave2.svg")`;
                waveTop.style.backgroundImage = `url("/assets/image/wave1.svg")`;
              
                
            }
            else if(button.id === "dark" && waveTop)
            {

                waveBot.style.backgroundImage = `url("/assets/image/wave2.2.svg")`;
                waveTop.style.backgroundImage = `url("/assets/image/wave1.2.svg")`;
                
            }
        }
        
        button.addEventListener("click", ()=>
        {
            
            if(button.id === "light")
            {
                window.localStorage.setItem("theme", "light");
                body.classList.remove("dark");
                
                if(waveTop)
                {
                    waveBot.style.backgroundImage = `url("/assets/image/wave2.svg")`;
                    waveTop.style.backgroundImage = `url("/assets/image/wave1.svg")`;
                }
                
            }
            else if(button.id === "dark")
            {
                window.localStorage.setItem("theme", "dark");
                body.classList.add("dark");
                
                if(waveTop)
                {
                    waveBot.style.backgroundImage = `url("/assets/image/wave2.2.svg")`;
                    waveTop.style.backgroundImage = `url("/assets/image/wave1.2.svg")`;
                    
                }
                
            }
        });
    }
}


// ======================================================
    // QUICK NAV
// ======================================================

const fixedNav = document.querySelector(".flyNav");

const headerNav = document.querySelector("#nav");

window.addEventListener("scroll", quickNav);

function quickNav () 
{
    if(headerNav.getBoundingClientRect().bottom <= 0)
    {
        fixedNav.classList.add("quick_nav");
    }
    else
    {
        
        fixedNav.classList.remove("quick_nav");
        
    }
    
}


// ======================================================
    // LOGO ANIMATION
// ======================================================


// ------------this scrit is based on : https://armandocanals.com/posts/CSS-transform-rotating-a-3D-object-perspective-based-on-mouse-position.html

if(!window.matchMedia("(pointer: coarse)").matches && window.innerWidth >= 890) {
    // this animation is not operating on touchscreen devices nor on small screen devices
    
    const container1 = document.querySelector("header");


    const element1 = document.querySelector(".logo");
    
    
    container1.addEventListener("mousemove", (e)=>
    {
        window.requestAnimationFrame(()=>
        {
            translateElement(element1, e.clientX, e.clientY);
        });
    });
    
    
    container1.addEventListener("mouseleave", (e)=>
    {
        window.requestAnimationFrame(()=>
        {
            backIdle(element1);
            
        });
    });
    
}



function translateElement(element, x, y)
{
    const max = 50;
    
    let box = element.getBoundingClientRect();
    
    let calcX = (x - box.x - (box.width / 2)) / max;
    let calcY = (y - box.y - (box.height / 2)) / max;
    
    element.style.transform = `translateX(${calcX-50}%) translateY(${calcY}%) scale3d(1.05, 1.05, 1.05)`;
    
    element.style.transition = "0.3 linear";
}

function backIdle (element)
{
    element.style.transform = "scale3d(1, 1, 1) translateX(-50%) translateY(0)";
    element.style.transition = "0.5s linear";
}




// ======================================================
    // CAROUSEL
// ======================================================


const carouselButtons = document.querySelectorAll(".carousel button");

if(carouselButtons.length != 0)
{
    const carouselSlides = document.querySelectorAll(".slide");
    
    let index = 0;
    
    let slide = setInterval(diapo, 5000);
    
    for(let button of carouselButtons)
    {
        button.addEventListener("click", ()=>
        {
            clearInterval(slide);
            
            carouselSlides[index].removeAttribute("id","active");
            
            if(button.className == "carouselNext")
            {
                index++;
            }
            
            if(button.className == "carouselPrev")
            {
                index--;
            }
            
            if(index < 0)
            {
                index = carouselSlides.length-1;
            }
            
            if(index > carouselSlides.length-1)
            {
                index = 0;
            }
            
            carouselSlides[index].setAttribute("id","active");
            
            slide = setInterval(diapo, 3000);
            
            
        });
    }
    
    
    function diapo ()
    {
        carouselSlides[index].removeAttribute("id","active");
        
        index++;
        
        if(index < 0)
        {
            index = carouselSlides.length-1;
        }
        
        if(index > carouselSlides.length-1)
        {
            index = 0;
        }
        
        carouselSlides[index].setAttribute("id","active");
        
    }
}



// ======================================================
    // FADE ANIMATIONS
// ======================================================

const fadeElements = document.querySelectorAll(".fade");

if(fadeElements.length != 0)
{
    window.addEventListener("scroll", fadeIn);
}

function fadeIn ()
{
    const windowHeight = window.innerHeight;
    
    const threshold = 150;
    
    for(let element of fadeElements)
    {
        let elementTop = element.getBoundingClientRect().top;
        
        if(elementTop < windowHeight - threshold)
        {
            element.classList.add("fadeIn");
        }
        else
        {
            element.classList.remove("fadeIn");
        }
        
    }
}



// ======================================================
    // SLIDER SCRAPBOOKING
// ======================================================

const slider = document.querySelector("#slider");


if(slider)
{
    
    const products = document.querySelectorAll("#slider .product");
    
    
    
    if(products.length != 0)
    {
        
        let productSize;
       
        
        // ------------this part get the gap, in order to add it in the scroll value
        let gap = window.getComputedStyle(slider).gap;
        
        gap = Number(gap.slice(0, -2));
        
    
        const buttons = document.querySelectorAll(".shop button");
        
        buttons[0].addEventListener("click", ()=>
        {
             
            productSize = products[1].getBoundingClientRect();
            
            slider.scrollLeft -= productSize.width+gap;
            
           
            
            
        });
        
        buttons[1].addEventListener("click", ()=>
        {
            
            productSize = products[1].getBoundingClientRect();
            
            slider.scrollLeft += productSize.width+gap;
            
            
            
            
        });
        
    }
    
}



// ======================================================
    // MODAL PRODUCT
// ======================================================


// ------------------------ modal for scrapbooking shop's product

if(slider)
{
    const productImages = document.querySelectorAll(".product .img img");
    
    
    const modal = document.querySelector("#modal");
    
    for(let image of productImages)
    {
        image.addEventListener("click", ()=>
        {
            const src = image.src;
            
            modal.style.backgroundImage = `url("${src}")`;
            
            modal.showModal();
            
            modal.addEventListener("click", ()=>
            {
                
                modal.close();
                
            });

            
        });
    }
    
}


// ------------------------ modal digital art expression


const expressionImg = document.querySelectorAll(".expression div img");

if(expressionImg.length != 0)
{
    
    const modal = document.querySelector("#artModal");
    
    for(let image of expressionImg)
    {
        image.addEventListener("click", ()=>
        {
            const src = image.src;
            
            const modalTitle = document.createElement("h3");
                modalTitle.innerText = image.alt;
            
            modal.style.backgroundImage = `url("${src}")`;
            
            modal.style.display = "flex";
            
            modal.firstChild.remove();
            
            modal.append(modalTitle);
            
            modal.showModal();
            
            modal.addEventListener("click", ()=>
            {
                
                modal.close();
                
                modal.style.display = "none";
                
            });

            
        });
    }
    
    
    
}



// ======================================================
    // SELECTEUR ART_NUMERIQUE
// ======================================================

const art_buttons = document.querySelectorAll(`.selector div input[type="radio"]`);


if(art_buttons.length != 0)
{
    const art_articles = document.querySelectorAll(".art_child");
    
    document.addEventListener("DOMContentLoaded", ()=>
    {
        for(let button of art_buttons)
        {
            
            if(button.checked)
            {
                for(let article of art_articles)
                {
                    
                    if(article.classList.contains(`${button.id}`))
                    {
                        article.style.position = "relative";
                        
                        article.style.opacity = 1;
                        
                        article.classList.add("fadeIn");
                    }
                    else
                    {
                        article.style.position = "absolute";
                        
                        article.style.opacity = 0;
                        
                        article.classList.remove("fadeIn");
                    }
                }
            }
            
        }
    });
    
    for(let button of art_buttons)
    {
        button.addEventListener("click", ()=>
        {
            if(button.checked)
            {
                for(let article of art_articles)
                {
                    
                    if(article.classList.contains(`${button.id}`))
                    {
                        article.style.position = "relative";
                        
                        article.style.opacity = 1;
                        
                        article.classList.add("fadeIn");
                    }
                    else
                    {
                        article.style.position = "absolute";
                        
                        article.style.opacity = 0;
                        
                        article.classList.remove("fadeIn");
                    }
                
                }
            }
            
        });
    }
}






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

// EDIT PRODUCT FETCH

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
            
            const productSection =document.querySelector(".editProduct");
            
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
                    // --------------------if bad input, check res.json
                    if(!res.ok)
                    {
                        res.json()
                        .then(data =>
                        {
                            
                            if(data.name)
                            {
                                newName.value= "";
                                newName.placeholder = data.name;
                            }
                            
                            if(data.descri)
                            {
                                newDescription.value = "";
                                newDescription.placeholder = data.descri;
                            }
                            
                            if(data.price)
                            {
                                newPrice.value = "";
                                newPrice.placeholder = data.price;
                            }
                            
                            
                        });
                    }
                    else
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


// POST DEVIS FETCH

const devisButtons = document.querySelectorAll(".js-devis-button");

if(devisButtons.length != 0)
{
    for(let button of devisButtons)
    {
        button.addEventListener("click", (e)=>
        {
            (e).preventDefault();
            
            const id = button.getAttribute("data-commande");
            
            
            // ----------------------DOM settings
            
            const divCommande = document.querySelector(`section article[id="${id}"] div:first-child`);
            
            const formDevis = document.querySelector(`article[id="${id}"] form[data-id="${id}"]`);
            
            const inputDevis = document.querySelector(`form[data-id="${id}"] input[name="devis"]`);
            
            
            const inputPrice = document.querySelector(`form[data-id="${id}"] input[name="devisPrix"]`);
            
            
            const hDevis = document.createElement("h3");
            
            const pDevis = document.createElement("p");
            
            const pPrice = document.createElement("p");
            
            const divDevis = document.createElement("div");
                divDevis.classList.add("devis");
            
            
            // ----------------------
            
            hDevis.innerText = "Devis pour la commande :";
            
            pDevis.innerText = inputDevis.value;
            
            pPrice.innerText = inputPrice.value+" €";
            
            
            // ----------------------fecth settings
            
            
            const url = `/devisPost/${id}`;
            
            const newDevis =
            {
                devis: inputDevis.value,
                devisPrix: inputPrice.value
            };
            
            
            const options = 
               {
                    method: 'post',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(newDevis)
                };
                
            
            fetch(url, options)
            .then(res =>
            {
                
                    // --------------------if bad input, check res.json
                    if(!res.ok)
                    {
                        res.json()
                        .then(data =>
                        {
                            
                            if(data.devis)
                            {
                                inputDevis.value = "";
                                inputDevis.placeholder = data.devis;
                                
                            }
                            
                            if(data.price)
                            {
                                inputPrice.value = "";
                                inputPrice.placeholder = data.price;
                            }
                            
                            
                        });
                    }
                    else
                    {
                        formDevis.remove();
                
                        divDevis.append(hDevis);
                        
                        divDevis.append(pDevis);
                        
                        divDevis.append(pPrice);
                        
                        divCommande.append(divDevis);
                
                        
                    }
                    
                
                    
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
                
                const articleProduitContent = document.querySelector(`article[id="${idProduct}"] div:last-child`);
                
                button.remove();
                
                const popUp = document.createElement("p");
                    popUp.innerText = "Ajouté!";
                
                articleProduitContent.append(popUp);
                
               
                
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
            
            if(!res.ok)
            {
                res.json()
                .then(data =>
                {
                            
                    if(data.commande)
                    {
                        textArea.placeholder = data.commande.toString();
                                
                    }
                            
                            
                });
            }
            else
            {
        
                textArea.value = "";
                textArea.placeholder = "formulez votre souhait";
            }
                
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
                
                if(!res.ok)
                    {
                        res.json()
                        .then(data =>
                        {
                            
                            if(data.comment)
                            {
                                textArea.placeholder = data.comment.toString();
                                
                            }
                            
                            
                        });
                    }
                    else
                    {
                        textArea.value = "";
                        textArea.placeholder ="";
                        
                        const dialogueDiv = document.querySelector(`article[id="${id}"] > div:nth-child(2)`);
                        
                        
                        const pseudoP = document.createElement("p");
                        const pseudo = document.querySelector(`.profileDetail div h2`).innerText;
                        
                        pseudoP.append(pseudo);
                        
                        const dateSpan = document.createElement("span");
                        const date = new Date().toLocaleString("fr-FR");
                        
                        dateSpan.append(date);
                        dateSpan.classList.add("timeStamp");
                        
                        pseudoP.append(dateSpan);
                        
                        const comentP = document.createElement("p");
                        
                        comentP.append(reply.comment);
                        
                        dialogueDiv.append(pseudoP);
                        
                        dialogueDiv.append(comentP);
                        
                    }
                
                
               
                
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
        
        const article = document.querySelector(`div[id="${id}"]`);
        
        const oldPseudo = document.querySelector(`div[id="${id}"] h2`);
        
        const oldEmail = document.querySelector(`div[id="${id}"] h3:nth-child(2)`);
        
        const oldAdress = document.querySelector(`div[id="${id}"] h3:nth-child(3)`);
        
        
        const newPseudo = document.createElement('input');
            newPseudo.type="text";
            newPseudo.name="editName";
            newPseudo.value= oldPseudo.innerText;
                    
        const newEmail = document.createElement('input');
            newEmail.type="text";
            newEmail.name="editEmail";
            newEmail.value= oldEmail.innerText;
            
        const newAdress = document.createElement('input');
            newAdress.type="text";
            newAdress.name="editAdress";
            newAdress.value= oldAdress.innerText;
                    
        const newButton = document.createElement("input");
            newButton.type="submit";
            newButton.value="Modifier";
            
        
        
        oldPseudo.innerText="";
            oldPseudo.append(newPseudo);
                
        oldEmail.innerText="";
            oldEmail.append(newEmail);
            
        oldAdress.innerText="";
            oldAdress.append(newAdress);
            
        article.removeChild(editProfileButton);
        
        article.append(newButton);
        
        newButton.addEventListener("click", (e)=>
        {
            e.preventDefault();
            
            const url = `/editProfile/${id}`;
                    
                    
            const newProfile =
            {
                pseudo: newPseudo.value,
                email: newEmail.value,
                adress: newAdress.value
            };
                
            const options = 
            {
                method: 'put',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(newProfile)
            };
                    
            fetch(url, options)
            .then((res) =>
            {
                // --------------------if bad input, check res.json
                if(!res.ok)
                {
                    res.json()
                    .then(data =>
                    {
                        
                        if(data.name)
                        {
                            newPseudo.value = "";
                            newPseudo.placeholder = data.name;
                            
                        }
                        
                        if(data.email)
                        {
                            newEmail.value = "";
                            newEmail.placeholder = data.email;
                        }
                        
                        if(data.adress)
                        {
                            newAdress.value= "";
                            newAdress.placeholder = data.adress;
                        }
                        
                        
                    });
                }
                else
                {
                    oldPseudo.removeChild(newPseudo);
                    oldPseudo.append(newPseudo.value);
                                
                    oldEmail.removeChild(newEmail);
                    oldEmail.append(newEmail.value);
                    
                    oldAdress.removeChild(newAdress);
                    oldAdress.append(newAdress.value);
                                
                                
                    article.removeChild(newButton);
                                
                    article.append(editProfileButton);
                    
                }
            })
            .catch(err => 
            {
                console.log(err);
  
            });
                    
            
        });
        
        
        
    });
    
}
