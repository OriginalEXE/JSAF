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

				if ( user_function.indexOf( '.' ) > -1 ) { // it's a user defined object

					var split  = user_function.split( '.' ),
						object = split[0],
						fn     = split[1];

					window[ object ][ fn ].apply( null, function_arguments );

				} else if ( 'function' === typeof that.functions[ user_function ] ) { // part of our object

					that.functions[ user_function ].apply( null, function_arguments );

				} else if ( 'function' === typeof window[ user_function ] ) { // global function

					window[ user_function ].apply( null, function_arguments );

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

				if ( user_function.indexOf( '.' ) > -1 ) { // it's a user defined object

					var split  = user_function.split( '.' ),
						object = split[0],
						fn     = split[1];

					function_arguments[ 0 ] = window[ object ][ fn ].apply( null, function_arguments );

				} else if ( 'function' === typeof that.functions[ user_function ] ) { // part of our object

					function_arguments[ 0 ] = that.functions[ user_function ].apply( null, function_arguments );

				} else if ( 'function' === typeof window[ user_function ] ) { // global function

					function_arguments[ 0 ] =  window[ user_function ].apply( null, function_arguments );

				}

			});

		});

		return function_arguments[ 0 ];

	}

};
