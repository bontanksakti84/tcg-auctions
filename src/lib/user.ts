export function getUser() {
    let user = localStorage.getItem("user");
  
    if (!user) {
      user = "User" + Math.floor(Math.random() * 1000);
      localStorage.setItem("user", user);
    }
  
    return user;
  }