$(document).ready(function () {
    $('#signup-form').submit(async function (event) {
        event.preventDefault();

        // Get form data
        var email = $('#email').val();
        var username = $('#username').val();
        var password = $('#password').val();
        var confirmPassword = $('#confirm_password').val();

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            // You can display an error message to the user here
            return;
        }
        function getCSRFToken() {
            const csrfCookie = document.cookie
              .split("; ")
              .find((cookie) => cookie.startsWith("csrftoken="));
    
            if (csrfCookie) {
              return csrfCookie.split("=")[1];
            }
    
            // If the CSRF token cookie is not found, call Django's get_token function
            return django.middleware.csrf.get_token();
          }

        var formData = {
            email: email,
            username: username,
            password: password,
        };

        try {
            const response = await fetch('/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCSRFToken(),
                    // Add any additional headers if needed
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                // Handle successful signup
                alert('Signup successful');
            } else {
                // Handle unsuccessful signup
                console.log('Error during signup:', result.message);
            }
        } catch (error) {
            // Handle fetch error
            console.log('Error during signup:', error);
        }
    });
});
