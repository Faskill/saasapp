Rails.application.routes.draw do
  root to: 'pages#home'
  get 'about', to: 'pages#about'
  resources :contacts, except: :new
  get 'contact-us', to: 'contacts#new', as: :new_contact
end
