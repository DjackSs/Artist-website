// ==============================================
// ROUTER SET UP
// ==============================================

import express from "express";

const router = express.Router();


// ==============================================
// CONTROLLERS SET UP
// ==============================================

import {home, art_page1, art_page2, inscriptionPost} from "../controllers/home.js";

import {login, loginPost, profile, logout, shoppingAdd, shoppingDelete, customOrder, clientDialogue, deleteCommande, editProfile, deleteProfile, dialogue, shoppingPay} from "../controllers/client.js";

import {profileAdmin, addProductPost, deleteProduit, editProduit, deleteClient, closeBuying, devis} from "../controllers/admin.js";






// -----------------------routes protection's middleware

const adminCheck = function (req, res, next) {
    
    if(req.session.user)
    {
        if(req.session.user.role === "admin") 
        {
            next();
        } 
        
    }
    else
    {
        res.redirect('/login');
    }
    
   
};

const sessiontCheck = function (req, res, next) {

    if(req.session.user) 
    {
        next();
    } 
    else 
    {
        res.redirect('/login');
    }
};



// ==============================================
// ROUTES
// ==============================================

//HOME PAGE

router.get("/", home);

router.get("/scrapbooking", art_page1);

router.get("/art_numerique", art_page2);


//SIGN IN PAGE / LOGIN PAGE

router.get("/login", login);

router.post("/login/post", loginPost);

router.post("/sign_in/post", inscriptionPost);


//PROFILE PAGE

router.get("/profile/:id", sessiontCheck, profile);

router.post("/logout", logout);

router.post("/clientDialogue/:id", sessiontCheck, clientDialogue);

router.put("/editProfile/:id", sessiontCheck, editProfile);

router.post("/deleteProfile/:id", sessiontCheck, deleteProfile);

router.post("/dialogue/:id", sessiontCheck, dialogue);


//SHOPPING PAGE

router.post("/addToCard/:id", sessiontCheck, shoppingAdd);

router.delete("/deleteProduitPanier/:id", sessiontCheck, shoppingDelete);

router.post("/order/:id", sessiontCheck, customOrder);

router.delete("/deleteCommande/:id", sessiontCheck, deleteCommande);

router.post("/buy/:id", sessiontCheck, shoppingPay);




//ADMIN PAGE

router.get("/admin", adminCheck, profileAdmin);

router.post("/addProductPost", adminCheck, addProductPost);

router.delete("/deleteProduct/:id", adminCheck, deleteProduit);

router.delete("/deleteClient/:id", adminCheck, deleteClient);

router.put("/editProduct/:id", adminCheck, editProduit);

router.put("/closeBuying/:id", adminCheck, closeBuying);

router.post("/devisPost/:id", adminCheck, devis);






export default router;