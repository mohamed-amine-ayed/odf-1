<?php
/**
 * Twenty Sixteen functions and definitions
 *
 * Set up the theme and provides some helper functions, which are used in the
 * theme as custom template tags. Others are attached to action and filter
 * hooks in WordPress to change core functionality.
 *
 * When using a child theme you can override certain functions (those wrapped
 * in a function_exists() call) by defining them first in your child theme's
 * functions.php file. The child theme's functions.php file is included before
 * the parent theme's file, so the child theme functions would be used.
 *
 * @link https://codex.wordpress.org/Theme_Development
 * @link https://codex.wordpress.org/Child_Themes
 *
 * Functions that are not pluggable (not wrapped in function_exists()) are
 * instead attached to a filter or action hook.
 *
 * For more information on hooks, actions, and filters,
 * {@link https://codex.wordpress.org/Plugin_API}
 *
 * @package WordPress
 * @subpackage ODF-theme-2
 * @since ODF-theme-2 1.0
 */

/**
 * Twenty Sixteen only works in WordPress 4.4 or later.
 */
if ( version_compare( $GLOBALS['wp_version'], '4.4-alpha', '<' ) ) {
	require get_template_directory() . '/inc/back-compat.php';
}

if ( ! function_exists( 'twentysixteen_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 *
 * Create your own twentysixteen_setup() function to override in a child theme.
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_setup() {
	/*
	 * Make theme available for translation.
	 * Translations can be filed at WordPress.org. See: https://translate.wordpress.org/projects/wp-themes/twentysixteen
	 * If you're building a theme based on Twenty Sixteen, use a find and replace
	 * to change 'twentysixteen' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'ODF-theme-2' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for custom logo.
	 *
	 *  @since Twenty Sixteen 1.2
	 */
	add_theme_support( 'custom-logo', array(
		'height'      => 240,
		'width'       => 240,
		'flex-height' => true,
	) );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link https://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 1200, 9999 );

	// This theme uses wp_nav_menu() in two locations.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'twentysixteen' ),
		'social'  => __( 'Social Links Menu', 'twentysixteen' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 *
	 * See: https://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'aside',
		'image',
		'video',
		'quote',
		'link',
		'gallery',
		'status',
		'audio',
		'chat',
	) );

	/*
	 * This theme styles the visual editor to resemble the theme style,
	 * specifically font, colors, icons, and column width.
	 */
	add_editor_style( array( 'css/editor-style.css', twentysixteen_fonts_url() ) );

	// Indicate widget sidebars can use selective refresh in the Customizer.
	add_theme_support( 'customize-selective-refresh-widgets' );
}
endif; // twentysixteen_setup
add_action( 'after_setup_theme', 'twentysixteen_setup' );

/**
 * Sets the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'twentysixteen_content_width', 840 );
}
add_action( 'after_setup_theme', 'twentysixteen_content_width', 0 );

/**
 * Registers a widget area.
 *
 * @link https://developer.wordpress.org/reference/functions/register_sidebar/
 *
 * @since Twenty Sixteen 1.0
 */
/*function twentysixteen_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'twentysixteen' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Add widgets here to appear in your sidebar.', 'twentysixteen' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Content Bottom 1', 'twentysixteen' ),
		'id'            => 'sidebar-2',
		'description'   => __( 'Appears at the bottom of the content on posts and pages.', 'twentysixteen' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Content Bottom 2', 'twentysixteen' ),
		'id'            => 'sidebar-3',
		'description'   => __( 'Appears at the bottom of the content on posts and pages.', 'twentysixteen' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'twentysixteen_widgets_init' );*/

if ( ! function_exists( 'twentysixteen_fonts_url' ) ) :
/**
 * Register Google fonts for Twenty Sixteen.
 *
 * Create your own twentysixteen_fonts_url() function to override in a child theme.
 *
 * @since Twenty Sixteen 1.0
 *
 * @return string Google fonts URL for the theme.
 */
function twentysixteen_fonts_url() {
	$fonts_url = '';
	$fonts     = array();
	$subsets   = 'latin,latin-ext';

	/* translators: If there are characters in your language that are not supported by Merriweather, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Merriweather font: on or off', 'twentysixteen' ) ) {
		$fonts[] = 'Merriweather:400,700,900,400italic,700italic,900italic';
	}

	/* translators: If there are characters in your language that are not supported by Montserrat, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Montserrat font: on or off', 'twentysixteen' ) ) {
		$fonts[] = 'Montserrat:400,700';
	}

	/* translators: If there are characters in your language that are not supported by Inconsolata, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Inconsolata font: on or off', 'twentysixteen' ) ) {
		$fonts[] = 'Inconsolata:400';
	}

	if ( $fonts ) {
		$fonts_url = add_query_arg( array(
			'family' => urlencode( implode( '|', $fonts ) ),
			'subset' => urlencode( $subsets ),
		), 'https://fonts.googleapis.com/css' );
	}

	return $fonts_url;
}
endif;

/**
 * Handles JavaScript detection.
 *
 * Adds a `js` class to the root `<html>` element when JavaScript is detected.
 *
 * @since Twenty Sixteen 1.0
 */
/*function twentysixteen_javascript_detection() {
	echo "<script>(function(html){html.className = html.className.replace(/\bno-js\b/,'js')})(document.documentElement);</script>\n";
}
add_action( 'wp_head', 'twentysixteen_javascript_detection', 0 );
*/
/**
 * Enqueues scripts and styles.
 *
 * @since Twenty Sixteen 1.0
 */
function twentysixteen_scripts() {
	// Add custom fonts, used in the main stylesheet.
	wp_enqueue_style( 'twentysixteen-fonts', twentysixteen_fonts_url(), array(), null );

	// Add Genericons, used in the main stylesheet.
	wp_enqueue_style( 'genericons', get_template_directory_uri() . '/genericons/genericons.css', array(), '3.4.1' );

	// Theme stylesheet.
	wp_enqueue_style( 'twentysixteen-style', get_stylesheet_uri() );

	// Load the Internet Explorer specific stylesheet.
	wp_enqueue_style( 'twentysixteen-ie', get_template_directory_uri() . '/css/ie.css', array( 'twentysixteen-style' ), '20160816' );
	wp_style_add_data( 'twentysixteen-ie', 'conditional', 'lt IE 10' );

	// Load the Internet Explorer 8 specific stylesheet.
	wp_enqueue_style( 'twentysixteen-ie8', get_template_directory_uri() . '/css/ie8.css', array( 'twentysixteen-style' ), '20160816' );
	wp_style_add_data( 'twentysixteen-ie8', 'conditional', 'lt IE 9' );

	// Load the Internet Explorer 7 specific stylesheet.
	wp_enqueue_style( 'twentysixteen-ie7', get_template_directory_uri() . '/css/ie7.css', array( 'twentysixteen-style' ), '20160816' );
	wp_style_add_data( 'twentysixteen-ie7', 'conditional', 'lt IE 8' );

	// Load the html5 shiv.
	wp_enqueue_script( 'twentysixteen-html5', get_template_directory_uri() . '/js/html5.js', array(), '3.7.3' );
	wp_script_add_data( 'twentysixteen-html5', 'conditional', 'lt IE 9' );

	wp_enqueue_script( 'custom', get_template_directory_uri() . '/js/custom.js', array(), '3.7.3' );

	// wp_enqueue_script( 'twentysixteen-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20160816', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	/*if ( is_singular() && wp_attachment_is_image() ) {
		wp_enqueue_script( 'twentysixteen-keyboard-image-navigation', get_template_directory_uri() . '/js/keyboard-image-navigation.js', array( 'jquery' ), '20160816' );
	}*/

	// wp_enqueue_script( 'twentysixteen-script', get_template_directory_uri() . '/js/functions.js', array( 'jquery' ), '20160816', true );

	wp_localize_script( 'twentysixteen-script', 'screenReaderText', array(
		'expand'   => __( 'expand child menu', 'twentysixteen' ),
		'collapse' => __( 'collapse child menu', 'twentysixteen' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'twentysixteen_scripts' );

/**
 * Adds custom classes to the array of body classes.
 *
 * @since Twenty Sixteen 1.0
 *
 * @param array $classes Classes for the body element.
 * @return array (Maybe) filtered body classes.
 */
function twentysixteen_body_classes( $classes ) {
	// Adds a class of custom-background-image to sites with a custom background image.
	if ( get_background_image() ) {
		$classes[] = 'custom-background-image';
	}

	// Adds a class of group-blog to sites with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	// Adds a class of no-sidebar to sites without active sidebar.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	return $classes;
}
add_filter( 'body_class', 'twentysixteen_body_classes' );

/**
 * Converts a HEX value to RGB.
 *
 * @since Twenty Sixteen 1.0
 *
 * @param string $color The original color, in 3- or 6-digit hexadecimal form.
 * @return array Array containing RGB (red, green, and blue) values for the given
 *               HEX code, empty array otherwise.
 */
function twentysixteen_hex2rgb( $color ) {
	$color = trim( $color, '#' );

	if ( strlen( $color ) === 3 ) {
		$r = hexdec( substr( $color, 0, 1 ).substr( $color, 0, 1 ) );
		$g = hexdec( substr( $color, 1, 1 ).substr( $color, 1, 1 ) );
		$b = hexdec( substr( $color, 2, 1 ).substr( $color, 2, 1 ) );
	} else if ( strlen( $color ) === 6 ) {
		$r = hexdec( substr( $color, 0, 2 ) );
		$g = hexdec( substr( $color, 2, 2 ) );
		$b = hexdec( substr( $color, 4, 2 ) );
	} else {
		return array();
	}

	return array( 'red' => $r, 'green' => $g, 'blue' => $b );
}

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Add custom image sizes attribute to enhance responsive image functionality
 * for content images
 *
 * @since Twenty Sixteen 1.0
 *
 * @param string $sizes A source size value for use in a 'sizes' attribute.
 * @param array  $size  Image size. Accepts an array of width and height
 *                      values in pixels (in that order).
 * @return string A source size value for use in a content image 'sizes' attribute.
 */
function twentysixteen_content_image_sizes_attr( $sizes, $size ) {
	$width = $size[0];

	if ( 840 <= $width ) {
		$sizes = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 62vw, 840px';
	}

	if ( 'page' === get_post_type() ) {
		if ( 840 > $width ) {
			$sizes = '(max-width: ' . $width . 'px) 85vw, ' . $width . 'px';
		}
	} else {
		if ( 840 > $width && 600 <= $width ) {
			$sizes = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 61vw, (max-width: 1362px) 45vw, 600px';
		} elseif ( 600 > $width ) {
			$sizes = '(max-width: ' . $width . 'px) 85vw, ' . $width . 'px';
		}
	}

	return $sizes;
}
add_filter( 'wp_calculate_image_sizes', 'twentysixteen_content_image_sizes_attr', 10 , 2 );

/**
 * Add custom image sizes attribute to enhance responsive image functionality
 * for post thumbnails
 *
 * @since Twenty Sixteen 1.0
 *
 * @param array $attr Attributes for the image markup.
 * @param int   $attachment Image attachment ID.
 * @param array $size Registered image size or flat array of height and width dimensions.
 * @return array The filtered attributes for the image markup.
 */
function twentysixteen_post_thumbnail_sizes_attr( $attr, $attachment, $size ) {
	if ( 'post-thumbnail' === $size ) {
		if ( is_active_sidebar( 'sidebar-1' ) ) {
			$attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 984px) 60vw, (max-width: 1362px) 62vw, 840px';
		} else {
			$attr['sizes'] = '(max-width: 709px) 85vw, (max-width: 909px) 67vw, (max-width: 1362px) 88vw, 1200px';
		}
	}
	return $attr;
}
add_filter( 'wp_get_attachment_image_attributes', 'twentysixteen_post_thumbnail_sizes_attr', 10 , 3 );

/**
 * Modifies tag cloud widget arguments to display all tags in the same font size
 * and use list format for better accessibility.
 *
 * @since Twenty Sixteen 1.1
 *
 * @param array $args Arguments for tag cloud widget.
 * @return array The filtered arguments for tag cloud widget.
 */
function twentysixteen_widget_tag_cloud_args( $args ) {
	$args['largest']  = 1;
	$args['smallest'] = 1;
	$args['unit']     = 'em';
	$args['format']   = 'list'; 

	return $args;
}
add_filter( 'widget_tag_cloud_args', 'twentysixteen_widget_tag_cloud_args' );

















if ( !class_exists( 'ReduxFramework' ) && file_exists( dirname( __FILE__ ) . '/theme_options/ReduxCore/framework.php' ) ) {
    require_once( dirname( __FILE__ ) . '/theme_options/ReduxCore/framework.php' );
}
if ( !isset( $redux_demo ) && file_exists( dirname( __FILE__ ) . '/theme_options/test_theme/sample-config.php' ) ) {
    require_once( dirname( __FILE__ ) . '/theme_options/test_theme/sample-config.php' );
}


//show block last post
function ontex_post($atts){
    $news_atts = shortcode_atts( array(
    'tag' => 'quality',
    'template' =>'1'
    ), $atts );
    $tag = str_replace(' ','-',$news_atts['tag']);
    $args = array(
    'posts_per_page'=>1,
    'numberposts'     => 1,
    'offset'          => 0,
    'orderby'         => 'post_date',
    'order'           => 'DESC',
    'post_status'     => 'publish'
    );
    $query = new WP_Query($args);
    if ($query->have_posts()) :
        while ($query -> have_posts()) : $query -> the_post();
            ob_start();
			?>
			<div class="content-box">
				<div class="row">
					<div class="col-md-6 content-box-left ">
						<!-- <img class="image-box" src="<?php echo get_template_directory_uri() ?>/images/bebe.png" /> -->
						<?php the_post_thumbnail('full'); ?>
					</div>
					<div class="col-md-6 content-box-right bg-cl-site">
						<div class="box-text-content">
							<h2><?php the_title() ?></h2>
							<br>
							<?php the_excerpt() ?>
							<a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>" class="btn-go"></a>
						</div>
					</div>
				</div>
			</div>
			<?php
        endwhile;
    endif;
    return ob_get_clean();
}

function ontex_post_sans_bordure($atts){
    $news_atts = shortcode_atts( array(
    'tag' => 'quality',
    'template' =>'1'
    ), $atts );
    $tag = str_replace(' ','-',$news_atts['tag']);
    $args = array(
    'posts_per_page'=>1,
    'numberposts'     => 1,
    'offset'          => 0,
    'orderby'         => 'post_date',
    'order'           => 'DESC',
    'post_status'     => 'publish'
    );
    $query = new WP_Query($args);
    if ($query->have_posts()) :
        while ($query -> have_posts()) : $query -> the_post();
            ob_start();
			?>
			<div class="content-box">
				<h2><?php the_title() ?></h2>
				<div class="row">
					<div class="col-md-7">
						<?php the_excerpt() ?>
					</div>
					<div class="col-md-5">
						<img src="<?php the_post_thumbnail('full'); ?>" />
					</div>
				</div>
			</div>
			<?php
        endwhile;
    endif;
    return ob_get_clean();
}
function register_my_shortcodes(){
    add_shortcode('ontex_post', 'ontex_post'); //show last post
    add_shortcode('ontex_post_sans_bordure', 'ontex_post_sans_bordure'); //show last post
}
add_action('init', 'register_my_shortcodes');




// Before VC Init
add_action( 'vc_before_init', 'vc_before_init_actions' );
function vc_before_init_actions() {
    // Require new custom Element
    require_once( get_template_directory() . '/includes_vc_elements.php' ); 
     
}


//show latest 4 news
add_shortcode('ontex_latest_4_news', 'ontex_latest_4_news'); //show latest 4 news
function ontex_latest_4_news($atts)
{

    $news_atts = shortcode_atts(array(
        'template' => '1'
    ), $atts);

    $args = array(
        'posts_per_page' => 4,
        'numberposts' => 4,
        'offset' => 0,
        'orderby' => 'post_date',
        'order' => 'DESC',
        //'include'         => ,
        //'exclude'         => ,
        //'meta_key'        => ,
        //'meta_value'      => ,
        'post_type' => 'post',
        //'post_mime_type'  => ,
        //'post_parent'     => ,
        'post_status' => 'publish',
        'suppress_filters' => false
    );
    $query = new WP_Query($args);


    if ($query->have_posts()) :

        $i = 0;

        ob_start();

        while ($query->have_posts() && $i < 4) : $query->the_post();
            if ( $i % 2 == 0 ) {
                get_template_part('template-parts/post', 'part1');
            }

            get_template_part('template-parts/post', 'part2');

            $ontextype = get_post_meta(get_the_ID(), 'ontex-type', true);
            switch ($ontextype) {
                case '1' :
                    get_template_part('template-parts/post', 'model1');
                    break;
                case '2' :
                    get_template_part('template-parts/post', 'model2');
                    break;
                case '3' :
                    get_template_part('template-parts/post', 'model3');
                    break;
                case '4' :
                    get_template_part('template-parts/post', 'model4');
                    break;

                default :
                    get_template_part('template-parts/post', 'model1');
                    break;
            }

            get_template_part('template-parts/post', 'part3');

            if ($i % 2 != 0) {
                get_template_part('template-parts/post', 'part4');
            }

            $i++;


        endwhile;
    endif;
    return ob_get_clean();
}


//show ontex price on homepage
add_shortcode('ontex_price', 'ontex_price');//[ontex-price params]
function ontex_price()
{

    $service_url = 'http://ir.euroinvestor.com/ServiceEngine/api/xml/reply/RequestStockDataBundle?ApiVersion=1&CustomerKey=ontex&SolutionID=2260&instrumentTypes=Listing';
    // $xml = simplexml_load_file($service_url) or die("feed not loading");
    $xml = simplexml_load_file($service_url);
    $priceData = $xml->Data->InstrumentEntry;
    $output = '<div class="stock-content">
            <div class="stock-value">€' . number_format((float)$priceData->LastTradePrice, 2, '.', '') . '</div>
            <div class="stock-date">' . $priceData->Change . ' (' . number_format((float)$priceData->ChangePercent, 2, '.', '') . '%) ' . date('H:i', strtotime($priceData->Timestamp)) . ' PM CEST</div>';
    if (explode('/', get_site_url())[3] == 'mx') {
        $html_text = 'Información accionistas';
    } elseif (explode('/', get_site_url())[3] == 'br') {
        $html_text = 'Informação do acionista';
    } else {
        $html_text = 'Investors information';
    }
    $output .= '<a href="http://www.ontexglobal.com/investors" class="stakeholder-link">' . $html_text . '</a></div>';
    return $output;
}

/* backend text colored with custom colors in wysiwyg editor */
    function my_mce4_options($init) {

        $custom_colours = '
            "000000", "Black",
            "FFFFFF", "White",
            "2799D6" , "Baby Care",
            "e73182" , "Feminine Care",
            "89bd23" , "Mature Markets Retail",
            "7b2584" , "Healthcare",
            "f18904" , "Growth Markets",
            "009a83" , "Americas Retail",
            "022169" , "dark blue",
            "FFCD00" , "yellow",
            "17A5A2" , "teal "
        ';

        // build colour grid default+custom colors
        $init['textcolor_map'] = '['.$custom_colours.']';

        // change the number of rows in the grid if the number of colors changes
        // 8 swatches per row
        $init['textcolor_rows'] = 5;
        $init['textcolor_cols'] = 5;

        return $init;
    }
    add_filter('tiny_mce_before_init', 'my_mce4_options');
/* backend text colored with custom colors in wysiwyg editor */


// Register Custom Post Type
function custom_post_type() {

    // Advices
    $labels = array(
        'name'                  => _x( 'Advices', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Advice', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Advices', 'text_domain' ),
        'name_admin_bar'        => __( 'Advices', 'text_domain' ),
        'archives'              => __( 'Advice Archives', 'text_domain' ),
        'attributes'            => __( 'Advice Attributes', 'text_domain' ),
        'parent_item_colon'     => __( 'Parent Advice:', 'text_domain' ),
        'all_items'             => __( 'All Advices', 'text_domain' ),
        'add_new_item'          => __( 'Add New Advice', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Advice', 'text_domain' ),
        'edit_item'             => __( 'Edit Advice', 'text_domain' ),
        'update_item'           => __( 'Update Advice', 'text_domain' ),
        'view_item'             => __( 'View Advice', 'text_domain' ),
        'view_items'            => __( 'View Advices', 'text_domain' ),
        'search_items'          => __( 'Search Advice', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
        'featured_image'        => __( 'Featured Image', 'text_domain' ),
        'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
        'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
        'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
        'insert_into_item'      => __( 'Insert into advice', 'text_domain' ),
        'uploaded_to_this_item' => __( 'Uploaded to this advice', 'text_domain' ),
        'items_list'            => __( 'Advices list', 'text_domain' ),
        'items_list_navigation' => __( 'Advices list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter advices list', 'text_domain' ),
    );
    $args = array(
        'label'                 => __( 'Advice', 'text_domain' ),
        'description'           => __( 'Advice Description', 'text_domain' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'thumbnail' ),
            'taxonomies' => array( 'category', 'post_tag' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'page',
    );
    register_post_type( 'advice', $args );
    register_taxonomy( 'advice_category', // register custom taxonomy - quote category
        'advices',
        array( 'hierarchical' => true,
            'label' => __( 'advices categories' )
        )
    );
    register_taxonomy( 'advice_tag', // register custom taxonomy - quote tag
        'advices',
        array( 'hierarchical' => false,
            'label' => __( 'advices tags' )
        )
    );



    // products details
    $labels_product_details = array(
        'name'                  => _x( 'Products Details', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Product Details', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Products Details', 'text_domain' ),
        'name_admin_bar'        => __( 'Products Details', 'text_domain' ),
        'archives'              => __( 'Product Details Archives', 'text_domain' ),
        'attributes'            => __( 'Product Details Attributes', 'text_domain' ),
        'parent_item_colon'     => __( 'Parent Product Details:', 'text_domain' ),
        'all_items'             => __( 'All Products Details', 'text_domain' ),
        'add_new_item'          => __( 'Add New Product Details', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Product Details', 'text_domain' ),
        'edit_item'             => __( 'Edit Product Details', 'text_domain' ),
        'update_item'           => __( 'Update Product Details', 'text_domain' ),
        'view_item'             => __( 'View Product Details', 'text_domain' ),
        'view_items'            => __( 'View Products Details', 'text_domain' ),
        'search_items'          => __( 'Search Product Details', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
        'featured_image'        => __( 'Featured Image', 'text_domain' ),
        'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
        'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
        'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
        'insert_into_item'      => __( 'Insert into product details', 'text_domain' ),
        'uploaded_to_this_item' => __( 'Uploaded to this product details', 'text_domain' ),
        'items_list'            => __( 'Products Details list', 'text_domain' ),
        'items_list_navigation' => __( 'Products Details list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter products details list', 'text_domain' ),
    );
    $args_product_details = array(
        'label'                 => __( 'Product Details', 'text_domain' ),
        'description'           => __( 'Product Details Description', 'text_domain' ),
        'labels'                => $labels_product_details,
        'supports'              => array( 'title', 'editor', 'thumbnail' ),
            'taxonomies' => array( 'product_details_category', 'product_details_tag' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'page',
    );
    register_post_type( 'product_details', $args_product_details );
    register_taxonomy( 'product_details_category', // register custom taxonomy - quote category
        'products_details',
        array( 'hierarchical' => true,
            'label' => __( 'products_details categories' )
        )
    );
    register_taxonomy( 'product_details_tag', // register custom taxonomy - quote tag
        'products_details',
        array( 'hierarchical' => false,
            'label' => __( 'products_details tags' )
        )
    );

    // Our brands
    $labels_brand = array(
        'name'                  => _x( 'Brands', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Brand', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Brands', 'text_domain' ),
        'name_admin_bar'        => __( 'Brands', 'text_domain' ),
        'archives'              => __( 'Brand Archives', 'text_domain' ),
        'attributes'            => __( 'Brand Attributes', 'text_domain' ),
        'parent_item_colon'     => __( 'Parent Brand:', 'text_domain' ),
        'all_items'             => __( 'All Brands', 'text_domain' ),
        'add_new_item'          => __( 'Add New Brand', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Brand', 'text_domain' ),
        'edit_item'             => __( 'Edit Brand', 'text_domain' ),
        'update_item'           => __( 'Update Brand', 'text_domain' ),
        'view_item'             => __( 'View Brand', 'text_domain' ),
        'view_items'            => __( 'View Brands', 'text_domain' ),
        'search_items'          => __( 'Search Brand', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
        'featured_image'        => __( 'Featured Image', 'text_domain' ),
        'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
        'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
        'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
        'insert_into_item'      => __( 'Insert into brand', 'text_domain' ),
        'uploaded_to_this_item' => __( 'Uploaded to this brand', 'text_domain' ),
        'items_list'            => __( 'Brands list', 'text_domain' ),
        'items_list_navigation' => __( 'Brands list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter brands list', 'text_domain' ),
    );
    $args_brand = array(
        'label'                 => __( 'Brand', 'text_domain' ),
        'description'           => __( 'Brand Description', 'text_domain' ),
        'labels'                => $labels_brand,
        'supports'              => array( 'title', 'editor', 'thumbnail' ),
            'taxonomies' => array( 'brand_category', 'brand_tag' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'page',
    );
    register_post_type( 'brand', $args_brand );
    register_taxonomy( 'brand_category', // register custom taxonomy - quote category
        'brands',
        array( 'hierarchical' => true,
            'label' => __( 'brands categories' )
        )
    );
    register_taxonomy( 'brand_tag', // register custom taxonomy - quote tag
        'brands',
        array( 'hierarchical' => false,
            'label' => __( 'brands tags' )
        )
    );

    // Our applications
    $labels_application = array(
        'name'                  => _x( 'Applications', 'Post Type General Name', 'text_domain' ),
        'singular_name'         => _x( 'Application', 'Post Type Singular Name', 'text_domain' ),
        'menu_name'             => __( 'Applications', 'text_domain' ),
        'name_admin_bar'        => __( 'Applications', 'text_domain' ),
        'archives'              => __( 'Application Archives', 'text_domain' ),
        'attributes'            => __( 'Application Attributes', 'text_domain' ),
        'parent_item_colon'     => __( 'Parent Application:', 'text_domain' ),
        'all_items'             => __( 'All Applications', 'text_domain' ),
        'add_new_item'          => __( 'Add New Application', 'text_domain' ),
        'add_new'               => __( 'Add New', 'text_domain' ),
        'new_item'              => __( 'New Application', 'text_domain' ),
        'edit_item'             => __( 'Edit Application', 'text_domain' ),
        'update_item'           => __( 'Update Application', 'text_domain' ),
        'view_item'             => __( 'View Application', 'text_domain' ),
        'view_items'            => __( 'View Applications', 'text_domain' ),
        'search_items'          => __( 'Search Application', 'text_domain' ),
        'not_found'             => __( 'Not found', 'text_domain' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
        'featured_image'        => __( 'Featured Image', 'text_domain' ),
        'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
        'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
        'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
        'insert_into_item'      => __( 'Insert into application', 'text_domain' ),
        'uploaded_to_this_item' => __( 'Uploaded to this application', 'text_domain' ),
        'items_list'            => __( 'Applications list', 'text_domain' ),
        'items_list_navigation' => __( 'Applications list navigation', 'text_domain' ),
        'filter_items_list'     => __( 'Filter applications list', 'text_domain' ),
    );
    $args_application = array(
        'label'                 => __( 'Application', 'text_domain' ),
        'description'           => __( 'Application Description', 'text_domain' ),
        'labels'                => $labels_application,
        'supports'              => array( 'title', 'editor', 'thumbnail' ),
            'taxonomies' => array( 'application_category', 'application_tag' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'page',
    );
    register_post_type( 'application', $args_application );
    register_taxonomy( 'application_category', // register custom taxonomy - quote category
        'applications',
        array( 'hierarchical' => true,
            'label' => __( 'applications categories' )
        )
    );
    register_taxonomy( 'application_tag', // register custom taxonomy - quote tag
        'applications',
        array( 'hierarchical' => false,
            'label' => __( 'applications tags' )
        )
    );


}
add_action( 'init', 'custom_post_type', 0 );

 

function odf_woocommerce_support() {
	add_theme_support( 'woocommerce' );
}
add_action( 'after_setup_theme', 'mytheme_add_woocommerce_support' );


if ( ! function_exists( 'odf_is_woocommerce_activated' ) ) {
	function odf_is_woocommerce_activated() {
		if ( class_exists( 'woocommerce' ) ) { return true; } else { return false; }
	}
}


add_shortcode('find_a_local_shop','find_a_local_shop');
function find_a_local_shop(){
	?>
	<form class="find_a_local_shop"  action="/" method="get" accept-charset="utf-8">
		<div class="find_a_local_shop_titre">
			<div class="vc_col-sm-4">
				<img width="19" height="27" src="<?php echo get_template_directory_uri() ?>/images/f.png" class="vc_single_image-img attachment-thumbnail" alt="">
			</div>
			<div class="vc_col-sm-8">
				<h5><span> Find a local shop</span></h5>
			</div>

		</div>
		<div class="block_your_location">
			<label for="your_location">Your location</label>
			<input id="your_location" type="text" name="location" value="" placeholder="EnterCity, State or Portal code">
		</div>
		
		<div class="block_location_within">
			<label for="location_within">Within</label>
			<select id="location_within" name="location_within">
				<option value="5">5 miles</option>
				<option value="10">10 miles</option>
				<option value="15">15 miles</option>
			</select>
		</div>
		<input id="input_location_submit" type="submit" name="submit" value="Find shop">
		
	</form>

	<?php
}

// add_action('woocommerce_after_shop_loop_item', 'my_print_stars' );
add_shortcode('show_product_rating_stars','show_product_rating_stars');
function show_product_rating_stars(){
    global $wpdb;
    global $post;
    $count = $wpdb->get_var("
	    SELECT COUNT(meta_value) FROM $wpdb->commentmeta
	    LEFT JOIN $wpdb->comments ON $wpdb->commentmeta.comment_id = $wpdb->comments.comment_ID
	    WHERE meta_key = 'rating'
	    AND comment_post_ID = $post->ID
	    AND comment_approved = '1'
	    AND meta_value > 0
	");

	$rating = $wpdb->get_var("
	    SELECT SUM(meta_value) FROM $wpdb->commentmeta
	    LEFT JOIN $wpdb->comments ON $wpdb->commentmeta.comment_id = $wpdb->comments.comment_ID
	    WHERE meta_key = 'rating'
	    AND comment_post_ID = $post->ID
	    AND comment_approved = '1'
	");

	if ( $count > 0 ) {

	    $average = number_format($rating / $count, 2);

	    echo '<div class="starwrapper" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">';

	    echo '<span class="star-rating" title="'.sprintf(__('Rated %s out of 5', 'woocommerce'), $average).'"><span style="width:'.($average*16).'px"><span itemprop="ratingValue" class="rating">'.$average.'</span> </span></span>';

	    echo '</div>';
    }
    $average = 1;
    echo '<div class="starwrapper" itemprop="aggregateRating" itemscope itemtype="http://schema.org/AggregateRating">';

	    echo '<span class="star-rating" title="'.sprintf(__('Rated %s out of 5', 'woocommerce'), $average).'"><span style="width:'.($average*16).'px"><span itemprop="ratingValue" class="rating">'.$average.'</span> </span></span>';

	    echo '</div>';

}

add_shortcode('slider_button_details_product','slider_button_details_product');
function slider_button_details_product(){

    global $product;
    
    echo '<a href="/product/" class="slider_button_details_product">Details</a>';
}

add_shortcode('slider_button_buy_product','slider_button_buy_product');
function slider_button_buy_product(){

    global $product;
    
    echo '<a href="/product/" class="slider_button_buy_product">Buy</a>';
}

add_shortcode('button_catalog_access','button_catalog_access');
function button_catalog_access(){

    global $product;
    
    echo '<a href="/catalog/" class="button_catalog_access">Catalog access</a>';
}

add_shortcode('theme2_all_advice','theme2_all_advice');
function theme2_all_advice(){
    ?>
    <div class="theme2_all_advice">
    	<div class="vc_col-sm-8">
    		<div class="alladvices block_header">
    			ALL ADVICES
    		</div>
    		<h3>TITLE ADVICE 1</h3>
    		<p>
	    		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
	    	</p>
    	</div>
    	<div class="vc_col-sm-4">
    		
    	</div>
    </div>
    <?php
}

add_shortcode('theme2_faq','theme2_faq');
function theme2_faq(){
    ?>
    <div class="theme2_faq">
    	<div class="vc_col-sm-12" style="margin-bottom: 10px;">
    		<div class="vc_col-sm-6 block_header">
    			FAQ
    		</div>
    		<div class="vc_col-sm-6">
    			<a href="/page-is-under-construction/" class="button_allfaq">ALL FAQ</a>
    		</div>
    	</div>
    	<div class="vc_col-sm-12 div_lorem_ipsum_plus">
    		<p>Le lorem Ipsum </p>
    		<span>+</span>
    	</div>
    	<div class="vc_col-sm-12 div_lorem_ipsum_plus">
    		<p>Le lorem Ipsum </p>
    		<span>+</span>
    	</div>
    	<div class="vc_col-sm-12 div_lorem_ipsum_plus">
    		<p>Le lorem Ipsum </p>
    		<span>+</span>
    	</div>
    	<div class="vc_col-sm-12 div_lorem_ipsum_plus">
    		<p>Le lorem Ipsum </p>
    		<span>+</span>
    	</div>
    </div>
    <?php
}


add_shortcode('custom_page_products_list','custom_page_products_list');
function custom_page_products_list(){
	get_template_part('template-parts/custom', 'products_list');
}

add_shortcode('custom_page_single_product','custom_page_single_product');
function custom_page_single_product(){
	get_template_part('template-parts/custom', 'single_product');
}

add_shortcode('custom_page_single_product_sheet','custom_page_single_product_sheet');
function custom_page_single_product_sheet(){
	get_template_part('template-parts/custom', 'single_product_sheet');
}

add_shortcode('custom_popup_form','custom_popup_form');
function custom_popup_form(){
	get_template_part('template-parts/custom', 'popup_form');
}