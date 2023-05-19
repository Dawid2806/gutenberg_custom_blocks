<?php

/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function my_block_cgb_block_assets()
{ // phpcs:ignore
	// Register block styles for both frontend + backend.
	wp_register_style(
		'my_block-cgb-style-css', // Handle.
		plugins_url('dist/blocks.style.build.css', dirname(__FILE__)), // Block style CSS.
		is_admin() ? array('wp-editor') : null, // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'my_block-cgb-block-js', // Handle.
		plugins_url('/dist/blocks.build.js', dirname(__FILE__)), // Block.build.js: We register the block here. Built with Webpack.
		array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor'), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'my_block-cgb-block-editor-css', // Handle.
		plugins_url('dist/blocks.editor.build.css', dirname(__FILE__)), // Block editor CSS.
		array('wp-edit-blocks'), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'my_block-cgb-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path(__DIR__),
			'pluginDirUrl'  => plugin_dir_url(__DIR__),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'test/test',
		array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'my_block-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'my_block-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'my_block-cgb-block-editor-css',
		)
	);
}

// Hook: Block assets.
add_action('init', 'my_block_cgb_block_assets');
function render_my_block($attributes, $content)
{
	$selectedPostType = $attributes['selectedPostType'];

	$args = array(
		'post_type' => $selectedPostType,
		'posts_per_page' => 5,
	);

	$query = new WP_Query($args);

	if ($query->have_posts()) {
		$output = '';
		while ($query->have_posts()) {
			$query->the_post();
			$output .= '<h2>' . get_the_title() . '</h2>';
			$output .= '<p>' . get_the_excerpt() . '</p>';
		}
		wp_reset_postdata();
		return $output;
	} else {
		return 'No posts found.';
	}
}

function register_my_block()
{
	if (function_exists('register_block_type')) {
		register_block_type('query_karriere/query_karriere.js', array(
			'render_callback' => 'render_my_block',
		));
	}
}

add_action('init', 'register_my_block');

// Query Karriere init


function cgb_render_daveblock($attributes)
{
	$postType = isset($attributes['postType']) ? $attributes['postType'] : 'post';
	$postsToShow = isset($attributes['postsToShow']) ? $attributes['postsToShow'] : -1;
	$order = isset($attributes['order']) ? $attributes['order'] : 'DESC';

	$posts = get_posts(array(
		'post_type' => $postType,
		'numberposts' => $postsToShow,
		'order' => $order,
	));

	if (count($posts) === 0) {
		return 'No posts';
	}

	$title = isset($attributes['title']) ? $attributes['title'] : '';
	$output = '';

	foreach ($posts as $post) {
		$customFieldValue = get_field('standort', $post->ID);
		$permalink = get_permalink($post->ID);
		$output .= '<div class="karriere_item"><span>/</span><div><a href="' . $permalink . '"><h3>' . get_the_title($post) . '</h3></a>' . '<p>' . $customFieldValue . '<p>' . '</div></div>'; // Dodanie linku do tytułu
	}

	return $output;
}

register_block_type('cgb/daveblock', array(
	'render_callback' => 'cgb_render_daveblock',
));



// Query news init

function cgb_render_query_news($attributes)
{
	$postType = isset($attributes['postType']) ? $attributes['postType'] : 'post';
	$postsToShow = isset($attributes['postsToShow']) ? $attributes['postsToShow'] : -1;
	$order = isset($attributes['order']) ? $attributes['order'] : 'DESC';

	$posts = get_posts(array(
		'post_type' => $postType,
		'numberposts' => $postsToShow,
		'order' => $order,
	));

	if (count($posts) === 0) {
		return 'No posts';
	}

	$title = isset($attributes['title']) ? $attributes['title'] : '';
	$output = '';

	foreach ($posts as $post) {
		$permalink = get_permalink($post->ID);
		$content = apply_filters('the_content', get_the_content(null, false, $post->ID));
		$content = mb_substr(strip_tags($content), 0, 250) . '...';

		$thumbnail = get_the_post_thumbnail_url($post->ID);
		$date = get_the_date('d.m.Y', $post->ID);
		$output .= '<div class="post-container">';
		if ($thumbnail) {
			$output .= '<div class="post-image"><img src="' . $thumbnail . '" /></div>';
		}
		$output .= '<div class="post-content">';
		$output .= '<span class="post-date">' . $date . '</span>';
		$output .= '<h4>' . get_the_title($post) . '</h4>';
		if ($content) {
			$output .= '<div class="post-fullcontent">' . $content . '</div>';
		}
		$output .= '<a href="' . $permalink . '">weiterlesen</a>';
		$output .= '</div>';
		$output .= '</div>';
	}

	return $output;
}

register_block_type('cgb/querynews', array(
	'render_callback' => 'cgb_render_query_news',
));


function cgb_render_portfolio_block($attributes)
{
	$postType = isset($attributes['postType']) ? $attributes['postType'] : 'portfolio';
	$postsToShow = isset($attributes['postsToShow']) ? $attributes['postsToShow'] : -1;
	$order = isset($attributes['order']) ? $attributes['order'] : 'DESC';

	$posts = get_posts(array(
		'post_type' => $postType,
		'numberposts' => $postsToShow,
		'order' => $order,
	));

	if (count($posts) === 0) {
		return 'No portfolio items';
	}

	$output = '<div class="portfolio">';
	$first_post = array_shift($posts);
	$permalink = get_permalink($first_post->ID);
	$thumbnail = get_the_post_thumbnail_url($first_post->ID);
	$title = get_the_title($first_post);

	$output .= '<div class="first-post">';
	$output .= '<a  href="' . $permalink . '">';
	$output .= '<img src="' . $thumbnail . '" alt="' . $title . '">';
	$output .= '<p>' . $title . '</p>';
	$output .= '</a>';
	$output .= '</div>'; // Close the first post div

	$output .= '<div class="remaining-posts">'; // Start a new div for the remaining posts

	foreach ($posts as $post) {
		$permalink = '/einzelmaschinen//#' . sanitize_title(get_the_title($post));
		$thumbnail = get_the_post_thumbnail_url($post->ID);
		$title = get_the_title($post);

		$output .= '<div class="column-item">';
		$output .= '<a href="' . $permalink . '">';
		$output .= '<img src="' . $thumbnail . '" alt="' . $title . '">';
		$output .= '<p>' . $title . '</p>';
		$output .= '</a>';
		$output .= '</div>';
	}

	$output .= '</div>'; // Close the div for the remaining posts
	$output .= '</div>'; // Close the portfolio

	return $output;
}

register_block_type('cgb/portfolio', array(
	'attributes'      => array(
		'postsToShow' => array(
			'type'    => 'number',
			'default' => -1,
		),
		'order'      => array(
			'type'    => 'string',
			'default' => 'DESC',
		),
	),
	'render_callback' => 'cgb_render_portfolio_block',
));
