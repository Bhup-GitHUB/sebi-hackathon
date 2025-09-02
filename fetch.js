// Test basic endpoint
fetch('https://sebi-hackathon.bkumar-be23.workers.dev/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log(data))


fetch('https://sebi-hackathon.bkumar-be23.workers.dev/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "username": "frontenduwser",
    "email": "fronwtend@test.com", 
    "phone": "9876543210",
    "password": "TestPwass123!",
    "name": "Frontend User"
  })
})
.then(response => response.json())
.then(data => console.log(data))