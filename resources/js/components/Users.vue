<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card card-default">
                    <div class="card-header">Users Component
                        <div class="card-tools">
                         <button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" @click="newModal()"><i class="fas fa-user"></i>  Add User</button>
                        </div>
                     </div>

                    <div class="card-body">
                       <table class="table table-bordered">
                          <tbody>
                         <tr>
                            <th style="width: 10px">#</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Password</th>
                            <th style="width: 120px">Action</th>
                          </tr>

                          <tr v-for="user in users" :key="user.id">
                            <td>{{ user.id  }}</td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.type | upText}}</td>
                            <td>
                              <div class="progress progress-xs">
                                <div class="progress-bar progress-bar-danger" style="width: 55%"></div>
                              </div>
                            </td>
                            <td >
                              <a href="#" class="btn btn-info" @click="editModal(user)">
                                <i class="fas fa-edit"></i></a>
                              <a href="#" class="btn btn-danger" @click="deleteUser(user.id)">
                                <i class="fas fa-trash"></i></a>
                            </td>
                          </tr>

                        </tbody>
                    </table>
                     <div class="card-footer clearfix">
                        <ul class="pagination pagination-sm m-0 float-right">
                          <li class="page-item"><a class="page-link" href="#">«</a></li>
                          <li class="page-item"><a class="page-link" href="#">1</a></li>
                          <li class="page-item"><a class="page-link" href="#">2</a></li>
                          <li class="page-item"><a class="page-link" href="#">3</a></li>
                          <li class="page-item"><a class="page-link" href="#">»</a></li>
                        </ul>
                      </div>
                   </div>
                </div>
            </div>
        </div>
        
        <!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" v-show="!editmode" @click="newModal()">Add New</h5>
        <h5 class="modal-title" v-show="editmode" @click="newModal()">Update User</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <form  @submit.prevent="editmode ? updateUser() : createUser()">
      <div class="modal-body">
          <div class="form-group">
              <label>Name</label>
              <input v-model="form.name" type="text" name="name"
                class="form-control" :class="{ 'is-invalid': form.errors.has('name') }" placeholder="Name">
              <has-error :form="form" field="name"></has-error>
          </div>
          <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" name="email"
                class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" placeholder="Email">
              <has-error :form="form" field="email"></has-error>
          </div>
          <div class="form-group">
              <label>Password</label>
              <input v-model="form.password" type="password" name="password"
                class="form-control" :class="{ 'is-invalid': form.errors.has('password') }" placeholder="Password">
              <has-error :form="form" field="password"></has-error>
          </div>
          <div class="form-group">
            <label>Select User Role</label>
              <select name="type" v-model="form.type" id="type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                <option value="">Select User Role</option>
                <option value="admin">Admin</option>
                <option value="user">Standard User</option>
                <option value="author">Author</option>
              </select>
              <has-error :form="form" field="type"></has-error>
          </div>
          <div class="form-group">
             <label>Bio</label>
            <textarea v-model="form.bio" name="bio" id="bio"
                        placeholder="Short bio for user (Optional)"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
            <has-error :form="form" field="bio"></has-error>
           </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
        <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
      </div>
      </form>
    </div>
  </div>
</div>

    </div>

</template>

<script>
    export default {
        data(){
            return{
              editmode: false,
              users : {},
                form: new Form({
                    id: '',
                    name: '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            } 
        },
        methods:{ 
          loadUsers(){
            axios.get('api/user').then(({ data }) => (this.users = data.data ));
          },

          createUser(){  
            this.$Progress.start();
            this.form.post('api/user');
             Fire.$emit('AfterCreate');
            $('#exampleModal').modal('hide');
            toast({
                    type: 'success',
                    title: 'User Create Successfully'
                  })
            this.$Progress.finish();
          }, 

          deleteUser(id){
            swal({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              //Sent Request to the Server
              if (result.value) {
              this.form.delete('/api/user/'+id).then(()=>{
                
                swal(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                )
                Fire.$emit('AfterCreate');
              
              }).catch(()=>{
                swal(
                  'Failed!',
                  'There was something wronge.',
                  'warning'
                )
              });
             }
            })
          },

          newModal(){
            this.editmode = false;
            this.form.reset();
            $('#exampleModal').modal('show');
          },

          editModal(user){
            this.editmode = true;
            this.form.reset();
            $('#exampleModal').modal('show');
            this.form.fill(user);
          },

          updateUser(){
            this.$Progress.start();
            this.form.put('api/user/'+this.form.id)
            .then(()=>{
              swal(
                  'Updated',
                  'Your file has been Updated.',
                  'success'
                )
              Fire.$emit('AfterCreate');
              this.$Progress.finish();
              $('#exampleModal').modal('hide');
            })
            .catch(()=>{
              this.$Progress.fail();
            });
          }
        },

          created() {
            this.loadUsers();
            Fire.$on('AfterCreate', () =>{
              this.loadUsers();
            });
            //setInterval(() => this.loadUsers(),3000);
        
    }
  }

</script>
