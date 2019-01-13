 require('./bootstrap');

window.Vue = require('vue');

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)
Vue.use(VueRouter)

import { Form, HasError, AlertError } from 'vform';
import VueRouter from 'vue-router'
import moment from 'moment'; 
import VueProgressBar from 'vue-progressbar';
import swal from 'sweetalert2';

window.Form = Form;
window.swal = swal;


//Loadding
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '3px'
})
//Alert Create
const toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

window.toast = toast;

 
let routes = [
  { path: '/dashboard', component: require('./components/Dashbaord.vue') },
  { path: '/profile', component: require('./components/Profile.vue') },
  { path: '/users', component: require('./components/Users.vue') }
]

const router = new VueRouter({
	mode:'history',
    routes // short for `routes: routes`
})

//For text Yaii
Vue.filter('upText', function(text){
	return text.charAt(0).toUpperCase()+text.slice(1);
}); 

//For DateTime
Vue.filter('myDate', function(created){
	return moment(created).format('MMMM Do yyyy');
});

window.Fire = new Vue();

const app = new Vue({
    el: '#app',
    router
});
