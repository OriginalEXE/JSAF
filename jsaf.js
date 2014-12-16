/*!
 * JSAF by OriginalEXE
 * https://github.com/OriginalEXE/JSAF
 * MIT licenced
 */

window.JSAF = {

	actions: {}, // holds all actions
	filters: {}, // holds all filters
	functions: {}, // holds all functions

	add_action: function( hook, user_function, priority ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';
		
		if ( 'undefined' === typeof this.actions[ hook ] ) {

			this.actions[ hook ] = {};

		}

		if ( 'undefined' === typeof this.actions[ hook ][ priority ] ) {

			this.actions[ hook ][ priority ] = [];

		}

		this.actions[ hook ][ priority ].push( user_function );

	},

	add_filter: function( hook, user_function, priority ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';
		
		if ( 'undefined' === typeof this.filters[ hook ] ) {

			this.filters[ hook ] = {};

		}

		if ( 'undefined' === typeof this.filters[ hook ][ priority ] ) {

			this.filters[ hook ][ priority ] = [];

		}

		this.filters[ hook ][ priority ].push( user_function );

	},

	remove_action: function( hook, user_function, priority ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';

		if ( 'undefined' === typeof this.actions[ hook ] || 'undefined' === typeof this.actions[ hook ][ priority ] || -1 === jQuery.inArray( user_function, this.actions[ hook ][ priority ] ) ) {

			var removed = false;

		} else {

			this.actions[ hook ][ priority ].splice( jQuery.inArray( user_function, this.actions[ hook ][ priority ] ), 1 );

			var removed = true;

		}

		return removed;

	},

	remove_filter: function( hook, user_function, priority ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';

		if ( 'undefined' === typeof this.filters[ hook ] || 'undefined' === typeof this.filters[ hook ][ priority ] || -1 === jQuery.inArray( user_function, this.filters[ hook ][ priority ] ) ) {

			var removed = false;

		} else {

			this.filters[ hook ][ priority ].splice( jQuery.inArray( user_function, this.filters[ hook ][ priority ] ), 1 );

			var removed = true;

		}

		return removed;

	},

	do_action: function( hook, function_arguments ) {

		var that            = this,
			priority_sorted = [];

		function_arguments = 'undefined' !== typeof function_arguments ? function_arguments : [];

		if ( 'undefined' === typeof that.actions[ hook ] ) { // this hook is not used

			return;

		}

		jQuery.each( that.actions[ hook ], function( priority, user_functions ) {

			priority_sorted.push( Number( priority ) );

		});

		priority_sorted.sort( function( a, b ) { // sort priority array

			return a - b;

		});

		jQuery.each( priority_sorted, function( index, priority ) {

			jQuery.each( that.actions[ hook ][ priority ], function( index, user_function ) {

				if ( 'function' === typeof user_function ) {

					user_function.apply( null, function_arguments );

				}

			});

		});

	},

	apply_filters: function( hook, function_arguments ) {

		var that            = this,
			priority_sorted = [];

		function_arguments = 'undefined' !== typeof function_arguments ? function_arguments : [];

		if ( 'undefined' === typeof that.filters[ hook ] ) { // this hook is not used

			return function_arguments[ 0 ];

		}

		jQuery.each( that.filters[ hook ], function( priority, user_functions ) {

			priority_sorted.push( Number( priority ) );

		});

		priority_sorted.sort( function( a, b ) { // sort priority array

			return a - b;

		});

		jQuery.each( priority_sorted, function( index, priority ) {

			jQuery.each( that.filters[ hook ][ priority ], function( index, user_function ) {

				if ( 'function' === typeof user_function ) {

					user_function.apply( null, function_arguments );

				}

			});

		});

		return function_arguments[ 0 ];

	}

};