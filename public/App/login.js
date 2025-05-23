 document.getElementById('userloginForm').addEventListener('submit', async function(e) {
            e.preventDefault(); // prevent form from reloading the page

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            sessionStorage.setItem("username", username);
            try {
                const response = await fetch('/users', {
                    method: 'GET',
                    headers: {
                        'X-Username': username,
                        'X-Password': password
                    }
                });

               const result = await response.json(); // Parse the JSON response

                console.log(result); // Show server error message
                 
 
            } catch (error) {
                console.error('Error:', error.message);
            }
        });

 