<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         ' xFe:cm&oQqwj6.g VetHwC%rZdKk-B/oqzTX>/ZHoHP`K_>Tmw2j(4[#alY{X}]');
define('SECURE_AUTH_KEY',  'Uaw,>;ii53)89oh=V:5l~^<W$+?WK.LGtTOc2 _C?X$W (v[oxj)4&I;$X.8PkQQ');
define('LOGGED_IN_KEY',    'iT)jLuT^3q?[`T>MRR,|(.`gv.+0aA,hV)M.KE|Dv<RL:x5 EQg1_dImJSitd;;2');
define('NONCE_KEY',        'tQ[Y_E#v64(*v`pvhH;<t)2AS<Wb%:@%O@w>MP@-v_5?}C>}{s~jB*|ZA-sg%,.]');
define('AUTH_SALT',        'Q(>JC!#qc#[BUh*E7|Q{PUeBExzzI?K!<aZA(R#jnp]cV#u]#HWL<A)Uqo[_JN[x');
define('SECURE_AUTH_SALT', '%te4F=Gl:$Fm7Zv<vB<ORuYu:u;xA%qvUE_2803<|{3zp5JH<=eX*d*`?JVG#ob~');
define('LOGGED_IN_SALT',   '0T7G#|}Z.5^LelGua{b}a@nOU>Gk $==TDS)01}Mp=<z1jKkcRqspzuykW(Yq].J');
define('NONCE_SALT',       'uU|tV#,6qlL<H_;5kBGhHzE^!2yxtrGz6X!q$mn=fMk:YipQx_^cfcngX@XcrNS[');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
