Testember::Application.routes.draw do
  root :to => 'contacts#index'
  resources :contacts
  match 'calendar' => 'contacts#index'
  match 'preferences' => 'contacts#index'
  match 'mail' => 'contacts#index'
end
