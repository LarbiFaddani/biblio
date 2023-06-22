const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 3131;
//const URL = process.env.MONGODB_URL;
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

const empruntSchema = new mongoose.Schema({
    livres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livre'
    }],
    email: {
        type: String,
        required: true
    },
    dateEmprunt: {
        type: Date,
        required: true
    },
    dateRetours: [{
        livre: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Livre'
        },
        dateRetour: {
            type: Date,
            required: true
        }
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
});
    
const Emprunt = mongoose.model('emprunts', empruntSchema);


app.post('/emprunt', (req, res) => {
    const { livres, email, dateEmprunt } = req.body;
    const newEmprunt = new Emprunt({
        livres,
        email,
        dateEmprunt
    });
    newEmprunt.save()
        .then(emprunt => {
        res.status(200).json(emprunt);
        })
    .catch(error => {
        res.status(500).json({ error: "Erreur lors de l\'emprunt du livre" });
    });
    });


app.put('/emprunt',async (req,res)=>{
        var emprunt = await Emprunt.findOne({_id:req.body.id_emprunt})
        var  list=[]
        emprunt.livres.forEach(element => {
            if (element!=req.body.id_livre) {
                list.push(element)
            }
        });
        if (emprunt.livres === list) {
            res.json("livre n'existe pas dans cette emprunt")
        }
        emprunt.livres=list
        emprunt.save()
        res.json("livre retourné")
    
    })
    
app.get('/emprunt/:email',async (req,res)=>{
    var emprunts= await Emprunt.find({email:req.params.email})
    if (emprunts.length==0){

        res.json("email not found")
    }else{
        res.json(emprunts)
    }
})
    ///  abonner   ,  user  , get  emprunt 
app.listen(PORT, ()=>{
    console.log("Port de emprunts :  " ,PORT)
});
