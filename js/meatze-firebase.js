// // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyBlcx8yw7hihZ4iEWupw9we6ZsWvkt5Vro",
//   authDomain: "meatze.firebaseapp.com",
//   databaseURL: "https://meatze.firebaseio.com",
//   projectId: "meatze",
//   storageBucket: "meatze.appspot.com",
//   messagingSenderId: "1002638510838",
//   appId: "1:1002638510838:web:0118ef204af0e7d6d37ad7"
// };

// const collection_name = "config"

// // Initialize Firebase with a "default" Firebase project
// const defaultProject = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// const SERVER_TYPE_LIST_DEFAULT = {
//   M20s: { price: 900, hashing: 68, consumption: 3.3 },
//   M30sPlus: { price: 2760, hashing: 100, consumption: 3.4 },
//   M31s: { price: 1320, hashing: 76, consumption: 3.2 },
//   S17: { price: 2000, hashing: 70, consumption: 2.8 },
//   T17: { price: 960, hashing: 58, consumption: 2.9 },
//   S9: { price: 53.5, hashing: 10, consumption: 0.72 },
//   S19: { price: 2160, hashing: 95, consumption: 3.3 },
// }
// const SCENARIO_LIST_DEFAULT = {
//   pessimistic  : { market_price_usd_delta: 3,  hash_rate_delta: 6 },
//   conservative : { market_price_usd_delta: 5,  hash_rate_delta: 5 },
//   slightly     : { market_price_usd_delta: 8,  hash_rate_delta: 5 },
//   optimistic    : { market_price_usd_delta: 15, hash_rate_delta: 10 }
// }
// //let SERVER_TYPE_LIST = Object.assign({}, SERVER_TYPE_LIST_DEFAULT)

// class MeatzeFirebase {
//   constructor(collection_server_type_name, collection_scenario_name) {
//     this.collection_server_type_name = collection_server_type_name;
//     this.collection_scenario_name = collection_scenario_name;

//     this.email = ''
//     this.password = ''
//     this.server_type_list = {};
//     this.scenario_list = {};
//   }

//   authenticate(email, password){
//     this.email = email;
//     this.password = password;
//     return new Promise( (resolve, reject) => {
//         firebase.auth().signInWithEmailAndPassword(this.email, this.password)
//         .then( () => {
//             console.log("Firebase authentication ok")
//             return resolve()
//         })
//         .catch(function(error) {
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             console.log("Firebase authentication failed")
//             return reject(errorMessage)
//         });
//     })
//   }
  
//   async reset(){
//     // SERVER TYPE LIST
//     for (const item in SERVER_TYPE_LIST_DEFAULT) {
//         console.log("Reset ServerType Configuration -> ", this.collection_server_type_name, item)
//         // Delete document
//         await db.collection(this.collection_server_type_name).doc(item).delete()
//         // Add new default document
//         await db.collection(this.collection_server_type_name).doc(item).set(SERVER_TYPE_LIST_DEFAULT[item])
//     }

//     // SCENARIO LIST
//     for (const item in SCENARIO_LIST_DEFAULT) {
//       console.log("Reset Scenario Configuration -> ", this.collection_scenario_name, item)
//       // Delete document
//       await db.collection(this.collection_scenario_name).doc(item).delete()
//       // Add new default document
//       await db.collection(this.collection_scenario_name).doc(item).set(SCENARIO_LIST_DEFAULT[item])
//     } 

//     return SERVER_TYPE_LIST_DEFAULT
//   }

//   async set(server_type_list, scenario_list) {
//     try{
//       this.server_type_list = server_type_list;
//       for (const item in server_type_list) {
//           //console.log("Setting Configuration -> ", collection_name, item, SERVER_TYPE_LIST[item])                
//           await db.collection(this.collection_server_type_name).doc(item).set(server_type_list[item])
//           console.log("Set server_type", item," ok")

//       }
  
//       this.scenario_list = scenario_list;
//       for (const item in scenario_list) {
//         //console.log("Setting Configuration -> ", collection_name, item, SERVER_TYPE_LIST[item])                
//         await db.collection(this.collection_scenario_name).doc(item).set(scenario_list[item])
//         console.log("Set scenario ", item, " ok")
//       }
//     }catch(error){
//       console.error("Set document failed ", error);

//     }
//   }

//   async get_single(collection_name) {
//       try{
        
//         const result = {}
//         // Get Server type
//         let querySnapshot = await db.collection( collection_name )
//                                 .orderBy(firebase.firestore.FieldPath.documentId()).get()
//         querySnapshot.forEach((doc) => {
//           // doc.data() is never undefined for query doc snapshots
//           result[doc.id] = doc.data()
//         });

//         return result
//       }catch(error){
//         console.log("server_type_list ", this.server_type_list, this.scenario_list)
//         return reject({error: 'Failed to load data', message: error})        
//       }

//   }

//   async get() {
//       try{
//         this.server_type_list = await this.get_single(this.collection_server_type_name)
//         this.scenario_list = await this.get_single(this.collection_scenario_name)
//         return {server: this.server_type_list, scenario: this.scenario_list}
//       }catch(error){
//         console.log("server_type_list ", this.server_type_list, this.scenario_list)
//         return {error: 'Failed to load data', message: error}
//       }

   
//   }

//   set(server_type_list, scenario_list){
//     this.server_type_list = server_type_list
//     this.scenario_list = scenario_list
//   }

// }

