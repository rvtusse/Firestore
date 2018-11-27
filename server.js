

'use strict';
 
// [START imports]
var admin = require("firebase-admin");

 
// [START initialize]
// Initialize the app with a service account, granting admin privileges
var serviceAccount = require("./key.json");
 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fbase-fbase.firebaseio.com"
});
// [END initialize]
 
// Get a database reference to the TODO list database
var db = admin.database();
var ref = db.ref("/");
 

// [START API 1]
function addTodoItem(userId, name, deadline) {
 
  // Add a new todo item
  var itemsRef = ref.child("items");
  var newItemRef = itemsRef.push();
  newItemRef.set({
    "User ID": userId,
    "TODO Name": name,
    "TODO Deadline": deadline,
    "TODO Created Time": new Date().toString()
  });
 
  var itemId = newItemRef.key;
  console.log("A new TODO item with ID " + itemId + " is created.");  
  return itemId;
}

// [START API 2]
function readToDoItem(todoId) {
 
  var itemRef = ref.child("items/" + todoId);
  itemRef.on("value", function(snapshot) {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("Cannot read a TODO item with TODO ID %s that does not exist.", todoId);
      return null;
    }
  }, function (errorObject) {
    console.log("readToDoItem failed: " + errorObject.code);
  });
 
}





// [START API 3]
function changeTodoDeadline(todoId, deadline) {
 
  var itemRef = ref.child("items/" + todoId);
  itemRef.update({
    "TODO Deadline": deadline
  });
  console.log("TODO deadline for item " + todoId + " is updated to " + deadline);
 
  itemRef.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("changeTodoDeadline failed: " + errorObject.code);
  });
 
}

 
 
// [START API 4]
function deleteTodoItem(todoId) {
 
var itemRef = ref.child("items/" + todoId);
 
  itemRef.once("value")
  .then(function(snapshot) {
    // return Success if itemRef contains any data. Else return Error
    if (snapshot.exists()) {
      console.log("TODO item %s removed successfully.", todoId);
      return "Success";
    } else {
      console.log("TODO item %s does not exist. Cannot be removed.", todoId);
      return "Error";
    }
  })
  .catch(function(error) {
    console.log("deleteTodoItem failed: " +  error.code);
  });
 
}
 


// [START API 5]
function listAllTodoItems(userId) {
 
  var itemRef = ref.child("items");
  itemRef.orderByChild("User ID").equalTo(userId).on("child_added", function(snapshot) {
    console.log(snapshot.val());
    return snapshot.val();
  });
 
}
