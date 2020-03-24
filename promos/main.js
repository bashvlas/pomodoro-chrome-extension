
	new Vue({

		el: "#root",

		data: {

			active_page_name: "select_minutes",
			session_time: 10,
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

					if ( Date.now() > this.end_ts ) {

						clearInterval( this.interval );
						this.active_page_name = "finished";

					};

				}, 100 );

			},

			button_click: function ( name, detail ) {

				if ( name === "start_again" ) {

					this.active_page_name = "select_minutes";

					this.start_ts = 0;
					this.end_ts = 0;

					chrome.storage.local.set({

						start_ts: this.start_ts,
						end_ts: this.end_ts,

					});

				} else if ( name === "set_session_time" ) {

					this.session_time = detail;

				} else if ( name === "start_timer" ) {

					this.session_time = parseInt( this.session_time );
					this.session_time = 0.01;
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

		watch: {

			session_time: function () {

				if ( this.session_time > 1440 ) {

					this.session_time = 1440;

				} else if ( this.session_time < 1 ) {

					this.session_time = 1;

				};

				this.session_time = parseInt( this.session_time );

			}

		},

		created: function () {

			chrome.storage.local.get( null, ( storage ) => {

				console.log( storage );

				if ( storage.session_time ) {

					this.session_time = parseInt( storage.session_time );

				};

				if ( storage.start_ts ) {

					this.start_ts = storage.start_ts;
					this.end_ts = storage.end_ts;

					if ( Date.now() > this.end_ts ) {

						this.active_page_name = "finished";

					} else {

						this.active_page_name = "progress";
						this.set_interval();

					};

				};

			});

		},

	});