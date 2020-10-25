# masterClassBigData

 - Création de la bdd : **use masterclass_project**

 - Création de l’user Joe : **db.createUser({ user: "joe", pwd: "doe", roles: ["readWrite"] })**

 - Vérifier que Joe est bien créé : **show users**

 - On crée la collection : **mongoimport --db masterclass_project  --collection restaurants --drop --file ~/path/to/restaurants.json**

- On vérifie qu’elle existe : **show collections**

 - On vérifie le nombre de restaurants insérés dans notre base : **db.restaurants.count()**
  
    - *Pour les afficher de manière plus propre : **db.restaurants.find().pretty()***

- On ajoute un champ number en 2 et 100 pour tous les restaurants : **db.restaurants.find().forEach(function(doc){ db.restaurants.update({_id:doc._id}, {$set:{"price":Math.floor(Math.random() * 99) + 2}}) })**

- On ajoute pour chaque restaurant un tableau de 5 notes entre 0 et 5 : **db.restaurants.find().forEach(function(doc){ db.restaurants.update({_id:doc._id}, {$set:{"reviews": Array.from({length: 5}, () => Math.floor(Math.random() * 6)) }}) })**

L'ensemble des requêtes demandées se trouve dans le fichier ***db.js***.

La configuration du replica set se trouve dans le ***replica-set.conf***.