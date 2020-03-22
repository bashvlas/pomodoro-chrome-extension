
	new Vue({

		el: "#root",

		data: {

			active_page_name: "select_minutes",
			session_time: 40,
			timer_is_active: false,
			start_ts: 0,
			end_ts: 0,
			time_text: "",
			percent_done: 100,

		},

		methods: {

			set_interval: function () {

				this.interval = setInterval( () => {

					this.time_text = moment.utc( this.end_ts - Date.now() ).format( "HH:mm:ss" );

					this.percent_done = 100 *( this.end_ts - Date.now() ) / ( this.session_time * 60 * 1000 ) 

				}, 100 );

			},

			button_click: function ( name, detail ) {

				if ( name === "start_again" ) {

					this.active_page_name = "select_minutes";

				} else if ( name === "set_session_time" ) {

					this.session_time = detail;

				} else if ( name === "start_timer" ) {

					this.session_time = parseInt( this.session_time );
					this.timer_is_active = true;
					this.active_page_name = "progress";

					this.start_ts = Date.now();
					this.end_ts = this.start_ts + this.session_time * 60 * 1000;

					this.set_interval();

					chrome.storage.local.set({

						start_ts: this.start_ts,
						end_ts: this.end_ts,
						session_time: this.session_time,

					}, () => {

						chrome.runtime.sendMessage({

							name: "start_timer_click",
							data: {
								start_ts: this.start_ts,
								end_ts: this.end_ts,
								session_time: this.session_time,
							}

						});

					});

				} else if ( name === "stop_timer" ) {

					this.active_page_name = "select_minutes";

					chrome.storage.local.set({

						start_ts: 0,
						end_ts: 0,

					}, () => {

						chrome.runtime.sendMessage({ name: "stop_timer_click" });

					});

				};

			},

		},

		mounted: function () {

			chrome.storage.local.get( null, ( storage ) => {

				if ( storage.start_ts ) {

					this.start_ts = storage.start_ts;
					this.end_ts = storage.end_ts;
					this.session_time = storage.session_time;

					this.active_page_name = "progress";

					this.set_interval();

				};

			});

		},

	});