// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBlcx8yw7hihZ4iEWupw9we6ZsWvkt5Vro",
  authDomain: "meatze.firebaseapp.com",
  databaseURL: "https://meatze.firebaseio.com",
  projectId: "meatze",
  storageBucket: "meatze.appspot.com",
  messagingSenderId: "1002638510838",
  appId: "1:1002638510838:web:0118ef204af0e7d6d37ad7"
};

const collection_name = "config"

// Initialize Firebase with a "default" Firebase project
const defaultProject = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const SERVER_TYPE_LIST_DEFAULT = {
  M20s: { price: 900, hashing: 68, consumption: 3.3 },
  M30sPlus: { price: 2760, hashing: 100, consumption: 3.4 },
  M31s: { price: 1320, hashing: 76, consumption: 3.2 },
  S17: { price: 2000, hashing: 70, consumption: 2.8 },
  T17: { price: 960, hashing: 58, consumption: 2.9 },
  S9: { price: 53.5, hashing: 10, consumption: 0.72 },
  S19: { price: 2160, hashing: 95, consumption: 3.3 },
}
//let SERVER_TYPE_LIST = Object.assign({}, SERVER_TYPE_LIST_DEFAULT)

class MeatzeFirebase {
  constructor(collection_name) {
    this.collection_name = collection_name;

    this.email = 'sergi@meatze.com'
    this.password = 'meatze'
    this.server_type_list = {};
  }

  authenticate(){
    return new Promise( (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then( () => {
            console.log("Firebase authentication ok")
            return resolve()
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Firebase authentication failed")
            return reject(errorMessage)
        });
    })
  }
  
  async reset(){
    for (const item in SERVER_TYPE_LIST_DEFAULT) {
        console.log("Reset Configuration -> ", collection_name, item)
  
        // Delete document
        await db.collection(collection_name).doc(item).delete()
        // Add new default document
        await db.collection(collection_name).doc(item).set(SERVER_TYPE_LIST_DEFAULT[item])
    }
    return SERVER_TYPE_LIST_DEFAULT
  }

  set(server_type_list) {
    this.server_type_list = server_type_list;
    for (const item in server_type_list) {
        //console.log("Setting Configuration -> ", collection_name, item, SERVER_TYPE_LIST[item])                
        db.collection(collection_name).doc(item).set(server_type_list[item])
            .then(function (docRef) {
                console.log("Set document ok")
            })
            .catch(function (error) {
                console.error("Set document failed ", error);
            });
    }
  }


  async get() {
    return new Promise( (resolve, reject) => {
      db.collection( collection_name )
        .orderBy(firebase.firestore.FieldPath.documentId()).get()
        .then( (querySnapshot) => {

          // Set results                
          querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              this.server_type_list[doc.id] = doc.data()
          });
          return resolve(this.server_type_list)

        })
        .catch( (error) => {
          console.log("server_type_list ", this.server_type_list)
          return reject({error: 'Failed to load data', message: error})
        })
    })
  }

}
