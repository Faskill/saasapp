/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  // Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  
  // When user clicks form submit btn
  submitBtn.click(function(){
    //prevent default submission behavior.
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    
    //Collect the credit card fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val(),
        pw = $('#user_password').val(),
        pw_conf = $('#user_password_confirmation').val(),
        error = false,
        error_message = "";
    
    
    // Added custom password validation so nothing is sent to Stripe if the 
    // password is incorrect
    if ( pw.length <= 5) {
      error = true;
      error_message = "Your password is too short. Please enter a password with at least 6 characters.";
    }
    
    else if (pw != pw_conf) {
      error = true;
      error_message = "Your password doesn't match the password confirmation";
    }
    
    //Use Stripe JS library to check for card errors.
    //Validate card information
    else if(!Stripe.card.validateCardNumber(ccNum) || !Stripe.card.validateCVC(cvcNum) || !Stripe.card.validateExpiry(expMonth, expYear) ){
      error = true;
      error_message = "Your card information is invalid";
    }
    
    if (error) {
      $('.flash-container').html("<div class= 'alert alert-dismissable alert-danger'><button type='button' class='close' data-dismiss='alert'>×</button>"+error_message+"</div>");
      submitBtn.prop('disabled',false).val("Sign Up");
    }
      
    else {
      //Send card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
        }, stripeResponseHandler);
      return false;
    }
  });
  
  //Stripe will return a card token.
  var stripeResponseHandler = function(status,response){
  //Get the token from the response
  var token = response.id;  
  //Inject card token as hidden field into form.
  theForm.append( $("<input type='hidden' name='user[stripe_card_token]'>").val(token) );
  
  //Submit form to our Rails app. 
  theForm.get(0).submit();
  };
});
