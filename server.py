#!Server.py -run at localhost:5000
from flask import Flask, request, render_template, jsonify
from sqlalchemy import create_engine
import json

app = Flask(__name__)

#sqlalchemy communication with todo Postgres database I have hosted on heroku
engine = create_engine('postgres://zgzikcxqdqxxhz:59381b691d83aaf49569ef296b6e1ebc612f938954cb077783ad6f616e489820@ec2-23-23-225-12.compute-1.amazonaws.com:5432/dbn60sk0nc6tbg')
conn = engine.connect()

'''
TodoListTicTail = table name
user, todo1, td2, td3, td4, td5, td6
Josh_Schenkein, VideoCall, get job
# = True/completed
& = false/uncompleted - could append the value at start and when changed-it updates th database and changes it
'''

#The homepage/index
@app.route('/')
def root():
    return render_template('index.html')

#Creates a New User table and instantiates todo column and contingent boolean state
@app.route('/api/add_user/')
def new_user_from_todo_list():
    if 'new_user' in request.args:
        #http://localhost:5000/api/add_user?new_user=Josh_Schenkein
        new_user = request.args['new_user']

        #Gets a list of all users who have made a todo list
        all_Tables = conn.execute('''SELECT * FROM information_schema.tables;''')
        all_Tables_OBJ = all_Tables.cursor.fetchall()

        #A list of table_names that aren't actually table names
        not_a_table_name = ['None', 'BASE TABLE', 'YES', 'NO', 'public', 'dbn60sk0nc6tbg']
        for table_name in all_Tables_OBJ[2]:
            if str(table_name) not in not_a_table_name:
                #If the user has not alrady entered their name then a new table will be created
                if str(table_name) != str(new_user):

                    #This command creates a new user Table in the data base, with a default column that will hold the todos
                    conn.execute('''CREATE TABLE "{}" ("Todo List" varchar(1000) NOT NULL, PRIMARY KEY ("Todo List"));'''.format(new_user))
                    #This initializes a new column that holds whether the todo was completed or not
                    conn.execute('''ALTER TABLE "{}" ADD COLUMN "Completed" VARCHAR(50);'''.format(new_user))
                    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
                else:
                    #If the user has already made a table
                    return json.dumps({'success':False}), 400, {'ContentType':'application/json'}

#New Data to post to Todo list
@app.route('/api/post/<user_name>', methods=['POST'])
def api_with_new_todo_to_post(user_name):
    if 'post_data' in request.args:
        if request.method == 'POST':
            #http://localhost:5000/api/post/Josh_Schenkein?post_data=CompletePracticum
            post_data = request.args['post_data']
            #This command adds a row/new Todo to a table and initializes the completion column as false
            conn.execute('''INSERT INTO "{}" VALUES ('{}', 'false');'''.format(user_name, post_data))
            return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

#Change checked from false to true to, aka has todo been completed or not, completed==True
@app.route('/api/check/<user_name>/<todo_item>', methods=['POST'])
def change_checkbox_from_false_to_true(user_name, todo_item):
    if 'completed' in request.args:
        if request.method == 'POST':
            #http://localhost:5000/api/check/Josh_Schenkein/CompletePracticum?completed=true
            completed = request.args['completed']
            print(user_name, todo_item, completed)
            if completed == 'false':
                #This command adds a row/new Todo to a table and initializes the completion column as false
                conn.execute('''UPDATE "{}" SET "Completed" = 'True' WHERE "Todo List" = '{}';'''.format(user_name, todo_item))
            else:
                conn.execute('''UPDATE "{}" SET "Completed" = 'false' WHERE "Todo List" = '{}';'''.format(user_name, todo_item))

            return json.dumps({'success':True}), 200, {'ContentType':'application/json'}


#Gets All the todos data from the database
@app.route('/api/get')
def api_gets_all_todos():
    if 'user_name' in request.args:
        #http://localhost:5000/api/get?user_name=Josh_Schenkein
        user_name = request.args['user_name']
        #Gets all the data the user's table
        table_query = conn.execute('''SELECT * FROM "{}";'''.format(user_name))
        query_todo_list = table_query.cursor.fetchall()
        return jsonify(query_todo_list)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
