(function($){

var app = window.showdownPlugin = {
	start: function(data) {
		this.competitions = new this.Collections.Competitions(data);
	},

	Models: {
		Competition: Backbone.Model.extend({
			competitors: {}
		}),
		Competitor: Backbone.Model.extend({})
	},
	Collections: {
		Competitions: Backbone.Collection.extend({}),
		Competitors: Backbone.Collection.extend({})
	}
};

})(jQuery);
