// ==============================================
// TOOLS SET UP
// ==============================================

// -----------------------import database info 
import pool from "../config/database.js";

// -----------------------import randomiser generator for id's
import { v4 as uuidv4 } from 'uuid';

// -----------------------import the data encryptor
import bcrypt from 'bcryptjs';

// -----------------------import the files system manager from node
import fs from "fs";

// -----------------------import the pdf generator
import PDFDocument from "pdfkit";


// ==============================================
// CONTROLLERS
// ==============================================

export const login = (req, res) => 
{
	
	let errorForm = {};
	
    res.render('layout.ejs',
    {
        template: 'login.ejs',
        errorForm: errorForm
        
    });
};


// ----------------------------------------------------


export const loginPost = (req, res) => 
{
    const login =
    {
        email: req.body.loginEmail,
        mdp: req.body.loginMdp
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
		                   
	                		res.redirect(`/profile/${result[0].id}`);
		                    
		                }
		                else if(result[0].role === "admin")
		                {
		                    
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
	
	const query1 = `select Produit.*, Produit_Panier.idPanier from Produit inner join Produit_Panier on idProduit = Produit.id inner join Panier on idPanier = Panier.id where idUserPanier = ? order by Produit.nom`;
	
	const query2= `update Panier set Panier.prixPanier = ? where Panier.idUserPanier = ? and Panier.statut = "cree"`;
	
	const query3 = `select Commande.* from Commande where idUser = ? order by Commande.dateCreationCommande`;
	
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
	
	const query = `insert into Produit_Panier (idPanier, idProduit) values ((select id from Panier where Panier.idUserPanier = ? and Panier.statut = "cree"), ?)`;
	
	
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
	
	const query1 = `update Panier set Panier.statut = ? where Panier.IdUserPanier = ? and Panier.statut = "cree"`;
	
	const query2 = `update Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit inner join Panier on Produit_Panier.idPanier = Panier.id set Produit.statut = Panier.statut where Panier.idUserPanier = ?`;
	
	const query3 = `delete from Produit_Panier where Produit_Panier.idPanier not in (select Panier.id from Panier where Panier.idUserPanier = ?)`;
	
	const newCard =
            	{
            		id: uuidv4(),
            		idUserPanier: idClient,
            		prixPanier: 0,
            		statut: "cree"
            	};
	
	const query4 = `insert into Panier (id, idUserPanier, prixPanier, statut, dateCreation) value (?, ?, ?, ?, NOW())`;
	
	const query5 = `select Produit.nom, Produit.description, Produit.prix, Produit.statut, Panier.id, Panier.statut from Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit inner join Panier on Produit_Panier.idPanier = Panier.id where Panier.idUserPanier = ? and Panier.statut = "paye"`;

	
	pool.query(query1, [panierStatus, idClient], function(error, result, fields)
	{
		if(error) console.log(error);
		
		pool.query(query2, [idClient], function(error, result2, fields)
		{
			if(error) console.log(error);
			
			pool.query(query3, [idClient], function(error, result3, fields)
			{
				if(error) console.log(error);
				
				pool.query(query4, [newCard.id, newCard.idUserPanier, newCard.prixPanier, newCard.statut], function(error, result, fields)
				{
					if(error) console.log(error);
					
					pool.query(query5, [idClient], function(error, produitPaye, fields)
					{
						if(error) console.log(error);
						
						// ---------------------------creat a bill's pdf;
						const doc = new PDFDocument();
									
						doc.pipe(fs.createWriteStream(`./public/assets/bills/facture${produitPaye[0].id}.pdf`));
						
						doc
						.fontSize(15)
						.text(`${new Date().toLocaleString()}`, 100, 80);
						
						doc
						.fontSize(25)
						.text(`Votre facture :`, 100, 100);
						
						produitPaye.forEach((item)=>
						{
							doc
							.fontSize(15)
							.text(`${item.nom}`, 100, 150);
							
							doc
							.fontSize(15)
							.text(`${item.prix}`, 100, 180);
							
						});
									
									  
						doc.end();
					
						
						res.redirect(`/profile/${idClient}`);
							
						
					});
					
				});
			
				
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

export const customPay = (req,res) =>
{
	const idClient = req.params.id;
	
	const statut = "paye";
	
	const query1 = `update Commande set Commande.statut = ? where Commande.IdUser = ? and Commande.statut = "cree"`;
	
	const query2 = `select Commande.* from Commande where Commande.idUser = ? and Commande.statut = ?`;
	
	pool.query(query1, [statut, idClient], function(error, result, fields)
	{
		if(error) console.log(error);
		
		pool.query(query2, [idClient, statut], function(error, commandePaye, fields)
		{
			if(error) console.log(error);
			
			// ---------------------------creat a bill's pdf;
			const doc = new PDFDocument();
						
			doc.pipe(fs.createWriteStream(`./public/assets/bills/facture${commandePaye[0].id}.pdf`));
			
			doc
			.fontSize(15)
			.text(`${new Date().toLocaleString()}`, 100, 80);
			
			doc
			.fontSize(25)
			.text(`Votre facture :`, 100, 100);
			
			commandePaye.forEach((item)=>
			{
				doc
				.fontSize(15)
				.text(`${item.devis}`, 100, 150);
				
				doc
				.text(`${item.prixCommande}`, 100, 180);
				
			});
						
						  
			doc.end();
			
			
			res.redirect(`/profile/${idClient}`);
			
			
		});
		
		
	});
	
	
};

// ----------------------------------------------------

export const customOrder = (req,res) =>
{
	
	const newOrder =
	{
		id: uuidv4(),
		idClient: req.params.id,
		commande: req.body.commande,
		devis: 0,
		prixCommande: 0,
		statut: "cree"
		
	};
	
	const query = `insert into Commande (id, idUser, commande, devis, prixCommande, statut, dateCreationCommande, dateClotureCommande) values (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
	
	pool.query(query, [newOrder.id, newOrder.idClient, newOrder.commande, newOrder.devis, newOrder.prixCommande, newOrder.statut], function(error, result, feilds)
	{
		error ? console.log(error) : res.status(204).send();
	});
	
};


// ----------------------------------------------------

export const dialogue = (req,res) =>
{
    
    const newReply =
    {
        id: uuidv4(),
        idCommande: req.params.id,
        comment: req.body.comment,
        idUser: req.body.idTransmitter
    };
    
    
    const query = "insert into Dialogue (id, idCommande, idUser, comment, dateDialogue) values (?, ?,(select User.id from User where id = ?), ?, NOW())";
    
    pool.query(query, [newReply.id, newReply.idCommande, newReply.idUser, newReply.comment], function(error, result, fields)
    {
        error ? console.log(error) : res.status(204).send();
    });
    
};

// ----------------------------------------------------

export const downloadBill = (req,res)=>
{
	const filePath = `./public/assets/bills/facture${req.params.id}.pdf`;
	
	res.download(filePath);
};
