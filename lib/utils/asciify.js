var asciify = require('asciify-image');
 
var options = {
  fit:    'box',
  width:  50,
  height: 50
};
 
asciify('assets/images/75.jpg', options, function(err, asciified) {
  if(err) throw err;
 
  // Print to console
  console.log(asciified);
}); 