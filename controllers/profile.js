// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.

function getProfile(request, response) {
  // do any work you need to do, then
  response.render("profile", {
    
  });
}

module.exports = {
    getProfile,
};
