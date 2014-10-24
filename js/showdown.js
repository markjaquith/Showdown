(function($){

var app = window.showdownPlugin = {
	start: function(data) {
		this.competitions = new this.Collections.Competitions(data.competitions);
		this.view = new this.Views.Competitions({ collection: this.competitions });
		this.view.inject( '.showdown-plugin' );
	}
};

// Extend wp.Backbone.View with .prepare() and .render()
app.View = wp.Backbone.View.extend({
	render: function() {
		var result = wp.Backbone.View.prototype.render.apply( this, arguments );
		if ( typeof this.postRender === "function" ) {
			this.postRender();
		}
		return result;
	},

	prepare: function() {
		if ( typeof this.model !== "undefined" && typeof this.model.toJSON === "function" ) {
			return this.model.toJSON();
		}
	}
});

/* ------ */
/* MODELS */
/* ------ */
app.Models = {};

app.Models.Competition = Backbone.Model.extend({
	competitors: {},
	initialize: function() {
		this.competitors = new app.Collections.Competitors( this.get('competitors') || [] );
		this.unset('competitors');
	}
});

app.Models.Competitor = Backbone.Model.extend({
	voters: {},
	initialize: function() {
		this.voters = new app.Collections.Votes( this.get('votes') || [] );
		this.unset('votes');
	}
});

app.Models.Vote = Backbone.Model.extend({});

/* ----------- */
/* COLLECTIONS */
/* ----------- */
app.Collections = {};

app.Collections.Competitions = Backbone.Collection.extend({
	model: app.Models.Competition
});

app.Collections.Competitors = Backbone.Collection.extend({
	model: app.Models.Competitor
});

app.Collections.Votes = Backbone.Collection.extend({
	model: app.Models.Vote
});

/* ----- */
/* VIEWS */
/* ----- */
app.Views = {};

// Competitions view
app.Views.Competitions = app.View.extend({
	initialize: function() {
		_.each( this.collection.models, this.addView, this );
	},
	addView: function( competition ) {
		this.views.add( new app.Views.Competition({ model: competition }) );
	},
	inject: function( selector ) {
		this.render();
		$(selector).html( this.el );
		this.views.ready();
	}
});

// Competition view
app.Views.Competition = app.View.extend({
	className: "competition",
	template: wp.template("competition"),

	initialize: function() {
		this.views.set( '.competitors-wrap', new app.Views.Competitors({ collection: this.model.competitors }) );
	}
});

// Competitors view
app.Views.Competitors = app.View.extend({
	className: "competitors",

	initialize: function() {
		_.each( this.collection.models, this.addView, this );
	},

	addView: function( competitor ) {
		this.views.add( new app.Views.Competitor({ model: competitor }) );
	}
});

// Competitor view
app.Views.Competitor = app.View.extend({
	className: "competitor",
	template: wp.template( "competitor" ),

	initialize: function() {
		this.views.set( '.votes-wrap', new app.Views.Votes({ collection: this.model.voters }) );
	}
});

// Votes view
app.Views.Votes = app.View.extend({
	className: "votes",
	tagName: "ul",

	initialize: function() {
		_.each( this.collection.models, this.addView, this );
	},

	addView: function( voter ) {
		this.views.add( new app.Views.Vote({ model: voter }) );
	}
});

// Vote view
app.Views.Vote = app.View.extend({
	className: "vote",
	template: wp.template( "vote" ),
});

})(jQuery);
