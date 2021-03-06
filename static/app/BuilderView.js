/*
 * PlugBuild client frontend
 * Copyright © 2012 Stephen Oliver <mrsteveman1@gmail.com>
 */

(function($) {
	window.BuilderView = Backbone.View.extend({
		tagName: 'div',
		className: 'one-third column statusbox',
		
		
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($('#builder-template').html());
			
			this.collection	= new Builders();
			this.collection.bind('reset', this.render);
			this.collection.bind('create', this.render);
			//this.collection.bind('add', this.render);
			this.collection.reset();
			
			
			var lthis = this;
			dispatcher.on('builder:snapshot',function(snapshot) {
				console.log('Builder view got builder state snapshot');
				lthis.collection.reset(snapshot);
				lthis.render();
			});
			dispatcher.on('builder:state',function(builder) {
				console.log('Builder view got new state');
				model = lthis.collection.get(builder['fqn']);
				if (model) {
					lthis.collection.remove(model);
    			}
				lthis.collection.create(builder);
				lthis.render();
			});	
		},
    
		render: function() {

			//ask the stored template function to render its template into a dom element 
			var renderedContent = this.template();
			$(this.el).html(renderedContent);
			var buildercache = document.createDocumentFragment();
			this.collection.each(function(builder) {
				var builderstate = builder.get('state');
				var builderdetail = builder.get('package');
				var buildername = builder.get('name');
				var builderarch = builder.get('arch');
				
				
				var li = document.createElement('li');
				li.setAttribute('class','builder-node');
				
				switch (builderstate) {
					case "disconnect":
						builderdetail = "Disconnected";
						break;
					case "idle":
						builderdetail = "Idle";
					default:
						break;
				}

				var state_element = document.createElement('span');
				state_element.setAttribute('class','state ' + builderstate);
				li.appendChild(state_element);
				
								
				var name_element = document.createElement('span');
				var name = document.createTextNode(buildername);
				name_element.appendChild(name);
				name_element.setAttribute('class','name');
				li.appendChild(name_element);


				var detail_element = document.createElement('span');
				var detail = document.createTextNode(builderdetail);
				detail_element.appendChild(detail);
				detail_element.setAttribute('class','detail');
				li.appendChild(detail_element);
				
								
				var arch_element = document.createElement('span');
				var arch = document.createTextNode(builderarch);
				arch_element.appendChild(arch);
				arch_element.setAttribute('class','arch');
				li.appendChild(arch_element);
				
				
				buildercache.appendChild(li);
			});

      		this.$('#builder-list').append(buildercache);
      		
			return this;
		}
	});
})(jQuery);