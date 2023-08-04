// ==============================================
// TOOLS SET UP
// ==============================================

// -----------------------import database info 
import pool from "../config/database.js";

// -----------------------import randomiser generator for id's
import { v4 as uuidv4 } from 'uuid';

// -----------------------import the data encryptor
import bcrypt from 'bcryptjs';

// -----------------------import the files upload parser
import formidable from "formidable";

// -----------------------import the files system manager from node
import fs from "fs";

// -----------------------import the xss sanitation tools
import xss from "xss";


// ==============================================
// CONTROLLERS
// ==============================================


export const profileAdmin = (req, res) =>
{
    
    
    const query1 = `select Produit.* from Produit order by Produit.nom`;
    
    const query2 = `select User.id, User.pseudo, User.email, User.dateInscription, User.role from User order by User.dateInscription`;
    
    const query3 = `select Commande.*, User.pseudo, User.email from Commande inner join User on Commande.idUser = User.id order by Commande.dateCreationCommande`;
    
    const query4 = `select Dialogue.*, User.pseudo from Dialogue inner join User on User.id = Dialogue.idUser order by Dialogue.dateDialogue`;
    
    const query5 = `select Produit.*, Panier.*, User.pseudo, User.email from Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit inner join Panier on Produit_Panier.idPanier = Panier.id inner join User on Panier.idUserPanier = User.id where Panier.statut = "paye" order by User.email`;
    
    const query6 = `select Archive.* from Archive order by date`;
    
    pool.query(query1, function (error, produits, fields)
    {
        if(error) console.log(error);
        
        pool.query(query2, function (error, users, fields)
        {
            if(error) console.log(error);
            
            users = rightDate(users, "dateInscription");
    
            
            pool.query(query3, function(error, commandes, fields)
            {
                if(error) console.log(error);
                
                commandes = rightDate(commandes, "dateCreationCommande");
                
                
                pool.query(query4, function(error, dialogues, field)
                {
                    if(error) console.log(error);
                    
                    dialogues = rightDate(dialogues, "dateDialogue");
                    
                    
                    pool.query(query5, function(error, achats, fields)
                    {
                        if(error) console.log(error);
                        
                        const processedAchats = processAchats(achats);
                        
                        pool.query(query6, function(error, archives, fields)
                        {
                            if(error) console.log(error);
                            
                            archives = rightDate(archives, "date");
                            
                            res.render("layout.ejs",
                            {
                                template: "admin.ejs",
                                produits: produits,
                                users: users,
                                commandes: commandes,
                                achats: processedAchats,
                                dialogues: dialogues,
                                archives: archives
                                
                            });
                            
                        });
              
                    });
            
                });
                
            });
            
        });
    });
    
};

// ----------------------------------------------------

