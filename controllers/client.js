// ==============================================
// TOOLS SET UP
// ==============================================

// -----------------------import database info 
import pool from "../config/database.js";

// -----------------------import randomiser generator for id's
import { v4 as uuidv4 } from 'uuid';

// -----------------------import the data encryptor
import bcrypt from 'bcryptjs';


// ==============================================
// CONTROLLERS
// ==============================================

export const login = (req, res) => 
{
    res.render('layout.ejs',
    {
        template: 'login.ejs'
        
    });
};


// ----------------------------------------------------


export const loginPost = (req, res) => 
{
    const login =
    {
        email: req.body.email,
        mdp: req.body.mdp
    };
    
    const query = `select * from User where email = ?`;
    
    pool.query(query,[login.email], function (error, result, fields) 
    {
            if (error) console.log(error);
            
	       
	            bcrypt.compare(login.mdp, result[0].mdp, function (error, isAllowed)
	            {
	            	if(isAllowed)
	            	{
	            		req.session.user =
		                {
			                   id: result[0].id,
			                   pseudo: result[0].pseudo,
			                   email: result[0].email,
			                   role: result[0].role
		                };
	            		// -----------------Setting up session's profile for each role:
	            		
	            		if(result[0].role === "client")
		                {
		                    req.session.isClient = true;
		                   
	                		res.redirect(`/profile/${result[0].id}`);
		                    
		                }
		                else if(result[0].role === "admin")
		                {
		                    req.session.isAdmin = true;
		                    
		                    res.redirect("/admin");
		                }
		                
	            	}
	            	else
	            	{
	            		res.redirect('/login'); 
	            	}
	            	
	            });

	  });
    
};

// ----------------------------------------------------


export const profile = (req, res) => 
{
	const userId = req.params.id;
	
	const query1 = `select Produit.* from Produit inner join Produit_Panier on idProduit = Produit.id inner join Panier on idPanier = Panier.id where idUserPanier = ? order by Produit.nom`;
	
	const query2= `update Panier set Panier.prixPanier = ? where Panier.idUserPanier = ? and Panier.statut = "cree"`;
	
	const query3 = `select Commande.* from Commande where idUser = ? order by Commande.dateCommande`;
	
	const query4 = `select Dialogue.*, User.pseudo from Commande left join Dialogue on Dialogue.idCommande = Commande.id left join User on Dialogue.idUser = User.id where Commande.idUser = ? order by Dialogue.dateDialogue`;
	
	
	pool.query(query1, [userId], function(error, produits, fields)
	{
	
		if(error) console.log(error);
		
		let totalPricePanier= 0;
		let totalPricePaye= 0;
		
		for(let produit of produits)
		{
			if(produit.statut === "free")
			{
				totalPricePanier += produit.prix;
			}
			if(produit.statut === "paye")
			{
				totalPricePaye += produit.prix;
			}
			
		}
		
		pool.query(query2, [totalPricePanier, userId], function(error, result, fields)
		{
			if(error) console.log(error);
			
			pool.query(query3, [userId], function(error, commandes, fields)
			{
				if(error) console.log(error);
				
				pool.query(query4, [userId], function(error, dialogues, fields)
				{
					if(error) console.log(error);
					
					res.render('layout.ejs',
					{
					    template: 'profile.ejs',
					    produits: produits,
					    prixPanier: totalPricePanier,
					    prixAchat: totalPricePaye,
					    commandes: commandes,
					    dialogues: dialogues
					        
					   });
					
				});
				
			});
			
		});

	});
    
};

// ----------------------------------------------------

export const editProfile = (req,res) =>
{
    let id = req.params.id;
    
    const editProfile =
    {
        pseudo: req.body.pseudo,
        email: req.body.email,
    };

    const query = `update User set ? where id = ?`;

	pool.query(query, [editProfile, id], function (error, result, fields)
	{
	    error ? console.log(error) : res.status(204).send();

	 });
    
};


// ----------------------------------------------------


export const logout = (req, res) =>
{
	req.session.destroy((error) =>
	{
		error ? console.log(error) : res.redirect("/");
		
	});
};

// ----------------------------------------------------

export const deleteProfile = (req,res) =>
{
    const deleteProfile = req.params.id;
    
    const query = `delete from User where id = ?`;
        
    req.session.destroy((error) =>
	{
		if(error) console.log(error);
			
		pool.query(query, [deleteProfile], function(error, result, fields)
		{
			error ? console.log(error) :  res.redirect("/");
	
		});
		
    });
    
};

// ----------------------------------------------------

