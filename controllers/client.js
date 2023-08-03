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

// -----------------------import the xss sanitation tools
import xss from "xss";

// -----------------------import the online payment tool: stripe
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK);


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
	// ----------------------------------------------------data's sanitation
    req.body.loginEmail = xss(req.body.loginEmail);
    req.body.loginMdp = xss(req.body.loginMdp);
    
     // ----------------------------------------------------data's validation
    let errorForm = {};
    
    if(!req.body.loginEmail.trim())
    {
        errorForm.loginEmail = "email invalide";
    }
    
    if(!req.body.loginMdp.trim())
    {
        errorForm.loginMdp = "Mots de passe invalide";
    }
    
    
    if(Object.keys(errorForm).length != 0)
    {
        return res.render('layout.ejs',
        {
            template: 'login.ejs',
            errorForm : errorForm
                    
        });
            
    }
    
    const login =
    {
        email: req.body.loginEmail,
        mdp: req.body.loginMdp
    };
    
    const query = `select * from User where email = ?`;
    
    pool.query(query,[login.email], function (error, user, fields) 
    {
            if (error) console.log(error);
            
            if(!user.length)
            {
            	errorForm.loginFail = "Utilisateur inconue";
	            		
	            return res.render('layout.ejs',
				{
					template: 'login.ejs',
				    errorForm : errorForm
				                    
				}); 
            	
            }
	       
	        bcrypt.compare(login.mdp, user[0].mdp, function (error, isAllowed)
	        {
	        	if(isAllowed)
	        	{
	            	req.session.user =
		            {
			        	id: user[0].id,
			            pseudo: user[0].pseudo,
			            email: user[0].email,
			            adress: user[0].adress,
			            role: user[0].role
		            };
	            		// -----------------Setting up session's profile for each role:
	            		
	            	if(user[0].role === "client")
		            {
		                   
	                	res.redirect(`/profile/${user[0].id}`);
		                    
		            }
		            else if(user[0].role === "admin")
		            {
		            	res.redirect("/admin");
		            }
		                
	            }
	            else
	            {
	            	errorForm.loginFail = "Mot de passe incorrecte";
	            		
	            	res.render('layout.ejs',
				    {
				    	template: 'login.ejs',
				        errorForm : errorForm
				                    
				    }); 
	            }
	            	
	        });

	  });
    
};

// ----------------------------------------------------


export const profile = (req, res) => 
{
	const userId = xss(req.params.id);
	
	const query1 = `select Produit.*, Produit_Panier.idPanier from Produit inner join Produit_Panier on idProduit = Produit.id inner join Panier on idPanier = Panier.id where idUserPanier = ? order by Produit.nom`;
	
	const query2= `update Panier set Panier.prixPanier = ? where Panier.idUserPanier = ? and Panier.statut = "cree"`;
	
	const query3 = `select Commande.* from Commande where idUser = ? order by Commande.dateCreationCommande`;
	
	const query4 = `select Dialogue.*, User.pseudo from Commande left join Dialogue on Dialogue.idCommande = Commande.id left join User on Dialogue.idUser = User.id where Commande.idUser = ? order by Dialogue.dateDialogue`;
	
	const query5 = `select Panier.* from Panier where Panier.idUserPanier = ? and Panier.statut in("paye","livre") order by Panier.dateCloture`;
	
	const errorForm = "";
	
	pool.query(query1, [userId], function(error, produits, fields)
	{
	
		if(error) console.log(error);
		
		let totalPricePanier= 0;
		
		for(let produit of produits)
		{
			if(produit.statut === "free")
			{
				totalPricePanier += produit.prix;
			}
			
		}
		
		pool.query(query2, [totalPricePanier, userId], function(error, result, fields)
		{
			if(error) console.log(error);
			
			pool.query(query3, [userId], function(error, commandes, fields)
			{
				if(error) console.log(error);
				
				commandes = rightDate(commandes, "dateClotureCommande");
				
				pool.query(query4, [userId], function(error, dialogues, fields)
				{
					if(error) console.log(error);
					
					dialogues = rightDate(dialogues, "dateDialogue");
					
					
					pool.query(query5, [userId], function(error, paniers, fields)
					{
						if(error) console.log(error);
						
						paniers = rightDate(paniers, "dateCloture");
						
						res.render('layout.ejs',
						{
						    template: 'profile.ejs',
						    produits: produits,
						    prixPanier: totalPricePanier,
						    commandes: commandes,
						    dialogues: dialogues,
						    paniers: paniers,
						    errorForm: errorForm
						        
						});
						
					});
					
			
				});
				
			});
			
		});

	});
    
};

