/*!
 * JSAF by OriginalEXE
 * https://github.com/OriginalEXE/JSAF
 * MIT licenced
 */

+( function( $ ) {

	window.JSAF = {

		actions: {}, // holds all actions
		filters: {}, // holds all filters

		add_action: function( hook, user_function, priority, context ) {

			priority = 'undefined' !== typeof priority ? String( priority ) : '10';
			context = 'undefined' !== typeof context ? context : window;
			
			if ( 'undefined' === typeof this.actions[ hook ] ) {

				this.actions[ hook ] = {};

			}

			if ( 'undefined' === typeof this.actions[ hook ][ priority ] ) {

				this.actions[ hook ][ priority ] = [];

			}

			this.actions[ hook ][ priority ].push({ context: context, callback: user_function });

		},

		add_filter: function( hook, user_function, priority, context ) {

			priority = 'undefined' !== typeof priority ? String( priority ) : '10';
			context = 'undefined' !== typeof context ? context : window;
			
			if ( 'undefined' === typeof this.filters[ hook ] ) {

				this.filters[ hook ] = {};

			}

			if ( 'undefined' === typeof this.filters[ hook ][ priority ] ) {

				this.filters[ hook ][ priority ] = [];

			}

			this.filters[ hook ][ priority ].push({ context: context, callback: user_function });

		},

		remove_action: function( hook, user_function, priority ) {

			var removed;

			priority = 'undefined' !== typeof priority ? String( priority ) : '10';

			if ( 'undefined' === typeof this.actions[ hook ] || 'undefined' === typeof this.actions[ hook ][ priority ] ) {

				removed = false;

			} else {

				var originalLength = this.actions[ hook ][ priority ].length;

				this.actions[ hook ][ priority ] = $.map(
					this.actions[ hook ][ priority ],
					function( action ) {

						if ( user_function === action.callback ) {

							return null;

						}

						return action;

					}
				)

				if ( originalLength > this.actions[ hook ][ priority ].length ) {

					removed = true;

				} else {

					removed = false;
				}

			}

			return removed;

		},

		remove_filter: function( hook, user_function, priority ) {

			var removed;

			priority = 'undefined' !== typeof priority ? String( priority ) : '10';

			if ( 'undefined' === typeof this.filters[ hook ] || 'undefined' === typeof this.filters[ hook ][ priority ] ) {

				removed = false;

			} else {

				var originalLength = this.filters[ hook ][ priority ].length;

				this.filters[ hook ][ priority ] = $.map(
					this.filters[ hook ][ priority ],
					function( filter ) {

						if ( user_function === filter.callback ) {

							return null;

						}

						return filter;

					}
				)

				if ( originalLength > this.filters[ hook ][ priority ].length ) {

					removed = true;

				} else {

					removed = false;
				}

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

				jQuery.each( that.actions[ hook ][ priority ], function( index, action ) {

					if ( 'function' === typeof action.callback ) {

						action.callback.apply( action.context, function_arguments );

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

				jQuery.each( that.filters[ hook ][ priority ], function( index, filter ) {

					if ( 'function' === typeof filter.callback ) {

						filter.callback.apply( filter.context, function_arguments );

					}

				});

			});

			return function_arguments[ 0 ];

		}

	};

})( window.jQuery || window.Zepto || window.$ );