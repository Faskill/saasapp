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
        expYear = $('#card_year').val();
        
    //Use Stripe JS library to check for card errors.
    //Validate card information
    if(!Stripe.card.validateCardNumber(ccNum) || !Stripe.card.validateCVC(cvcNum) || !Stripe.card.validateExpiry(expMonth, expYear) ){
     $('.flash-container').html("<div class= 'alert alert-dismissable alert-danger'><button type='button' class='close' data-dismiss='alert'>×</button>Your card information is invalid</div>");  
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
