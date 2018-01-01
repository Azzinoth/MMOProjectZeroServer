function Account (id, email, password){
    this.id = id;
    this.email = email;
    this.password = password;
    this.webSocket = null;
}
module.exports = Account;