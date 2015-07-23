JSAF
====

javascript based actions/filters library inspired by WordPress

## What?
I love how WordPress has actions/filters, they are very useful, and I wanted to make that available in my JS apps too.

## Dependencies
It requires jQuery or Zepto. Yes, I could write it to work without jQuery, but $.map() is sooo handy :).

## How does it work
Functionality is pretty similar to that of the WordPress actions/filters system. For those who are not familiar with it, I would suggest reading this to understand the difference between actions and filters: http://wp.tutsplus.com/tutorials/the-beginners-guide-to-wordpress-actions-and-filters/

To sum up, with actions, you don't expect data to be modified or returned, you just want to execute certain functions when action is triggered (like events). Filters on the other hand modify the passed data and return it.

Basic action example:

	function alert_the_name( name ) {

		alert( name );

	}

	JSAF.add_action( 'trigger_name', 'alert_the_name' );

	JSAF.do_action( 'trigger_name', [ 'Ante' ] );
	// alerts "Ante"

Basic filter example:

	function append_surname( name ) {

		return name + " Sepic";

	}

	JSAF.add_filter( 'full_name', 'append_surname' );

	JSAF.apply_filters( 'full_name', [ 'Ante' ] );
	// returns "Ante Sepic"

Easy, right?

## Priority
Normally, actions/filters are executed in the order they are defined in. But what if we want to execute two actions/filters in custom order?

No problem:

	function append_random( text ) {

		return text + " is your name!";

	}

	function append_surname( name ) {

		return name + " Sepic";

	}


	JSAF.add_filter( 'full_name', 'append_random', 11 ); // we defined priority as "11", and since the default priority is 10, this filter will be applied after the one we are defining in the next line
	JSAF.add_filter( 'full_name', 'append_surname' ); // as usual

	JSAF.apply_filters( 'full_name', [ 'Ante' ] );
	// returns "Ante Sepic is your name!"

## Passing variables
It's very easy to pass variables to your functions

Basically, what you do is (as a second parameter of apply_filters/do_action) specify array of values you are passing, and then in the function you catch them in the order you defined them.

Example:

	JSAF.apply_filters( 'hook_name', [ 'Ante', 'Sepic', 'is my name' ] );

and you would catch it in your function like this:

	function random_string( name, surname, text ) {

		return name + surname + text;

	}

## Specifying context
Aaah, the infamous `this`. You can set what `this` wil be inside your function by passing it as a fourth parameter of the add_action/add_filter:

	var person = {
		name: 'Ante',
		shoutMyName: function() {

			alert( this.name );

		}
	}

	JSAF.add_action( 'shout_names', person.shoutMyName, 10, person );

	JSAF.do_action( 'shout_names' );
	// alerts "Ante"

## Remove filters/actions
You can easily remove filters/actions you or other people have defined. All you need to know is hook, function name and priority.
	
	...

	JSAF.remove_filter( 'full_name', 'append_surname', 10 ); // we could've just left out the priority here since it defaults to 10

	JSAF.apply_filters( 'full_name', [ 'Ante' ] );
	// returns "Ante is your name!"

For actions, use `JSAF.remove_action` with the same signature

## Can I use it in commercial purposes?
JSAF is licensed under MIT licence, which basically means you can do anything with it (I would appreciate it if you didn't remove the link to this github page from the js source).