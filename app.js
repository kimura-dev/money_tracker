/////////////////////////////////////////////
////         THE MODULE PATTERN            //
/////////////////////////////////////////////

/*----------------------------------------- */
//          budgetController                //
/*----------------------------------------- */
const budgetController = (function(){
  // Creating function constructors
  const Expense = function(id, description, value){
    this.id = id,
    this.description = description,
    this.value = value,
    this.percentage = -1
  };

  Expense.prototype.calculatePercentages = function(totalInc){
    if(totalInc > 0){
      this.percentage = Math.round((this.value / totalInc) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
  };

  // Income Constructor
  const Income = function(id, description, value){
    this.id = id,
    this.description = description,
    this.value = value
  };

  const calculateTotal = function(type){
    var sum = 0;

    data.allItems[type].forEach(function(currentElement) {
      sum += currentElement.value;
    });

    data.totals[type] = sum;
  };

  // Data Structure
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    // set it to -1 so it doesnt exist inititally
    percentage: -1
  };

  // Public methods
  return {
    addItem: function(type, des, val){
      let newItem, ID;
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

    deleteItem: function(type, id){
      let ids, index;
      // map returns a brand new array with all the ids in either the income or expenses array in 'data'. Here we are selected the one item that matches our ID.
      ids = data.allItems[type].map(function(item){
        return item.id;
      });

      // this will say ok out of the new array we just created give us the one that matches the index.
      index = ids.indexOf(id);

      //  Delete from array - splice() used to remove elements. First arg is position where we start deleting. Second arg is the num we want to delete.
      if(index !== -1){
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function(){
      // calculate total income and expense
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate the budget  income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      } else {
        // when no percentages to calculate we assign -1
        data.percentage = -1
      }
    },

    calculatePercentages: function(){
      /*
        a=20
        b=10
        c=40
        income=100
        a=20/100=20%
        b=10/100=10%
        c=40/100=40%
      */

      // Calculates the percentage for each item in the expenses array
      data.allItems.exp.forEach(function(item){
        item.calculatePercentages(data.totals.inc);
      });
    },

    getPercentages: function(){
      let allPercentages = data.allItems.exp.map(function(item){
        return item.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function(){
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function(){
      console.log(data);
    }
  }

})();

/*----------------------------------------- */
//          UIController                    //
/*----------------------------------------- */
const UIController = (function(){

  const DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercentageLabel: '.item__percentage',
      dateLabel: '.budget__title--month'
  };

  const formatNumber = function(num, type){
    let numSplit, int, dec;
      /*
        + or - before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
      */

    num = Math.abs(num);
     // method of the number prototype - this will always put a decimal point after the first two numbers that we supply to the method. toFixed also converts num into a string.
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      // This will seperate the string into the two parts, the before and after decimal parts. Now the string is an array.
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return `${type === 'exp' ? sign = '-' : '+'} ${int} . ${dec}`;
  };

  const nodeListForEach = function(nodeList, callback){
    for (let i = 0; i < nodeList.length; i++){
      callback(nodeList[i], i);
    }
  };

  // This is a public function 
  return {
    getInput: function(){
      return {
        type: document.querySelector(DOMstrings.inputType).value, 
        description: document.querySelector(DOMstrings.inputDescription).value,
        // parseFloat converts a string into a number with decimals
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      let html, newHtml, element;
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
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID){
      let el;
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function(){
      let fields, fieldsArray;

      // querySelectorAll gives data back in the a list not an array, so I am going to convert it into an array. Slice will return a copy of an array.
      fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach((field, index, array) => {
        field.value = "";
      });

      // highlights the dsecription box after clearing the fields
      fieldsArray[0].focus();

    },

    displayBudget: function(obj) {
      let type;

      obj.budget > 0 ? type = 'inc' : type = 'exp';

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      
      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percentages){
      // This creates a nodeList - which means it does not have acces to array methods.
      let fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

      nodeListForEach(fields, function(item, index){
        // some code
        if(percentages[index] > 0){
          item.textContent = percentages[index] + '%';
        } else {
          item.textContent = '---';
        }

      });
    },

    displayDate: function(){
      let now, month, year;
        now = new Date();
        months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber'];
        month = now.getMonth();
        year = now.getFullYear();
        document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;
    },

    changedType: function(){
      // This returns another nodeList
      let fields = document.querySelectorAll(
        `${DOMstrings.inputType}, ${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`
      );
      nodeListForEach(fields, function(item){
        item.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

    },

    // Makes DOM string variables public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };

})();

/*----------------------------------------- */
//         GLOBAL APP CONTROLLER            // 
/*----------------------------------------- */
/** Will pass the other two modules as arguments so that it connect to both. */
const controller = (function(budgetCtrl, UICtrl){

  const setupEventListeners = function(){
    let DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (e) {
      // 'which' is the keyCode for some browsers
      if(e.keyCode === 13 || e.which === 13){
          ctrlAddItem();      
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  };

  const updateBudget = function(){
     // 1. Calculate the budget
    budgetCtrl.calculateBudget();
     //  2 return the budget
    var budget = budgetCtrl.getBudget();
    // 3.Display the budget to the UI  
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function(){
    // 1. Calculate the percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budgetController
    let percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  // Control center of the application
  const ctrlAddItem = function () {
    let input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();
      // 6. Calculate and update the percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function(e){
    let itemID, splitID, type, ID;

    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    

    if(itemID){
      // inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      // this is still a string so I must convert it to a integer using paresInt
      ID = parseInt(splitID[1]);
      // 1. delete item from data structure
      budgetCtrl.deleteItem(type, ID);
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Calculate and update the percentages
      updatePercentages();
    }
  };

  return {
    init: function(){
      console.log('Application started successfully!');
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };

})(budgetController, UIController);

controller.init(); // Only line of code placed outside of my controllers