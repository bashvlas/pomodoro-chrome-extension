  window.data = {

    iframe_model_hash: {

      "sign_up": {
        active_page_name: "sign_up",

        drawer_item_hash: {

          main_page: true,
          my_account: true,
          settings: true,
          log_out: true,

        }

      },

      "my_account_upgraded": {

        active_page_name: "my_account",
        show_user_is_upgraded_message: true,

        user_email: "example@gmail.com",
        drawer_item_hash: {

          main_page: true,
          my_account: true,
          settings: true,
          log_out: true,

        }

      },

      "my_account_not_upgraded": {

        active_page_name: "my_account",
        show_user_is_not_upgraded_message: true,

        user_email: "example@gmail.com",
        drawer_item_hash: {

          main_page: true,
          my_account: true,
          settings: true,
          log_out: true,

        }

      },

    }
  };



new Vue({
  el: "#root",
  data: {},
  methods: {
    inject_iframe: function() {
      var iframe = document.createElement("iframe");
      iframe.src = "/pages/iframe/index.html";
      $("#iframe_container").append(iframe);
    },

    send_to_iframe: function(name, data) {
      document
        .querySelector("iframe")
        .contentWindow.postMessage({ name, data }, "*");
    },

    sidebar_button_click: async function(button_name, detail) {
      if (button_name === "set_iframe_model") {
        this.send_to_iframe("set_iframe_model", {
          iframe_model: window.data.iframe_model_hash[detail]
        });
      } else if ( button_name === "show_message" ) {
        this.send_to_iframe("show_message", {
          message: "URL marked as contact page",
        });
      };
    }
  },

  created: function() {
    window.addEventListener("message", event => {
      var name = event.data.name;
      var data = event.data.data;
      console.log("window_message", name, data);
    });

    this.inject_iframe();
  }
});
