//To be changed in poduction
var aPITOUSE = 'http://localhost:5000/';

///The todo counter
var uncompletedTodoCounter = 0;
///////////
/////User Name Acquition
///////////

//Stores the variable of whomever is currently making a todo list--keeps accesible
var currentUser = [];

//Function that adds the user input form and transfers to the api
var UserList = React.createClass({
  //Initializes the intial app state
  getInitialState: function() {
    return {
      users: []
    };
  },
  //Adds a new user to the user array
  addUser: function(e) {
    //initializes the item array and connects with state's items property
    var userArray = this.state.users;

    //pushes the input to the array
    userArray.push(
      {
      //users name
      name: this._inputElement.value,
      key: Date.now()
      }
    );
    //Adds th current user to th global array
    currentUser.push(userArray[0].name);
    //If the user array is populated then the new user info is hidden while the input is shown
    if (userArray.length > 0) {
        var user_name = userArray[0].name;

        //Hides the add_user input display after the user name is selected
        d3.select("form#newUser")
          .style("visibility", "hidden");

        //Shows the new Todo selector
        d3.select("div#todoListInput")
          .style("visibility", "unset");

        //Passes the Username to the API and relaunches the list
        getAPIData(user_name);
    }
    //sets the state objects, items proprty to itemArray
    this.setState({
      users: userArray
    });
    //prevents duplication
    e.preventDefault();
  },
  render: function() {
    //Renders the user name input field
    return (
      <div className="userListMain">
        <div className="header">
          <form id="newUser" onSubmit={this.addUser}>
            <input ref={ (a) => this._inputElement = a}
                placeholder="Who are you?">
            </input>
            <button type="submit">Add User!</button>
          </form>
        </div>
        <UserName entries={this.state.users}/>
      </div>
    );
  }
});

//Lists the user and prologues the todo listing
var UserName = React.createClass({
  render: function() {
    //EAch New todo
    var userEntries = this.props.entries;
    //Th styling element for the user prologue
    var PStyle = {
      fontSize: "35px",
      verticalAlign: "baseline",
      color: "#ffffff"
    }

    //Prologues the list and names the user
    function createUsers(user) {
      return <p style={PStyle} key={user.key}>{user.name}, Today you have to do:</p>
    }
    //Styles the user name and returns for React render
    var listUser = userEntries.map(createUsers)[0];

    return (
    <div>
      {listUser}
    </div>
    );
  }
});
//Sends the username to the userList element
var userDestination = document.querySelector("#userList");
//Th rendering element
ReactDOM.render(
  <div>
    <UserList/>
  </div>,
  userDestination
);

/////////////////////////////////////////////
/////End User name acquistion and display
////////////////////////////////////////////

/////////////////////////////////////////////
/////Form input and Display
////////////////////////////////////////////

//The main function that initializes new todos
class TodoList extends React.Component {
  //Initializes the initial state array, change and submission events
  constructor(props) {
    super(props);
    this.state = {value: ''};

    //binds the change and submission
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //On change assigns the new todo to the main todo array
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  //On submission launches the new todo function
  handleSubmit(event) {
    event.preventDefault();
    //sends the new todo to the api
    addNewTodo(this.state.value);
  }

  render() {
    return (
    <div className="header">
      <form id="newTodo" type="text" onSubmit={this.handleSubmit}>
        <label>
          Add a New Todo!:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Add Todo!" />
      </form>
    </div>
    );
  }
}

ReactDOM.render(
  <TodoList />,
  document.getElementById('todoListInput')
);

//Initializes a React/jsx list determined by bool value of todo item
function createTasks(item) {
  //React requires unique keys-since I'm not storing timestamps and date.now() is too broad for this function
  //Im using random numbers to generate the key
  var keyGen = Number(Math.random() * Math.random() / Math.random());
  if (item[1] == 'false') {
    //Counts the number of remaining todos
    uncompletedTodoCounter++;
    //Uncompleted todos call unCheckedStyles and trigger handlecheck function api-bool-todo
    return <li key={keyGen} style={unCheckedStyles}>{item[0]} <input type="checkbox" unchecked value={item} onChange={handleCheck}/></li>
  }
  else {
    //Completed todos call unCheckedStyles and trigger handlecheck function api-bool-todo
    return <li key={keyGen} style={checkedStyles}>{item[0]} <input type="checkbox" checked value={item} onChange={handleCheck}/></li>
  }
}

//Ract Styling for the uncompleted todo items
var unCheckedStyles = {
      color: "#ffffff",
      borderBottom: "1px solid white"
}

//React Styling for the completed todo items
var checkedStyles = {
  textDecoration: "line-through",
  color: "grey",
  borderBottom: "1px solid white"
}
/////////////////////////////////////////////
/////End Form input and Display
////////////////////////////////////////////


////////////////////////////////////////////
/////API calls and data handling
////////////////////////////////////////////

//Runs on a check box event, cahnges boolean value of todo
function handleCheck(event) {
  //Splits event into value and boolean
  var checkedItemArray = event.target.value.split(',');
  //determines boolean state and initializs accordingly
  if (checkedItemArray[1] == 'false') {
      //changes false/uncompleted to completed
      $.ajax({
          type: 'post',
          url: 'http://localhost:5000/api/check/'+ currentUser[0] + '/' + checkedItemArray[0] + '?completed=' + checkedItemArray[1]
      });
        //Reinitializes the list draw
        getAPIData(currentUser[0]);
    }
    else {
      //Changes completed item to an uncompleted item
      $.ajax({
          type: 'post',
          url: 'http://localhost:5000/api/check/'+ currentUser[0] + '/' + checkedItemArray[0] + '?completed=' + checkedItemArray[1]
      });
        //Reinitializes the list draw
        getAPIData(currentUser[0]);
    }
}

//Api to handle new post event
function addNewTodo(newTodo) {

  //Posts new todo to DB
  $.ajax({
      type: 'post',
      url: 'http://localhost:5000/api/post/'+ currentUser[0] + '?post_data=' + newTodo
  });
  //Redraws list after post addition
  getAPIData(currentUser[0]);
}

//Gets the todo data per user from the api
function getAPIData(user_name) {
  uncompletedTodoCounter = 0;
  //Use an API call from my Flask view to access DB of all todos
  d3.json(aPITOUSE + 'api/get?user_name=' + user_name, function(error, incomingData) {
    if (error) {
      return console.warn(error);
    }
    else {
      //Sorts the todos and colors them according to completed or not
      var listItems = incomingData.map(createTasks).sort();
      //Initializes the number of todos remaining
      var totalTodoNum = incomingData.length;

      //Launches th React rendering of todos left
      RemainingTodosDisplay(user_name);

      //If there is incoming data it renders the todo list
      if (incomingData.length > 0) {
        ReactDOM.render(
          <div>
            <ul className="theList">
              {listItems}
            </ul>
          </div>,
          document.querySelector("#todoListDisplay")
        );
      };//If length
    };//else
  });//api call
}//getAPIData


function RemainingTodosDisplay(user_name) {
//Lists the user and prologues the todo listing
var RemainingTodos = React.createClass({
  render: function() {
    var unCompletedTodo = "Only  " + uncompletedTodoCounter + "  more Todos left  " + user_name + "!";
    return (
    <div>
      {unCompletedTodo}
    </div>
    );
  }
});
//Sends
var remainingTodosDestination = document.querySelector("#remainingTodos");

ReactDOM.render(
  <div>
    <RemainingTodos/>
  </div>,
  remainingTodosDestination
);
}

////////////////////////////////////////////
/////End API calls and data handling
////////////////////////////////////////////