export const shoppingAdd = (req,res) =>
{
	const shopItem =
	{
		idUserPanier: req.params.id,
		idProduit: req.body.idProduit
	};
	
	const query = `insert into Produit_Panier (idPanier, idProduit) values ((select id from Panier where idUserPanier = ?), ?)`;
	
	
	pool.query(query,[shopItem.idUserPanier, shopItem.idProduit], function(error, result, fields)
	{
		error ? console.log(error) : res.status(204).send();
	});
};

// ----------------------------------------------------

export const shoppingDelete = (req,res) =>
{
	const idProduit = req.params.id;
	
	const query = "delete from Produit_Panier where idProduit = ?";
	
	pool.query(query, [idProduit], function(error, result, fields)
	{
		error ? console.log(error) : res.status(204).send();
	});
};

// ----------------------------------------------------

export const shoppingPay = (req,res) =>
{
	const idClient = req.params.id;
	
	const panierStatus = "paye";
	
	const query1 = `update Panier set statut = ? where IdUserPanier = ?`;
	
	const query2 = `update Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit inner join Panier on Produit_Panier.idPanier = Panier.id set Produit.statut = Panier.statut where Panier.idUserPanier = ?`;
	
	const newCard =
            	{
            		id: uuidv4(),
            		idUserPanier: idClient,
            		prixPanier: 0,
            		statut: "Cree"
            	};
	
	const query3 = `insert into Panier (id, idUserPanier, prixPanier, statut, dateCreation) value (?, ?, ?, ?, NOW())`;
	
	// const query2 = `delete from Produit where id = (select Pr.id from (select * from Produit) as Pr inner join (select * from Produit_Panier) as PP on Pr.id = PP.idProduit inner join (select * from Panier) as Pa on Pa.id = PP.idPanier where Pa.idUserPanier in(?))`;
	
	pool.query(query1, [panierStatus, idClient], function(error, result, fields)
	{
		if(error) console.log(error);
		
		pool.query(query2, [idClient], function(error, result, fields)
		{
			if(error) console.log(error);
			
			pool.query(query3, [newCard.id, newCard.idUserPanier, newCard.prixPanier, newCard.statut], function(error, result, fields)
			{
				if(error) console.log(error);
				
				res.redirect(`/profile/${idClient}`);
				
			});
			
		});
	});
};

// ----------------------------------------------------

export const deleteCommande = (req,res) =>
{
    const deleteCommande = req.params.id;
    
    const query = `delete from Commande where id = ?`;
    
    pool.query(query, [deleteCommande], function(error, result, fields)
    {
        error ? console.log(error) : res.status(204).send();
    });
    
};

// ----------------------------------------------------

export const customOrder = (req,res) =>
{
	let customOrder;
	
	req.body.orderScrapbooking ? customOrder = req.body.orderScrapbooking : customOrder = req.body.orderDigitalArt;
	
	const newOrder =
	{
		id: uuidv4(),
		idClient: req.params.id,
		commande: customOrder
		
	};
	
	const query = `insert into Commande (id, idUser, commande, dateCommande) values (?, ?, ?, NOW())`;
	
	pool.query(query, [newOrder.id, newOrder.idClient, newOrder.commande], function(error, result, feilds)
	{
		error ? console.log(error) : res.status(204).send();
	});
	
};

// ----------------------------------------------------

export const clientDialogue = (req,res) =>
{
	const newClientReply =
    {
        id: uuidv4(),
        idCommande: req.params.id,
        comment: req.body.comment,
        idUser: req.body.idTransmitter
    };
    
    
    const query = "insert into Dialogue (id, idCommande, idUser, comment, dateDialogue) values (?, ?,(select User.id from User where id = ?), ?, NOW())";
    
    pool.query(query, [newClientReply.id, newClientReply.idCommande, newClientReply.idUser, newClientReply.comment], function(error, result, fields)
    {
        error ? console.log(error) : res.status(204).send();
    });
    
};

// ----------------------------------------------------

export const dialogue = (req,res) =>
{
    
    const newAdminReply =
    {
        id: uuidv4(),
        idCommande: req.params.id,
        comment: req.body.comment,
        idUser: req.body.idTransmitter
    };
    
    
    const query = "insert into Dialogue (id, idCommande, idUser, comment, dateDialogue) values (?, ?,(select User.id from User where id = ?), ?, NOW())";
    
    pool.query(query, [newAdminReply.id, newAdminReply.idCommande, newAdminReply.idUser, newAdminReply.comment], function(error, result, fields)
    {
        error ? console.log(error) : res.status(204).send();
    });
    
};
