//= require_directory ./templates

App = Ember.Application.create({
  ApplicationView: Ember.View.extend({
    templateName:  'application',
    classNames: ['application-view']
  }),
  ApplicationController: Ember.Controller.extend({
    slogan: 'A framework for creating ambitious web applications',
    isSlogan: true
  }),
  ContactsView:  Em.View.extend({
    templateName:  'contacts'
  }),
  ContactsController:  Em.ArrayController.extend(),
  SalutationView:  Em.View.extend({
    templateName:  'salutation'
  }),
  SalutationController:  Em.ObjectController.extend(),
  ContactView:  Em.View.extend({
    templateName:  'contact'
  }),
  ContactController:  Em.ObjectController.extend(),
  TraversalView:  Em.View.extend({
    templateName:  'traversal'
  }),
  TraversalController:  Em.ObjectController.extend(),
  HomeView:  Em.View.extend({
    template:  Em.Handlebars.compile('<p><a {{action goHome href=true}}><em>Go Home</em></a></p>')
  }),
  HomeController:  Em.ObjectController.extend(),
  ready: function(){
    console.log("Created App namespace");
  },
  Router: Ember.Router.extend({
    enableLogging:  true,
    goToContacts:  Ember.Route.transitionTo('contacts.index'),
    goHome:  Ember.Route.transitionTo('index'),
    root:  Ember.Route.extend({
      index:  Ember.Route.extend({
        route:  '/',
        connectOutlets:  function(router, context){
          router.get('applicationController').connectOutlet('greeting', 'salutation',
                                                            { greeting: "My Ember App" });
          router.get('applicationController').connectOutlet('body', 'traversal'); }
      }),
      contacts:  Ember.Route.extend({
        showContact: Ember.Route.transitionTo("contacts.contact"),
        route: '/contacts',
        index: Ember.Route.extend({
          route: "/",
          enter: function ( router ){
            console.log("The contacts sub-state was entered.");
          },
          connectOutlets:  function(router, context){
            router.get('applicationController').connectOutlet('greeting', 'salutation',
                                                              { greeting: "contacts Route" });
            router.get('applicationController').connectOutlet('body', 'contacts');
            router.get('applicationController').connectOutlet('footer', 'traversal');
            router.get('traversalController').connectOutlet('home');
          }          
        }),
        contact:  Ember.Route.extend({
          route: '/:id',
          enter: function ( router ){
            console.log("The shoe detail sub-state was entered.");
          },
          deserialize:  function(router, context){
            return App.Contact.find( context.id );
          },
          serialize:  function(router, context){
            return {
              id: context.id
            }
          },
          connectOutlets:  function(router, context){
            router.get('applicationController').connectOutlet('greeting', 'salutation',
                                                              { greeting: "Contact.contact Route" });
            router.get('applicationController').connectOutlet('body', 'contact', context);
            router.get('applicationController').connectOutlet('footer', 'traversal');
          }
        })

      })
    })
  })
});
App.store = DS.Store.create({
  revision: 7,
  adapter: DS.RESTAdapter.create({ bulkCommit: false })
});
App.Contact = DS.Model.extend({
   firstName: DS.attr('string'),
   lastName: DS.attr('string'),
   fullName: function() {
    return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')

});
App.contacts = App.store.findAll(App.Contact);
App.initialize();
