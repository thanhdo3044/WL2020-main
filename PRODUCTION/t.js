var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://0.0.0.0:2003/api/v2/ballets',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMzE5LCJpYXQiOjE1Nzg5MzcwNzcsImV4cCI6MTU4MDIzMzA3N30.VFGGCrf-AumTsyxwD8-qk4bX1kK57g8fUC5j13z5IQ8'
  },
  form: {
    'sourceId': '100073',
    'destinationId': '100074',
    'itemId': '109301,109310',
    'quantity': '10,20',
    'typeId': '100011'
  }
};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});
