/**
* PHP Email Form Validation - v3.6
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  // Select all forms with class 'php-email-form'
  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    // Add submit event listener to each form
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      // Get the 'action' and 'data-recaptcha-site-key' attributes of the form
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Show loading indicator and hide error and success messages
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      // Create a new FormData object and populate it with form data
      let formData = new FormData(thisForm);

      if (recaptcha) {
        // If reCaptcha is enabled
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              // Execute reCaptcha and get the token
              grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                .then(token => {
                  // Set the token in the formData object
                  formData.set('recaptcha-response', token);
                  // Submit the form
                  php_email_form_submit(thisForm, action, formData);
                })
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        // If reCaptcha is not enabled, submit the form
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    // Send form data to the server using fetch API
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        // Handle the response from the server
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() == 'OK') {
          // If the response is 'OK', show success message and reset the form
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          // If the response is not 'OK', throw an error
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
        }
      })
      .catch((error) => {
        // Handle errors during form submission
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    // Show error message and hide loading indicator
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();