// ----------------------------------------------------

export const editProfile = (req,res) =>
{
	// ----------------------------------------------------data's sanitation
    req.body.pseudo = xss(req.body.pseudo);
    req.body.email = xss(req.body.email);
    req.body.adress = xss(req.body.adress);
    
    // ----------------------------------------------------data's validation
	let errorForm = {};
	
	let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // https://www.w3resource.com/javascript/form/email-validation.php
    
    //  ------------------------------empty fields or invalid with regex
    
    if(!req.body.pseudo.trim())
    {
        errorForm.name = "Nom invalide";
    }
    
    if(!req.body.email.trim() || !regexEmail.test(req.body.email))
    {
        errorForm.email = "Adress email invalide";
    }
    
    if(!req.body.adress.trim())
    {
        errorForm.adress = "Adress invalide";
    }
    
     //  ------------------------------user already existe
    
    const queryUser = `select User.* from User where User.email = ?`;
   
    pool.query(queryUser, [req.body.email], function(error, userCheck, fields)
    {
        if(error) console.log(error);
        
        if(userCheck.length != 0 && userCheck[0].email != req.body.email) 
        {
            errorForm.email = "Ce compte existe déja";
        }
        
        
        // ----------------------------------------------------if an error occured, redirect for a retry
    
        if(Object.keys(errorForm).length != 0)
        {
            return res.status(400).send(errorForm);
            
        }
    
	    let id = xss(req.params.id);
	    
	    const editProfile =
	    {
	        pseudo: req.body.pseudo,
	        email: req.body.email,
	        adress: req.body.adress
	    };
	
	    const query = `update User set ? where id = ?`;
	
		pool.query(query, [editProfile, id], function (error, result, fields)
		{
		    if(error) console.log(error);
		    
		    // ---------------------------update the session's variable for ejs
		    req.session.user.pseudo = editProfile.pseudo;
		    req.session.user.email = editProfile.email;
		    req.session.user.adress = editProfile.adress;
		    
		    res.status(204).send();
	
		 });
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
    const deleteProfile = xss(req.params.id);
    
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
		idUserPanier: xss(req.params.id),
		idProduit: xss(req.body.idProduit)
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
	const idProduit = xss(req.params.id);
	
	const query = "delete from Produit_Panier where idProduit = ?";
	
	pool.query(query, [idProduit], function(error, result, fields)
	{
		error ? console.log(error) : res.status(204).send();
		
	});
};

// ----------------------------------------------------


export const cardCheckout = async (req,res) =>
{
	// -------------------whith stripe, we are in async mode
	
	const idClient = xss(req.body.client);
	
	const panierStatus = "cree";
	
	const query1 = `select Produit.* from Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit
		inner join Panier on Produit_Panier.idPanier = Panier.id where Panier.idUserPanier = ? and Panier.statut = ?`;
		
	await pool.query(query1, [idClient, panierStatus], async function (error, products, fields)
	{
		if(error) console.log(error);
		
		let stripeProducts = [];
		
		// ----------------this part turn the datas in the right format for stripe
		
		for(let product of products)
		{
			stripeProducts.push(
				{
					price_data:
					{
						currency: "eur",
						product_data:
						{
							name: product.nom
						},
						unit_amount: Number(product.prix)*100
					},
					quantity: "1"
				});
			
		}
		
		// ---------------call to the stripe api checkout
		
		const session = await stripe.checkout.sessions.create(
		{
			line_items: stripeProducts,
			mode:"payment",
			success_url: `http://nathanhamon.ide.3wa.io:3000/buy/${idClient}`,
			cancel_url: `http://nathanhamon.ide.3wa.io:3000/profile/${idClient}`,
		});
			
		
		res.redirect(303, session.url);
			
	
		
	});
	
	
};

// ----------------------------------------------------

export const shoppingPay = (req,res) =>
{
	const idClient = xss(req.params.id);
	
	const panierStatus = "paye";
	
	const query1 = `update Panier set Panier.statut = ?, Panier.dateCloture = NOW() where Panier.IdUserPanier = ? and Panier.statut = "cree"`;
	
	const query2 = `update Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit inner join Panier on Produit_Panier.idPanier = Panier.id set Produit.statut = Panier.statut where Panier.idUserPanier = ?`;
	
	const query3 = `delete from Produit_Panier where Produit_Panier.idPanier not in (select Panier.id from Panier where Panier.idUserPanier = ?)`;
	
	const newCard =
            	{
            		id: uuidv4(),
            		idUserPanier: idClient,
            		prixPanier: 0,
            		statut: "cree",
            		facturePanier: "",
            	};
	
	const query4 = `insert into Panier (id, idUserPanier, prixPanier, statut, facturePanier, dateCreation) value (?, ?, ?, ?, ?, NOW())`;
	
	const query5 = `select Produit.nom, Produit.description, Produit.prix, Produit.statut, Panier.id, Panier.statut, Panier.dateCloture, Panier.prixPanier from Produit inner join Produit_Panier on Produit.id = Produit_Panier.idProduit inner join Panier on Produit_Panier.idPanier = Panier.id where Panier.idUserPanier = ? and Panier.statut = "paye"`;

	
	pool.query(query1, [panierStatus, idClient], function(error, result, fields)
	{
		if(error) console.log(error);
		
		pool.query(query2, [idClient], function(error, result2, fields)
		{
			if(error) console.log(error);
			
			pool.query(query3, [idClient], function(error, result3, fields)
			{
				if(error) console.log(error);
				
				pool.query(query4, [newCard.id, newCard.idUserPanier, newCard.prixPanier, newCard.statut, newCard.facturePanier], function(error, result, fields)
				{
					if(error) console.log(error);
					
					pool.query(query5, [idClient], function(error, produitPaye, fields)
					{
						if(error) console.log(error);
						
						const newBill = `/facture${produitPaye[0].id}.pdf`;
						
						let lineBreak = 500;
						
						// ---------------------------creat a bill's pdf;
						const doc = new PDFDocument();
									
						doc.pipe(fs.createWriteStream(`./public/assets/bills${newBill}`));
						
						doc
						.fontSize(15)
						.text(`${produitPaye[0].dateCloture.toLocaleString("fr-FR")}`, 100, 80);
						
						doc
						.fontSize(40)
						.text(`Votre facture :`, 100, 100);
						
						doc
						.image("./public/assets/image/CDP_logo.png", 400, 50, {scale: 0.10});
						
						// ---------------------------seller
						
						doc
						.fontSize(25)
						.text("Vendeur :", 100, 250);
						
						doc
						.fontSize(15)
						.text("Cuisse de Poupou",250 , 280);
						doc
						.fontSize(15)
						.text("Adress du vendeur", 250, 300);
						doc
						.fontSize(15)
						.text("44000 Nantes", 250, 320);
						
						// ---------------------------customer
						
						doc
						.fontSize(25)
						.text(`Client :`, 100, 350);
						
						doc
						.fontSize(15)
						.text(`${req.session.user.pseudo}`, 250, 380);
						doc
						.fontSize(15)
						.text(`${req.session.user.adress}`, 250, 400);
						doc;
						
						produitPaye.forEach((item)=>
						{
							doc
							.fontSize(10)
							.text(`${item.nom}`, 100, lineBreak);
							
							doc
							.fontSize(10)
							.text(`${item.prix} €`, 400, lineBreak);
							
							lineBreak+=25;
							
						});
						
						doc
						.fontSize(25)
						.text(`Total : ${produitPaye[0].prixPanier} €`, 250, lineBreak+50);
									
									  
						doc.end();
						
						const query6 = `update Panier set Panier.facturePanier = ? where Panier.IdUserPanier = ? and Panier.id = ?`;
						
						const newArchive =
						{
							id: uuidv4(),
							category: "boutique",
							facture: newBill
						};
						
						const query7 = `insert into Archive (id, date, category, facture) values (?, NOW(), ?, ?)`;
						
						pool.query(query6, [newBill, idClient, produitPaye[0].id], function(error, result4, fields)
						{
							if(error) console.log(error);
							
							pool.query(query7, [newArchive.id, newArchive.category, newArchive.facture], function(error, result7, fields)
							{
								error ? console.log(error) : res.redirect(`/profile/${idClient}`);
								
							});
							
						});
						
					});
					
				});
			
				
			});
			
		
		});
	});
};

// ----------------------------------------------------

export const deleteCommande = (req,res) =>
{
    const deleteCommande = xss(req.params.id);
    
    const query = `delete from Commande where id = ?`;
    
    pool.query(query, [deleteCommande], function(error, result, fields)
    {
        error ? console.log(error) : res.status(204).send();
    });
    
};

// ----------------------------------------------------


export const customCheckout = async (req,res) =>
{
	// -------------------whith stripe, we are in async mode
	
	const ids =
	{
		idClient: xss(req.params.id),
		idCommande: xss(req.body.idCommande)
	};
	
	
	const query1 = `select Commande.* from Commande where id = ?`;
		
	await pool.query(query1, [ids.idCommande], async function (error, products, fields)
	{
		if(error) console.log(error);
		
		let stripeProducts = [];
		
		// ----------------this part turn datas in the right format for stripe
		
		for(let product of products)
		{
			stripeProducts.push(
				{
					price_data:
					{
						currency: "eur",
						product_data:
						{
							name: product.devis
						},
						unit_amount: Number(product.prixCommande)*100
					},
					quantity: "1"
				});
			
		}
		
		// ---------------call to the stripe api checkout
		
		const session = await stripe.checkout.sessions.create(
		{
			line_items: stripeProducts,
			mode:"payment",
			success_url: `http://nathanhamon.ide.3wa.io:3000/buyCustom/${ids.idClient}/${ids.idCommande}`,
			cancel_url: `http://nathanhamon.ide.3wa.io:3000/profile/${ids.idClient}`,
		});
			
		
		res.redirect(303, session.url);
			
	
		
	});
	
	
};


// ----------------------------------------------------

export const customPay = (req,res) =>
{
	const idClient = xss(req.params.id1);
	
	const idCommande = xss(req.params.id2);
	
	const statut = "paye";
	
	const query1 = `update Commande set Commande.statut = ?, dateClotureCommande = NOW() where Commande.Id = ? and Commande.statut = "cree"`;
	
	const query2 = `select Commande.* from Commande where Commande.idUser = ? and Commande.id= ? and Commande.statut = ?`;
	
	pool.query(query1, [statut, idCommande], function(error, result, fields)
	{
		if(error) console.log(error);
		
		pool.query(query2, [idClient, idCommande, statut], function(error, commandePaye, fields)
		{
			if(error) console.log(error);
			
			const newBill = `/facture${commandePaye[0].id}.pdf`;
			
			let lineBreak = 500;
			
			// ---------------------------creat a bill's pdf;
			const doc = new PDFDocument();
						
			doc.pipe(fs.createWriteStream(`./public/assets/bills${newBill}`));
			
			doc
			.fontSize(15)
			.text(`${commandePaye[0].dateClotureCommande.toLocaleString("fr-FR")}`, 100, 80);
			
			doc
			.fontSize(40)
			.text(`Votre facture :`, 100, 100);
			
			doc
			.image("./public/assets/image/CDP_logo.png", 400, 50, {scale: 0.10});
			
			// ---------------------------seller
			
			doc
			.fontSize(25)
			.text("Vendeur :", 100, 250);
			
			doc
			.fontSize(15)
			.text("Cuisse de Poupou",250 , 280);
			doc
			.fontSize(15)
			.text("Adress du vendeur", 250, 300);
			doc
			.fontSize(15)
			.text("44000 Nantes", 250, 320);
			
			// ---------------------------customer
			
			doc
			.fontSize(25)
			.text("Client :", 100, 350);
			
			doc
			.fontSize(15)
			.text(`${req.session.user.pseudo}`, 250, 380);
			doc
			.fontSize(15)
			.text(`${req.session.user.adress}`, 250, 400);
			doc;
			
			
			commandePaye.forEach((item)=>
			{
				doc
				.fontSize(10)
				.text(`${item.devis}`, 100, lineBreak);
				
				doc
				.fontSize(10)
				.text(`${item.prixCommande} €`, 400, lineBreak);
				
				lineBreak += 25;
				
			});
			
			doc
			.fontSize(25)
			.text(`Total : ${commandePaye[0].prixCommande} €`, 250, lineBreak+50);
						
						  
			doc.end();
			
			const query3 = `update Commande set Commande.factureCommande = ? where Commande.IdUser = ? and Commande.id = ?`;
			
			const newArchive =
						{
							id: uuidv4(),
							category: "comande",
							facture: newBill
						};
						
			const query4 = `insert into Archive (id, date, category, facture) values (?, NOW(), ?, ?)`;
			
			pool.query(query3, [newBill, idClient, commandePaye[0].id], function (error, result2, fields)
			{
				if(error) console.log(error);
							
				pool.query(query4, [newArchive.id, newArchive.category, newArchive.facture], function(error, result7, fields)
				{
					error ? console.log(error) : res.redirect(`/profile/${idClient}`);
					
				});
				
			});
			
			
		});
		
		
	});
	
	
};


// ----------------------------------------------------

export const customOrder = (req,res) =>
{
	// ----------------------------------------------------data's sanitation
	req.body.commande = xss(req.body.commande);
	req.params.id = xss(req.params.id);
	
	// ----------------------------------------------------data's validation
	let errorForm = {};
	
	if(!req.body.commande.trim())
    {
        errorForm.commande = "Commande invalide";
    }
    
    if(Object.keys(errorForm).length != 0)
    {
        return res.status(400).send(errorForm);
            
    }
	
	const newOrder =
	{
		id: uuidv4(),
		idClient: req.params.id,
		commande: req.body.commande,
		devis: 0,
		prixCommande: 0,
		statut: "cree",
		factureCommande: "",
		
	};
	
	const query = `insert into Commande (id, idUser, commande, devis, prixCommande, statut, factureCommande, dateCreationCommande, dateClotureCommande) values (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
	
	pool.query(query, [newOrder.id, newOrder.idClient, newOrder.commande, newOrder.devis, newOrder.prixCommande, newOrder.statut, newOrder.factureCommande], function(error, result, feilds)
	{
		error ? console.log(error) : res.status(204).send();
	});
	
};


// ----------------------------------------------------

export const dialogue = (req,res) =>
{
	// ----------------------------------------------------data's sanitation
	req.body.comment = xss(req.body.comment);
	req.body.idTransmitter = xss(req.body.idTransmitter);
	req.params.id = xss(req.params.id)
	
	// ----------------------------------------------------data's validation
	let errorForm = {};
	
	if(!req.body.comment.trim())
    {
        errorForm.comment = "Commentaire invalide";
    }
    
    if(Object.keys(errorForm).length != 0)
    {
        return res.status(400).send(errorForm);
    }
    
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
	req.params.id = xss(req.params.id);
	
	const filePath = `./public/assets/bills/${req.params.id}`;
	
	res.download(filePath);
};




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