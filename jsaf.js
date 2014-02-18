/*!
 * JSAF by OriginalEXE
 * https://github.com/OriginalEXE/JSAF
 * MIT licenced
 */

window.JSAF = {

	actions: {}, // holds all actions
	filters: {}, // holds all filters
	functions: {}, // holds all functions
	temp: {}, // will hold actions or filters but only temporary

	add_action: function( hook, user_function, priority, is_filter ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';
		is_filter = 'undefined' !== typeof is_filter ? is_filter : false;

		this.temp = ( is_filter ? this.filters : this.actions );
		
		if ( 'undefined' === typeof this.temp[ hook ] ) {

			this.temp[ hook ] = {};

		}

		if ( 'undefined' === typeof this.temp[ hook ][ priority ] ) {

			this.temp[ hook ][ priority ] = [];

		}

		this.temp[ hook ][ priority ].push( user_function );

		is_filter ? this.filters = this.temp : this.actions = this.temp;
		this.temp = null;

	},

	add_filter: function( hook, user_function, priority ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';

		this.add_action( hook, user_function, priority, true );

	},

	remove_action: function( hook, user_function, priority, is_filter ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';
		is_filter = 'undefined' !== typeof is_filter ? is_filter : false;

		this.temp = ( is_filter ? this.filters : this.actions );

		if ( 'undefined' === typeof this.temp[ hook ] || 'undefined' === typeof this.temp[ hook ][ priority ] || -1 === jQuery.inArray( user_function, this.temp[ hook ][ priority ] ) ) {

			var removed = false;

		} else {

			this.temp[ hook ][ priority ].splice( jQuery.inArray( user_function, this.temp[ hook ][ priority ] ), 1 );

			var removed = true;

		}

		is_filter ? this.filters = this.temp : this.actions = this.temp;
		this.temp = null;

		return removed;

	},

	remove_filter: function( hook, user_function, priority ) {

		priority = 'undefined' !== typeof priority ? String( priority ) : '10';

		this.remove_action( hook, user_function, priority, true );

	},

	do_action: function( hook, function_arguments, is_filter ) {

		var that = this,
			priority_sorted = [];

		function_arguments = 'undefined' !== typeof function_arguments ? function_arguments : [];
		is_filter = 'undefined' !== typeof is_filter ? is_filter : false;

		this.temp = ( is_filter ? this.filters : this.actions );

		if ( 'undefined' === typeof that.temp[ hook ] ) { // this hook is not used

			if ( is_filter ) {

				return function_arguments[ 0 ];

			}

			return;

		}

		jQuery.each( that.temp[ hook ], function( priority, user_functions ) {

			priority_sorted.push( Number( priority ) );

		});

		priority_sorted.sort( function( a, b ) { // sort priority array

			return a - b;

		});

		jQuery.each( priority_sorted, function( index, priority ) {

			jQuery.each( that.temp[ hook ][ priority ], function( index, user_function ) {

				if ( user_function.indexOf( '.' ) > -1 ) { // it's a user defined object

					var split = user_function.split( '.' ),
						object = split[0],
						fn = split[1];

					if ( is_filter ) {

						function_arguments[ 0 ] = window[ object ][ fn ].apply( null, function_arguments );

					} else {

						window[ object ][ fn ].apply( null, function_arguments );

					}

				} else if ( 'function' === typeof that.functions[ user_function ] ) { // part of our object

					if ( is_filter ) {

						function_arguments[ 0 ] = that.functions[ user_function ].apply( null, function_arguments );

					} else {

						that.functions[ user_function ].apply( null, function_arguments );

					}

				} else if ( 'function' === typeof window[ user_function ] ) { // global function

					if ( is_filter ) {

						function_arguments[ 0 ] =  window[ user_function ].apply( null, function_arguments );

					} else {

						window[ user_function ].apply( null, function_arguments );

					}

				}

			});

		});
		
		this.temp = null;

		if ( is_filter ) {

			return function_arguments[ 0 ];

		}

	},

	apply_filters: function( hook, function_arguments ) {

		function_arguments = 'undefined' !== typeof function_arguments ? function_arguments : [];

		return this.do_action( hook, function_arguments, true );

	}

};