export const addProductPost = (req,res) =>
{
    
    let errorForm = {};
    
    // -------------formibable 3.0 = new synthax
    const form = formidable({});
    
    
    form.parse(req, (error, field, files)=>
    {
        // ----------------------------------------------------data's sanitation
        
        field.name = field.name.map((name)=>
        { 
            name = xss(name);
            return name;
            
        });
        
        field.description = field.description.map((description)=>
        { 
            description = xss(description); 
            return description; 
            
        });
        
        field.price = field.price.map((price)=>
        { 
            price = xss(price); 
            price = price.replace(/\s+/g,""); 
            return price;
        });
         
        // ----------------------------------------------------data's validation
        if(!field.name[0].trim() || field.name[0].trim().length >= 50)
        {
            errorForm.name = "Nom invalide";
        }
        
        if(!field.description[0].trim() || field.description[0].trim().length >= 100)
        {
            errorForm.description = "Description invalide";
        }
        
        if(!field.price[0].trim() || isNaN(field.price[0]) || field.price[0].trim() >= 999999)
        {
            errorForm.price = "Prix invalide";
        }
        
        
        if(!Object.keys(files).length)
        {
            errorForm.img = "Choisissez une image svp";
        }
        
        // -----------------------max weight that can be upload, here is 5Mo
        const maxLoad = 5*1024*1024;
        
        const acceptedMIME = ["image/svg+xml","image/gif","image/jpeg","video/mpeg","image/png","application/pdf","image/webp"];
        
        if(files.image)
        {
            
            // ----------------------------------------------------data's sanitation
        
            files.image = files.image.map((image)=>
            { 
                image.originalFilename = xss(image.originalFilename);
                image.filepath = xss(image.filepath);
                image.newFilename = xss(image.newFilename);
                image.mimetype = xss(image.mimetype);
                
                return image;
            });
            
            
            // ----------------------------------------------------data's validation
            
            
            
            if(files.image.size > maxLoad)
            {
            	errorForm.size = "Image trop lourde";
            }
            
            if(!acceptedMIME.includes(files.image[0].mimetype))
            {
            	errorForm.mime = "Format non pris en charge";
            }
            
        }
        
        
        if(Object.keys(errorForm).length != 0)
        {
            // -------------session is used to pass the error through redirect
            req.session.user.error = errorForm;
            return res.redirect("/admin");
            
        }
        
        
        // -----------------------formatting the file's name
        const extention = "."+files.image[0].originalFilename.split(".").pop();
        const oldPath = files.image[0].filepath;
        const newPath = "./public/upload/upload"+files.image[0].newFilename+extention;
  
        // ------------if requires are meets, the file is uploaded
        fs.copyFile(oldPath, newPath, (error) =>
	    {
	        if(error) console.log("erreur d'upload");
	            
	        const newProduct =
            {
                id: uuidv4(),
                nom: field.name,
                description: field.description,
                category: field.category,
                prix: field.price,
                img: "/upload/upload"+files.image[0].newFilename+extention,
                statut: "free"
            };
                
            const query = `insert into Produit set ?`;
            
            pool.query(query,[newProduct], function(error, result, fields)
            {
                if(error) console.log(error);
                    
                req.session.user.error = "";
                    
                res.redirect("/admin");
            });
	            
	            
	   });
    
            
    });
 };
    
    

// ----------------------------------------------------

export const deleteProduit = (req,res) =>
{
    const deleteProduct = xss(req.params.id);
    
    const query1 =`select Produit.* from Produit where Produit.id = ?`;
    
    const query2 = `delete from Produit where id = ?`;
    
    
    pool.query(query1, [deleteProduct], function(error, produit, fields)
    {
        if(error) console.log(error);
        
        // ---------------delte the file in the upload directory
        fs.unlink("./public"+produit[0].img,function(error)
        {
            if(error) console.log(error);
            
            pool.query(query2, [deleteProduct], function(error, result, fields)
            {
                error ? console.log(error) : res.status(204).send();
                
            });
            
        });
        
        
    });
    
};

// ----------------------------------------------------

export const deleteClient = (req,res) =>
{
    const deleteClient = xss(req.params.id);
    
    const query = `delete from User where id = ?`;
    
    pool.query(query, [deleteClient], function(error, result, fields)
    {
        error ? console.log(error) : res.status(204).send();
    });
    
};



// ----------------------------------------------------

export const editProduit = (req,res) =>
{
    // ----------------------------------------------------data's sanitation
    req.body.nom = xss(req.body.nom);
    req.body.description = xss(req.body.description);
    req.body.prix = xss(req.body.prix.replace(/\s+/g,""));
    
    // ----------------------------------------------------data's validation
    
    let errorForm = {};
    
    //  ------------------------------empty fields or invalid
    
    if(!req.body.nom.trim() || req.body.nom.trim().length >= 50)
    {
        errorForm.name = "Nom invalide";
    }
    
    if(!req.body.description.trim() || req.body.description.trim().length >= 100)
    {
        errorForm.descri = "description invalide";
    }
    
    if(!req.body.prix.trim() || isNaN(req.body.prix) || req.body.prix >= 1000000)
    {
        errorForm.price = "Prix invalide";
    }
    
    if(Object.keys(errorForm).length != 0)
    {
        return res.status(400).send(errorForm);
            
    }
    
    let id = xss(req.params.id);
    
    const editProduct =
    {
        nom: req.body.nom,
        description: req.body.description,
        category: req.body.category,
        prix: req.body.prix,
        statut: "free"
    };

    const query = `update Produit set ? where id = ?`;

	pool.query(query, [editProduct, id], function (error, result, fields)
	{
	    error ? console.log(error) : res.status(204).send();

	 });
    
};

