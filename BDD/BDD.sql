-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db.3wa.io
-- Généré le : mar. 16 août 2022 à 07:29
-- Version du serveur :  5.7.33-0ubuntu0.18.04.1-log
-- Version de PHP : 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `nathanhamon_projet`
--

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `pseudo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `adress` varchar(255) NOT NULL,
  `dateInscription` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mdp` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Panier`
--

CREATE TABLE `Panier` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `idUserPanier` char(36) NOT NULL,
  `prixPanier` decimal(8,2) NOT NULL,
  `dateCreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateCloture` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statut` varchar(255) NOT NULL,
  `facturePanier` varchar(255) NOT NULL,
  Foreign KEY (idUserPanier) REFERENCES User (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



-- --------------------------------------------------------

--
-- Structure de la table `Produit`
--

CREATE TABLE `Produit` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `nom` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `prix` decimal(8,2) NOT NULL,
  `img` varchar(255) NOT NULL,
  `statut` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Commande`
--

CREATE TABLE `Commande` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `idUser` char(36) NOT NULL,
  `commande` varchar(255) NOT NULL,
  `devis` varchar(255) NOT NULL,
  `prixCommande` decimal(8,2) NOT NULL,
  `statut` varchar(255) NOT NULL,
  `factureCommande` varchar(255) NOT NULL,
  `dateCreationCommande` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateClotureCommande` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  Foreign KEY (idUser) REFERENCES User (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Structure de la table `Dialogue`
--

CREATE TABLE `Dialogue` (
  `id` char(36) NOT NULL PRIMARY KEY,
  `idCommande` char(36) NOT NULL,
  `idUser` char(36) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `dateDialogue` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Foreign KEY (idCommande) REFERENCES Commande (id) ON DELETE CASCADE,
  Foreign KEY (idUser) REFERENCES User (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Produit_Panier`
--

CREATE TABLE `Produit_Panier` (
    `idPanier` char(36) NOT NULL,
    `idProduit` char(36) NOT NULL,
  Foreign KEY (idPanier) REFERENCES Panier (id) ON DELETE CASCADE,
  Foreign KEY (idProduit) REFERENCES Produit (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `Archive`
--

CREATE TABLE `Archive` (
    `id` char(36) NOT NULL,
    `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `category` varchar(255) NOT NULL,
    `facture` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
