let promise_One = readFile("file.txt");

let promise_Two = promise_One.then(function(content){
  return writeFile("new-file.txt", content);
});
  
promise_Two.then(function(){
  console.log('File writed')
}); 


readFile("file.txt", function(error, content){
  writeFile("new-file.txt", content, function(error){
    console.log('File is written.');
  }); 
});

let promise = new Promise((resolve, reject) => {
  readFile("file.txt", (error, content) => {   
    // reject в случае ошибки
   	if(error){
      reject(error);
      return;
    }  
    // resolve в случае успеха
    resolve(content);
  });
});
function readFileAsync(fileName) {
  return new Promise((resolve, reject) => {
    readFile("file.txt", (error, content) => {   
      // вызываем reject в случае ошибки
      if(error){
        reject(error);
        return;
      }  
      // resolve в случае успеха
      resolve(content);
    });
  });
}

promise
.then(content => console.log(content))
.catch(error => console.log(error));

readFile("file.txt")
.then(function(content){
  return writeFile("new-file.txt", content);
})
.then(function(){
  console.log('File writed')
});


function* task() {
	let content = yield readFileAsync("file.txt");
  let result  = yield writeFileAsync("new-file.txt", content);  
  console.log('File writed');
}


request('http://api.test.ru/getCity/orel', function (error, response, body) {
  request(`http://api.test.ru/getOffices/${body}` , function (error, response, body) {
    console.log(body);
  });
});