<?php
/*
Plugin Name: Showdown (for WordCamp SF 2014)
Author: Mark Jaquith
*/

class WCSF_2014_Showdown_Plugin {
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
		// add hooks
	}
}

WCSF_2014_Showdown_Plugin::get_instance();
