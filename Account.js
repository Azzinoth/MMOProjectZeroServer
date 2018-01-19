function Account (id, email, password){
    this.id = id;
    this.email = email;
    this.password = password;
    this.webSocket = null;
}
Account.prototype.getCharacter=function (characters) {
  for (let key in characters){
      if (characters[key].accountId === this.id) return characters[key];
  }
  return null;
}
module.exports = Account;