// ----------------------------------------------------

export const closeBuying = (req,res) =>
{
    const id = xss(req.params.id);
    
    const panierStatus = "livre";
    
    const query = `update Panier set statut = ? where id = ?`;
    
    const query2 = `update Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit inner join Panier on Produit_Panier.idPanier = Panier.id set Produit.statut = Panier.statut where Panier.id = ?`;

	pool.query(query, [panierStatus, id], function (error, result, fields)
	{
	    if(error) console.log(error);
	    
	    pool.query(query2,[id], function(error, result2, fields)
	    {
	        error ? console.log(error) : res.status(204).send();
	  
	    });
	    

	 });
    
};

// ----------------------------------------------------

export const closeCustom = (req, res) =>
{
    
    const id = xss(req.params.id);
    
    const panierStatus = "livre";
    
    const query = `update Commande set statut = ? where id = ?`;

	pool.query(query, [panierStatus, id], function (error, result, fields)
	{
	    error ? console.log(error) : res.status(204).send();

	 });
    
};

// ----------------------------------------------------

export const devis = (req,res)=>
{
    // ----------------------------------------------------data's sanitation
    req.body.devis = xss(req.body.devis);
    req.body.devisPrix = xss(req.body.devisPrix.replace(/\s+/g,""));
    
    // ----------------------------------------------------data's validation
    let errorForm = {};
    
    if(!req.body.devis.trim() || req.body.devis.trim().length > 50)
    {
        errorForm.devis = "Intitulé invalide";
    }
    
    if(!req.body.devisPrix.trim() || isNaN(req.body.devisPrix) || req.body.devisPrix >= 1000000)
    {
        errorForm.price = "Prix invalide";
    }
    
    if(Object.keys(errorForm).length != 0)
    {
        return res.status(400).send(errorForm);
            
    }
    
    const idCommande = xss(req.params.id);
    
    const newDevis =
    {
        devis: req.body.devis,
        prixCommande: req.body.devisPrix
    };
    
    const query = `update Commande set devis = ?, prixCommande = ? where id = ?`;
    
    pool.query(query, [newDevis.devis, newDevis.prixCommande, idCommande], function(error, result, fields)
    {
        error ? console.log(error) : res.status(204).send();
    });
    
    
};






// ----------------------------------------------------This function process query on Produit.* / Panier.* where statut is "paye". It allow to regroupe  all product in the Card they bellong per client.



function processAchats (array)
{
  let newArray= [];
  let panierArray= [];
  let produits = [];
  
  
  for(let item of array)
  {
    
    let newObject =
    {
      idPanier:item.id,
      idClient:item.idUserPanier,
      pseudoClient: item.pseudo,
      email: item.email,
      prixPanier: item.prixPanier,
      produits:produits
   
    };
  
  let newProduit =
    {
      nom: item.nom,
      description:item.description,
      category:item.category,
      prix:item.prix,
    };
    
    
    
    if(panierArray.includes(item.id))
    {
      produits.push(newProduit);
    }
    else
    {
      
      produits = [];
      
      produits.push(newProduit);
      
      newObject.produits = produits;
      
      newArray.push(newObject);
      
      
    }
    
  panierArray.push(item.id);
    
    
  }
  
  
  return newArray;
  
}


// ----------------------------------------------------this function retunr a date in the desired format within an array of object or a json


function rightDate (array, key)
{
	let newArray = array.map((item)=>
	{
		if(item[key])
		{
			item[key] = item[key].toLocaleString("fr-FR");
			return item;
		}
		else
		{
			return item;
		}
	  
	});
	
	return newArray;
						
}					
