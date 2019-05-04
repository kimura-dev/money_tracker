// THE MODULE PATTERN

/*This is an immediate invoked func expression that returns an object. An IFFE allows use to have data privacy because it creates a new scope that is not visible from the outside scope. The module pattern return an obj containing all of the func that we want to be public. */
var budgetController = (function(){
 
})();

/* Seperation of concerns each part of the app should work independently not knowing the others exist. */
var UIController = (function(){

  // Show Code

})();

/** Will pass the other two modules as arguments so that it connect to both. */
var controller = (function(budgetCtrl, UICtrl){

  var ctrlAddItem = function () {

    // 1. Get the field input data

    // 2. Add the item to the budget controller

    // 3. Add the item to the the UI

    // 4. Calculate the budget

    // 5.Display the budget to the UI
    console.log('enter was pressed');
  
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  // on the windows object and will give it event object
  document.addEventListener('keypress', function (e) {
    // console.log(e);

    // which is the keyCode for some browsers
    if(e.keyCode === 13 || e.which === 13){
        ctrlAddItem();      
    }
  });

})(budgetController, UIController);

