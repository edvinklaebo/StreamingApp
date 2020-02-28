<template>
      <div id="inner">
          <div v-if="!signedIn">
              <amplify-authenticator></amplify-authenticator>
          </div>
          <div v-if="signedIn">
              <amplify-sign-out></amplify-sign-out>
            <div>
              <input v-model="msg" v-on:keyup.enter="createNewTodo">
              <button @click="createNewTodo">
                  Send
              </button>

            </div>
            <div id="chat" style="width:550px;height:400px;line-height:3em;overflow:auto;padding:5px;">
              <ul>
                  <li v-for="todo in todos" :key="todo.id" >
                    [{{ todo.createdAt }}]{{todo.name}}: {{todo.description}}
                  </li>
              </ul>
            </div>
          </div>
      </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import { AmplifyEventBus } from 'aws-amplify-vue'
import { API, graphqlOperation } from 'aws-amplify'

import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { onCreateTodo } from './graphql/subscriptions'

export default {
    name: 'App',
    data() {
        return{
            signedIn: false,
            todos: [],
            user: {},
            msg: '',
        }
    },
    created(){
        this.findUser();
        this.getData();
        this.subscribe();
        this.createNewTodo();
        setInterval(this.updateScroll, 1000);

        AmplifyEventBus.$on('authState', info => {
          if(info === "signedIn"){
            this.findUser();
          }else{
            this.signedIn = false;
          }
        });
    },
    methods:{
        async createNewTodo() {
          try {
            const todo = { name: this.user.username, description: this.msg }
            this.msg = '';
            await API.graphql(graphqlOperation(createTodo, { input: todo }))          
            this.updateScroll();
          } catch (error) {
            console.log(error);
          }
        },
        updateScroll(){
          var element = document.getElementById("chat");
          element.scrollTop = element.scrollHeight;
        },
        async getData() {
          try {
            const todoData = await API.graphql(graphqlOperation(listTodos, {
              limit: 1000
            }));
            console.log(todoData);
            this.todos = [...todoData.data.listTodos.items].sort(function(a, b){
              var dateA = new Date(a.createdAt), dateB = new Date(b.createdAt)
              return dateA - dateB;
            });

          } catch (error) {
            console.log(error);
          }
        },
        subscribe() {
          API.graphql(graphqlOperation(onCreateTodo)).subscribe({
            next: (eventData) => {
              const todo = eventData.value.data.onCreateTodo;
              this.todos.push(todo);
            }
          })
        },
        async findUser() {
            try{
                this.user = await Auth.currentAuthenticatedUser();
                this.signedIn = true;
                console.log(this.user);
            }catch(err){
                this.signedIn = false;
            }
        }
    }
}
</script>

<style scoped>
#inner {
  display: table;
  margin: 0 auto;
}
</style>