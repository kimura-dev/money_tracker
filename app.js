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

  //  Decided on this data structure
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  // Public methods
  return {
    addItem: function(type, des, val){
      var newItem, ID;

      // Create New ID
      // ID is the last item in the array
      // First bracket is the array, second bracket is the index number. So it ends up being the last ID plus 1
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;        
      }

      // Create new item based on 'inc' or 'exp' type
      if(type === 'exp'){
        newItem =  new Expense(ID, des, val);
      } else if(type === 'inc'){
        newItem =  new Income(ID, des, val);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);
      // Return the new item
      return newItem;
    },

    testing: function(){
      console.log(data);
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
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();
    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
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