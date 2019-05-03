// THE MODULE PATTERN

/*This is an immediate invoked func expression that returns an object. An IFFE allows use to have data privacy because it creates a new scope that is not visible from the outside scope. The module pattern return an obj containing all of the func that we want to be public. */
var budgetController = (function(){
  var x = 23;

  var add = function(a){
    return x + a;
  }

  return {
    publicTest: function(b){
      return add(b);
    }
  }
})();

/* Seperation of concerns each part of the app should work independently not knowing the others exist. */
var UIController = (function(){

  // Show Code

})();

/** Will pass the other two modules as arguments so that it connect to both. */
var controller = (function(budgetCtrl, UICtrl){

  // Show Code
  var z = budgetCtrl.publicTest(5);

  return {
    anotherPublicFunc: function(){
      console.log(z);
    }
  }

})(budgetController, UIController);

