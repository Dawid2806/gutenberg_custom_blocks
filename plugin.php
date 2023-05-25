<?php

/**
 * Plugin Name: Burkhardt Plugin
 * Plugin URI: 
 * Description: Burkhardt Plugin — is a Gutenberg plugin created via create-guten-block.
 * Author: 
 * Author URI:
 * Version: 1.0.0
 * License: GPL2+
 *
 *
 * @package CGB
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path(__FILE__) . 'src/init.php';
