import { readingStore } from "../models/reading-store.js";
import { userStore } from "../models/user-store.js";

export const accountsController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },
  editDetails(request, response) {
    const viewData = {
      title: "Edit Details"
    };
    response.render("member-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user) {
      response.cookie("email", user.email);
      console.log(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },
  async update(request, response) {
    const user = await userStore.getUserByEmail(request.cookies.email);
    const userEmail = user.email;
    const updatedUser = {
      firstname: request.body.firstname,
      lastname: request.body.lastname,
      password: request.body.password
    };
    console.log(`Updating details for ${userEmail}`);
    await userStore.updateUser(userEmail, updatedUser);
    response.redirect("/dashboard");

  },

  async getLoggedInUser(request) {
    const userEmail = request.cookies.email;
    return await userStore.getUserByEmail(userEmail);
  },
};