// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.

function getChangePass(request, response) {
  // do any work you need to do, then
  response.render("changePass", {
    
  });
}

module.exports = {
    getChangePass,
};
