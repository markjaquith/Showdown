(function($){

var app = window.showdownPlugin = {
	start: function(data) {
		this.data = data;
		this.voters = new this.Collections.Votes( data.voters );
		delete this.data.voters;
		this.competitions = new this.Collections.Competitions( data.competitions );
		delete this.data.competitions;
		this.view = new this.Views.Competitions({ collection: this.competitions });
		this.view.inject( '.showdown-plugin' );
	}
};

// Extend wp.Backbone.View with .prepare() and .inject()
app.View = wp.Backbone.View.extend({
	inject: function( selector ) {
		this.render();
		$(selector).html( this.el );
		this.views.ready();
	},

	prepare: function() {
		if ( ! _.isUndefined( this.model ) && _.isFunction( this.model.toJSON ) ) {
			return this.model.toJSON();
		} else {
			return {};
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
		this.listenTo( this.competitors, 'addVote', this.syncVote );
	},

	syncVote: function( vote, competitor ) {
		var options = { context: this };
		options.data = {
			action: 'showdown_vote',
			competition: this.get('id'),
			competitor: competitor.get('id'),
			_ajax_nonce: app.data.nonce || null
		};
		wp.ajax.send( options );
	}
});

app.Models.Competitor = Backbone.Model.extend({
	votes: {},

	initialize: function() {
		// Grab the voter model from app.voters
		this.votes = new app.Collections.Votes( _.map( this.get('votes'), function(v) { return app.voters.get(v); }) || [] );
		this.unset('votes');
		this.listenTo( this.votes, 'add', this.announceAddVote );
	},

	announceAddVote: function( model, collection ) {
		this.trigger( 'addVote', model, this );
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
	model: app.Models.Competitor,

	initialize: function() {
		this.listenTo( this, 'addVote', this.makeVoteUnique );
	},

	makeVoteUnique: function( vote, competitor ) {
		var others = _.reject( this.models, function(m){ return m === competitor; } );
		_.each( others, function(c){ c.votes.remove( vote ); } );
	}
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
	className: "competitions",

	initialize: function() {
		_.each( this.collection.models, this.addCompetitionView, this );
	},

	addCompetitionView: function( competition ) {
		this.views.add( new app.Views.Competition({ model: competition }) );
	}
});

// Competition view
app.Views.Competition = app.View.extend({
	className: "competition",
	template: wp.template("competition"),

	initialize: function() {
		_.each( this.model.competitors.models, this.addCompetitorView, this );
	},

	addCompetitorView: function( competitor ) {
		this.views.add( '.competitors', new app.Views.Competitor({ model: competitor }) );
	}
});

// Competitor view
app.Views.Competitor = app.View.extend({
	className: "competitor",
	template: wp.template( "competitor" ),
	events: {
		'click img.competitor': 'vote'
	},

	initialize: function() {
		_.each( this.model.votes.models, this.addVoteView, this );
		this.listenTo( this.model.votes, 'add', this.addVoteView );
	},

	vote: function() {
		if ( app.data.loggedIn ) {
			this.model.votes.add( app.data.user );
		} else {
			alert( app.data.msg.pleaseLogIn );
		}
	},

	addVoteView: function( vote ) {
		this.views.add( '.votes', new app.Views.Vote({ model: vote }) );
	}
});

// Vote view
app.Views.Vote = app.View.extend({
	tagName: "li",
	template: wp.template( "vote" ),

	initialize: function() {
		this.listenTo( this.model, 'remove', this.remove );
	}
});

})(jQuery);
