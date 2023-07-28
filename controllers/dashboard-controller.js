export const dashboardController = {
  async index(request, response) {
    const viewData = {
      title: "Template Application",
    };
    console.log("dashboard rendering");
    response.render("dashboard-view", viewData);
  },
  async addreport(request, response) {
    console.log("rendering new report");
    const report = {};
    const viewData = {
      title: "Weather Report",
      reading : report
    };
    response.render("dashboard", viewData);
  },
};
