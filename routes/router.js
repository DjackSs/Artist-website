// ==============================================
// ROUTER SET UP
// ==============================================

import express from "express";

const router = express.Router();


// ==============================================
// CONTROLLERS SET UP
// ==============================================

import {home, art_page1, art_page2, inscriptionPost} from "../controllers/home.js";

import {login, loginPost, profile, logout, shoppingAdd, shoppingDelete, customOrder, deleteCommande, editProfile, deleteProfile, dialogue, cardCheckout, shoppingPay, customCheckout, customPay, downloadBill} from "../controllers/client.js";

import {profileAdmin, addProductPost, deleteProduit, editProduit, deleteClient, closeBuying, closeCustom, devis} from "../controllers/admin.js";






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

router.put("/editProfile/:id", sessiontCheck, editProfile);

router.post("/deleteProfile/:id", sessiontCheck, deleteProfile);

router.post("/dialogue/:id", sessiontCheck, dialogue);


//SHOPPING PAGE

router.post("/addToCard/:id", sessiontCheck, shoppingAdd);

router.delete("/deleteProduitPanier/:id", sessiontCheck, shoppingDelete);

router.post("/order/:id", sessiontCheck, customOrder);

router.delete("/deleteCommande/:id", sessiontCheck, deleteCommande);

router.post("/card-checkout", sessiontCheck, cardCheckout);

router.get("/buy/:id", sessiontCheck, shoppingPay);

router.post("/custom-checkout/:id", sessiontCheck, customCheckout);

router.get("/buyCustom/:id1/:id2", sessiontCheck, customPay);

router.get("/downloadPDF/:id", sessiontCheck, downloadBill);



//ADMIN PAGE

router.get("/admin", adminCheck, profileAdmin);

router.post("/addProductPost", adminCheck, addProductPost);

router.delete("/deleteProduct/:id", adminCheck, deleteProduit);

router.delete("/deleteClient/:id", adminCheck, deleteClient);

router.put("/editProduct/:id", adminCheck, editProduit);

router.put("/closeBuying/:id", adminCheck, closeBuying);

router.put("/closeCustom/:id", adminCheck, closeCustom);

router.post("/devisPost/:id", adminCheck, devis);






export default router;