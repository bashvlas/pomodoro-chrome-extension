
	( async function () {

		var _state = {};

		chrome.browserAction.setBadgeBackgroundColor({ color: "#b71c1c" });

		chrome.runtime.onMessage.addListener( ( message ) => {

			console.log( message )

			if ( message.name === "start_timer_click" ) {

				chrome.browserAction.setBadgeText({

					text: Math.ceil( ( message.data.end_ts - Date.now() ) / ( 1000 * 60 ) ).toString()

				});

				_state.timeout = setTimeout ( () => {

					chrome.browserAction.setBadgeText({ text: "" });
					clearInterval( _state.interval );
					clearTimeout( _state.timeout );

					alert( "Congratulations! You have finised a deep work session! :)" );

				}, message.data.end_ts - message.data.start_ts );

				_state.interval = setInterval( () => {

					chrome.browserAction.setBadgeText({

						text: Math.ceil( ( message.data.end_ts - Date.now() ) / ( 1000 * 60 ) ).toString()

					});

				}, 6000 );

			} else if ( message.name === "stop_timer_click" ) {

				chrome.browserAction.setBadgeText({ text: "" });
				clearInterval( _state.interval );
				clearTimeout( _state.timeout );

			};

		});

	} () );