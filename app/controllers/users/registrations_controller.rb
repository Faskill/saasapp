class Users::RegistrationsController < Devise::RegistrationsController
  # Extend default Devise gem behaviour so that 
  # Users signing up with the Pro account (plan ID 2)
  # save with a special Stripe subscription function
  # Otherwise Devise signs up users as usual.
  def create
    super do |resource|
      if params[:plan]
        resource.plan_id = params[:plan]
        if resource.save_with_subscription
          
        else
          resource.save
        end
      end
    end
  end
end