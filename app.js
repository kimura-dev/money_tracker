/////////////////////////////////////////////
//// THE MODULE PATTERN

var budgetController = (function(){

  // Creating function constructors
  var Expense = function(id, description, value){
    this.id = id,
    this.description = description,
    this.value = value
  };

  // Income Constructor
  var Income = function(id, description, value){
    this.id = id,
    this.description = description,
    this.value = value
  };

  // var allExpenses = [];
  // var allIncomes = [];
  // var totalExpenses = [];

  // var data = {
  //   allExpenses: [],
  //   allIncomes: []
  // }

  //  Decided on data structure
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

})();

// The UI Module
var UIController = (function(){

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  };

  // This is a public function 
  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMstrings.inputType).value, 
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    // Makes DOM string variables public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };

})();

// GLOBAL APP CONTROLLER
/** Will pass the other two modules as arguments so that it connect to both. */
var controller = (function(budgetCtrl, UICtrl){

  var setupEventListeners = function(){
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (e) {
      // 'which' is the keyCode for some browsers
      if(e.keyCode === 13 || e.which === 13){
          ctrlAddItem();      
      }
    });
  };


  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input = UICtrl.getInput();
    // 2. Add the item to the budget controller

    // 3. Add the item to the the UI

    // 4. Calculate the budget

    // 5.Display the budget to the UI  
  };

  return {
    init: function(){
      console.log('App Started!');
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init(); // Only line of code placed outside of my controllers