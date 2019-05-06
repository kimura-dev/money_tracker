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

  // Data Structure
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
      // First bracket is the array, second bracket is the index number. So it ends up being the last ID plus 1. If its the first item we assign it 0.
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
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
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

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      
      if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          
          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;
          
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function(){
      var fields, fieldsArray;

      // querySelectorAll gives data back in the a list not an array, so I am going to convert it into an array. Slice will return a copy of an array.
      fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach((field, index, array) => {
        field.value = "";
      });

      // highlights the dsecription box after clearing the fields
      fieldsArray[0].focus();

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


  // Control center of the application
  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();
    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the item to the the UI
    UICtrl.addListItem(newItem, input.type);
    // 4. Clear the fields
    UICtrl.clearFields();
    // 5. Calculate the budget

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