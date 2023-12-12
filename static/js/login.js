// // Handle login form submission
// $('#login-form').submit(function (e) {
//     e.preventDefault();

//     // Get form data
//     var formData = {
//         email: $('#email').val(),
//         password: $('#password').val(),
       
//     };

//     function getCSRFToken() {
//         const csrfCookie = document.cookie
//           .split("; ")
//           .find((cookie) => cookie.startsWith("csrftoken="));

//         if (csrfCookie) {
//           return csrfCookie.split("=")[1];
//         }

//         // If the CSRF token cookie is not found, call Django's get_token function
//         return django.middleware.csrf.get_token();
//       }


//     // Perform AJAX login
//     $.ajax({
//         type: 'POST',
//         url: 'login/', 
//         data: JSON.stringify(formData),
//         contentType: 'application/json',
//         headers: {
//             "X-CSRFToken": getCSRFToken(),
//         }, // Update to match the URL name in your urls.py
//         success: function (response) {
//             if (response.success) {
//                 // Redirect to the specified URL upon successful login
//                 window.location.href = response.redirect_url;
//             } else {
//                 console.log('Error during login:', response);
//             }
//         },
//         error: function (error) {
//             console.log('Error during login:', error);
//         }
//     });
// });



$(document).ready(function () {
    // Handle login form submission
    $('#login-form').submit(async function (e) {
        e.preventDefault();

        // Get form data
        var formData = {
            email: $('#username').val(),
            password: $('#password').val(),
        };

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

        try {
            const response = await fetch('login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();

            if (responseData.success) {
                // Redirect to the specified URL upon successful login
                window.location.href = responseData.redirect_url;
            } else {
                // Check for specific error conditions
                if (responseData.errors) {
                    // Handle errors
                    console.log('Error during login:', responseData.errors);
                } else {
                    console.log('Unknown error during login');
                }
            }
        } catch (error) {
            // Handle fetch error
            console.error('Error during login:', error);
        }
    });
});
