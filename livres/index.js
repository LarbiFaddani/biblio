const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 3232;
const URL = process.env.MONGODB_URL;
const mongoose = require("mongoose");
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect(
    "mongodb://localhost:27017/bibliotheque",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log('Connexion à la base de données réussie');
}).catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
});

const LivreSchema = mongoose.Schema({
    nom: String,
    description: String,
    nbpage: Number,
    auteur: String,
    editeur: String,
    created_at: {
      type: Date,
      default: Date.now(),
    },
  });
const   Livre =mongoose.model("livres", LivreSchema);

//get livre from  by  
app.get('/livre/:idLivre', (req, res) => {
    const idLivre = req.params.idLivre;
    
    Livre.findById(idLivre)
      .then((livre) => {
        if (livre) {
          res.status(200).json(livre);
        } else {
          res.status(404).json({ message: 'Livre non trouvé' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Erreur lors de la recherche du livre' });
      });
  });
// ajouter livre 

app.post('/livre', (req, res) => {
    const { nom, description, nbpage, auteur, editeur } = req.body;
    const nouveauLivre = new Livre({ nom, description, nbpage, auteur, editeur });
    nouveauLivre.save().then((livre) => {
        res.status(200).json(livre);
}).catch((error) => {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du livre' });
});
});


app.put('/livre/:idLivre', (req, res) => {
    const idLivre = req.params.idLivre;
    const { nom, description, nbpage, auteur, editeur } = req.body;
    Livre.findByIdAndUpdate(idLivre, { nom, description, nbpage, auteur, editeur }, { new: true })
      .then((livre) => {
        if (livre) {
          res.status(200).json(livre);
        } else {
          res.status(404).json({ message: 'Livre non trouvé' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Erreur lors de la modification du livre' });
      });
  });
  


app.delete('/livre/:idLivre', (req, res) => {
    const idLivre = req.params.idLivre;
Livre.findByIdAndRemove(idLivre)
        .then((livre) => {
            if (livre) {
            res.status(200).json({ message: 'Livre supprimé avec succès' });
            } else {
            res.status(404).json({ message: 'Livre non trouvé' });
            }
    })
    .catch((error) => {
        res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
    });
  });
app.listen(PORT, ()=>{
    console.log("Port de livres :  " ,PORT)
})