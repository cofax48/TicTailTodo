Josh Schenkein-TicTail Todo List App

TicTail Todo List App

  The Server:
    The server is built with flask and serves the homepage and 3 APIs. The function,
    api_gets_all_todos_and_creates_data_table(), evaluates the passed user name,
    if it doesn't match a table name, then a new table in the database is created
    to store the todo list. If the user/table exists, then the api performs a GET
    call and passes the data to the view. The api_with_new_todo_to_post()
    takes the passed user name and adds any new todo to the user names table.
    The change_checkbox_from_false_to_true() takes the username and todo item to be
    evaluated and turns an uncompleted todo to a completed todo or vice versa-only a
    200 is passed as the JS re-requests the todo list upon any change to the check.
    Also the todolist.html is served

  The Database:
    The database is built in postgres and is quit simple, each new user gets a new
    table and each table has two columns-todo and completed, each new todo item creates
    a new row. The database is interacted with through sqlalchemy and hosted on heroku.

  The App:
    The App is built entirely in React. Upon Load the initial user name input is
    rendered with react, after the name has been entered, that component is hidden
    while the list and child elements are pulled from the api with D3 (my favorite)
    and ajax/jquery (it would be irresponsible not to). The data is then circulated
    through the app and rendered accordingly if it was completed or not, thereafter
    the whole list is rendered to the view.

  The html/css:
    The html was written specifically for this project, while I reused CSS I've
    employed on previous projects.


Getting Started

  Run the app:
    $pip install sqlalchemy
    $python3 server.py
    Navigate to:
      http://localhost:5000/ #index
      Api:
        api_gets_all_todos_and_creates_data_table():
          http://localhost:5000/api/get?user_name=Josh_Schenkein
        api_with_new_todo_to_post(user_name):
          http://localhost:5000/api/post/Josh_Schenkein?post_data=CompletePracticum
        change_checkbox_from_false_to_true(user_name, todo_item):
          http://localhost:5000/api/check/Josh_Schenkein/CompletePracticum?completed=true

Prerequisites

  All software is gathered using cdns, everything else should be local-which may require
  sqlalchemy to be installed via pip

Built With

  Python:
    sqlalchemy
    flask
    json
  Javascript:
    React
    D3

Written By:

  Josh Schenkein for TicTail
