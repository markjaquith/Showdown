<?php
/*
Plugin Name: Showdown (for WordCamp SF 2014)
Author: Mark Jaquith
*/

class WCSF_2014_Showdown_Plugin {
	static protected $instance;

	protected function __construct() {
		add_action( 'plugins_loaded', array( $this, 'plugins_loaded' ) );
	}

	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self;
		}
		return self::$instance;
	}

	public function plugins_loaded() {
		add_action( 'init', array( $this, 'add_shortcode' ) );
		add_action( 'init', array( $this, 'register_tax' ) );
		add_action( 'init', array( $this, 'register_cpt' ) );
		add_filter( 'the_posts', array( $this, 'the_posts' ) );
	}

	public function the_posts( $posts ) {
		foreach ( $posts as $p ) {
			if ( false !== strpos( $p->post_content, '[showdown]' ) ) {
				wp_enqueue_script( 'showdown', plugin_dir_url( __FILE__ ) . 'js/showdown.js', array( 'wp-backbone' ), '1.0' );
			}
		}
		return $posts;
	}

	public function add_shortcode() {
		add_shortcode( 'showdown', array( $this, 'shortcode' ) );
	}

	public function register_tax() {
		$labels = array(
			'name'                       => _x( 'Competitions', 'Taxonomy General Name', 'showdown' ),
			'singular_name'              => _x( 'Competition', 'Taxonomy Singular Name', 'showdown' ),
			'menu_name'                  => __( 'Competitions', 'showdown' ),
			'all_items'                  => __( 'All Competitions', 'showdown' ),
			'parent_item'                => __( 'Parent Competition', 'showdown' ),
			'parent_item_colon'          => __( 'Parent Competition:', 'showdown' ),
			'new_item_name'              => __( 'New Competition', 'showdown' ),
			'add_new_item'               => __( 'Add New Competition', 'showdown' ),
			'edit_item'                  => __( 'Edit Competition', 'showdown' ),
			'update_item'                => __( 'Update Competition', 'showdown' ),
			'separate_items_with_commas' => __( 'Separate competitions with commas', 'showdown' ),
			'search_items'               => __( 'Search Competitions', 'showdown' ),
			'add_or_remove_items'        => __( 'Add or remove competitions', 'showdown' ),
			'choose_from_most_used'      => __( 'Choose from the most used competitions', 'showdown' ),
			'not_found'                  => __( 'Not Found', 'showdown' ),
		);
		$args = array(
			'labels'                     => $labels,
			'hierarchical'               => false,
			'public'                     => true,
			'show_ui'                    => true,
			'show_admin_column'          => true,
			'show_in_nav_menus'          => false,
			'show_tagcloud'              => false,
			'rewrite'                    => false,
		);
		register_taxonomy( 'competition', array('competitor'), $args );
	}

	public function register_cpt() {
		$labels = array(
			'name'                => _x( 'Competitors', 'Post Type General Name', 'showdown' ),
			'singular_name'       => _x( 'Competitor', 'Post Type Singular Name', 'showdown' ),
			'menu_name'           => __( 'Competions', 'showdown' ),
			'parent_item_colon'   => __( 'Parent Competitor:', 'showdown' ),
			'all_items'           => __( 'All Competitors', 'showdown' ),
			'view_item'           => __( 'View Competitor', 'showdown' ),
			'add_new_item'        => __( 'Add New Competitor', 'showdown' ),
			'add_new'             => __( 'Add Competitor', 'showdown' ),
			'edit_item'           => __( 'Edit Competitor', 'showdown' ),
			'update_item'         => __( 'Update Competitor', 'showdown' ),
			'search_items'        => __( 'Search Competitors', 'showdown' ),
			'not_found'           => __( 'Not found', 'showdown' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'showdown' ),
		);
		$args = array(
			'label'               => __( 'showdown_competitor', 'showdown' ),
			'description'         => __( 'Competitors in a showdown', 'showdown' ),
			'labels'              => $labels,
			'menu_icon'           => 'dashicons-format-gallery',
			'supports'            => array( 'title', 'thumbnail', ),
			'taxonomies'          => array( 'competition' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'rewrite'             => false,
			'capability_type'     => 'page',
		);
		register_post_type( 'showdown_competitor', $args );
	}

	public function json_data() {
		return (object) array(
			'competitions' => array(
				'cats' => array(
					'angry' => array(
						'name' => 'Angry',
						'votes' => array(
							array(
								'name' => 'John',
								'gravatar' => 'abc123',
							),
							array(
								'name' => 'Mary',
								'gravatar' => 'abc123',
							),
						),
					),
					'fluffy' => array(
						'name' => 'Fluffy',
						'votes' => array(),
					),
				)
			)
		);
	}

	public function shortcode() {
		$return  = "<p>Showdown</p>\n";
		$return .= '<div class="showdown-plugin"></div>';
		$return .= '<script>showdownPlugin.start(' . json_encode( $this->json_data() ) . ');</script>';
		return $return;
	}
}

WCSF_2014_Showdown_Plugin::get_instance();
