const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 3030;
const URL = process.env.MONGODB_URL;
const mongoose = require("mongoose");

app.use(express.json());
const abonneSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});
const Abonne = mongoose.model('Abonne', abonneSchema);

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



app.get('/abonne' ,(req,res)=>{
    res.json({message :"good"})
})


// Retourner les informations d'un abonné connaissant son email
app.get('/user/:email', (req, res) => {
        const email = req.params.email;
    
        Abonne.findOne({ email })
        .then((abonne) => {
            if (abonne) {
            res.status(200).json(abonne);
            } else {
            res.status(404).json({ message: 'Abonné non trouvé' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erreur lors de la recherche de l\'abonné' });
        });
});


  // Ajouter un nouveau abonné
app.post('/user/register', (req, res) => {
    const { nom, email, password } = req.body;
  
    const newAbonne = new Abonne({
      nom,
      email,
      password
    });
  
    newAbonne.save()
      .then((abonne) => {
        res.status(200).json(abonne);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'abonné' });
      });
  });





  // Modifier un abonné
app.put('/user/:email', (req, res) => {
    const email = req.params.email;
    const { nom, password } = req.body;
  
    Abonne.findOneAndUpdate({ email }, { nom, password }, { new: true })
        .then((abonne) => {
            if (abonne) {
            res.status(200).json(abonne);
            } else {
            res.status(404).json({ message: 'Abonné non trouvé' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erreur lors de la modification de l\'abonné' });
        });
});



// Supprimer un abonné
app.delete('/user/:email', (req, res) => {
    const email = req.params.email;
        Abonne.findOneAndDelete({ email })
        .then((abonne) => {
            if (abonne) {
            res.status(200).json({ message: 'Abonné supprimé avec succès' });
            } else {
            res.status(404).json({ message: 'Abonné non trouvé' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'abonné' });
        });
});


// Se loger
app.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    

    Abonne.findOne({ email, password })
    .then((abonne) => {
        if (abonne) {
            res.status(200).json({ message: 'Authentification réussie' });
        } else {
            res.status(404).json({ error: 'Abonné non trouvé' });
        }})
}) ;


app.listen(PORT, ()=>{
    console.log("Port de abonne :  " ,PORT)
})