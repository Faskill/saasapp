class Users::RegistrationsController < Devise::RegistrationsController
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