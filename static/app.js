
///////////
/////User Name Acquition
///////////

//Stores the variable of whomever is currently making a todo list--keeps accesible
var currentUser = [];

//Function that adds the user input form and transfers to the api
var UserList = React.createClass({
  getInitialState: function() {
    return {
      users: []
    };
  },
  addUser: function(e) {
    //initializes the itm array and connects with state's items property
    var userArray = this.state.users;

    //pushes the input to the array
    userArray.push(
      {
      //users name
      name: this._inputElement.value,
      key: Date.now()
      }
    );
    currentUser.push(userArray[0].name);
    console.log(userArray);
    if (userArray.length > 0) {
        var user_name = userArray[0].name;
          getAPIData(user_name);
    }
    //sets th state objects, items proprty to itemArray
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
          <form onSubmit={this.addUser}>
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
    var userEntries = this.props.entries;

    function createUsers(user) {
      return <p key={user.key}>{user.name}, Today you have to do:</p>
    }

    var listUser = userEntries.map(createUsers)[0];

    return (
    <div>
      {listUser}
    </div>
    );
  }
});
//Sends
var userDestination = document.querySelector("#userList");

ReactDOM.render(
  <div>
    <UserList/>
  </div>,
  userDestination
);


class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    console.log(this.state.value);
    //runColor(this.state.value);
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    console.log(this.state.value);
    //runColor(this.state.value);
    //getAPIData(this.state.value);
    addNewTodo(this.state.value);
  }

  render() {
    return (
    <div className="header">
      <form type="text" onSubmit={this.handleSubmit}>
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

//Ract Styling for the uncompleted todo items
var unCheckedStyles = {
      color: "red"
}

//React Styling for th completed todo items
var checkedStyles = {
  textDecoration: "line-through",
  color: "green"
}

//Runs on a check box event, cahnges boolean value of todo
function handleCheck(event) {
  console.log('yayyyyyy');
  console.log(currentUser[0]);
  //Splits event into value and boolean
  var checkedItemArray = event.target.value.split(',');
  console.log(checkedItemArray[0]);
  console.log(checkedItemArray[1]);
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

//Initializes a React/jsx list determined by bool value of todo item
function createTasks(item) {
  if (item[1] == 'false') {
    //Uncompleted todos call unCheckedStyles and trigger handlecheck function api-bool-todo
    return <li style={unCheckedStyles}>{item[0]} <input type="checkbox" unchecked value={item} onChange={handleCheck}/></li>
  }
  else {
    //Completed todos call unCheckedStyles and trigger handlecheck function api-bool-todo
    return <li style={checkedStyles}>{item[0]} <input type="checkbox" checked value={item} onChange={handleCheck}/></li>
  }
}

//Gets the todo data per user from the api
function getAPIData(user_name) {
  //To be changed in poduction
  var aPITOUSE = 'http://localhost:5000/';

  //Use an API call from my Flask view to access the QP Score to show on initial load
  d3.json(aPITOUSE + 'api/get?user_name=' + user_name, function(error, incomingData) {
    if (error) {
      return console.warn(error);
    }
    else {

      var listItems = incomingData.map(createTasks);
      console.log(incomingData);
      console.log(createTasks);
      console.log(listItems);
      if (incomingData.length > 0) {
        ReactDOM.render(
          <div>
            <ul className="theList">
              {listItems}
            </ul>
          </div>,
          document.querySelector("#todoListDisplay")
        );
      };
        };
    });
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


/*
var currentUser = [];
var UserList = React.createClass({
  getInitialState: function() {
    return {
      users: []
    };
  },
  addUser: function(e) {
    //initializes the itm array and connects with state's items property
    var userArray = this.state.users;

    //pushes the input to the array
    userArray.push(
      {
      name: this._inputElement.value,
      key: Date.now()
      }
    );
    currentUser.push(userArray[0].name);
    console.log(userArray);
    //sets th state objects, items proprty to itemArray
    this.setState({
      users: userArray
    });
    //prevents duplication
    e.preventDefault();
  },
  render: function() {
    return (
      <div className="userListMain">
        <div className="header">
          <form onSubmit={this.addUser}>
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

var UserName = React.createClass({
  render: function() {
    var userEntries = this.props.entries;

    function createUsers(user) {
      return <p key={user.key}>{user.name}, Today you have to do:</p>
    }

    var listUser = userEntries.map(createUsers)[0];

    return (
    <div>
      {listUser}
    </div>
    );
  }
});

var userDestination = document.querySelector("#userList");

ReactDOM.render(
  <div>
    <UserList/>
  </div>,
  userDestination
);

var TodoList = React.createClass({
  getInitialState: function() {
    return {
      items: []
    };
  },
  addItem: function(e) {
    //initializes the itm array and connects with state's items property
    var itemArray = [];

    $.ajax({
        type: 'post',
        url: 'http://localhost:5000/api/post/Josh_Schenkein?post_data=' + this._inputElement.value
    });
    /*
    //pushes the input to the array
    itemArray.push(
      {
      text: this._inputElement.value,
      key: Date.now(),
      user_name: currentUser[0],
      completed: false
      }
    );

    console.log(itemArray);



    //Gets data from api //////
    $.getJSON("http://localhost:5000/api/get?user_name=Josh_Schenkein", function(data) {
      console.log(data);
      for (var todo in data) {
        itemArray.push(
          {
          text: data[todo][0],
          key: Date.now(),
          user_name: currentUser[0],
          completed: data[todo][1]
          }
        );
      }

    });
    ////End get call

    //Post data to the data base
    //http://localhost:5000/api/post/Josh_Schenkein?post_data=CompletePracticum

    e.preventDefault();

    this.state.items = itemArray;
    //sets th state objects, items proprty to itemArray
    this.setState({
      items: itemArray
    });
    console.log(this.state.items);
    //prevents duplication
    e.preventDefault();
  },
  render: function() {
    return (
      <div className="todoListMain">
        <div className="header">
          <form onSubmit={this.addItem}>
            <input ref={ (a) => this._inputElement = a}
                placeholder="What needs to be done?">
            </input>
            <button type="submit">Add Todo!</button>
          </form>
        </div>
        <TodoItems entries={this.state.items}/>
      </div>
    );
  }
});

var TodoItems = React.createClass({
  render: function() {
    var todoEntries = this.props.entries;

    function createTasks(item) {
      return <li key={item.key}>{item.text}</li>
    }

    var listItems = todoEntries.map(createTasks);

    return (
      <ul className="theList">
        {listItems}
      </ul>
    );
  }
});

var todoListDestination = document.querySelector("#todoList");

ReactDOM.render(
  <div>
    <TodoList/>
  </div>,
  todoListDestination
);
*/
