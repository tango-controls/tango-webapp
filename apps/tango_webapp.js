include.namespace('TangoWebapp');
include.css(
    
);
include.resources(
    
);
include.engines(
);
include.plugins(
    "controller","view","model"
    );

include(function(){ //runs after prior includes are loaded
  include.models(
      "data_base","device"
    );
  include.controllers(
      "tango_webapp/main"
    );
  include.views(
      "views/device_info"
    );
});

include.resources(
    "webix/device_tree", "webix/server_tree", "webix/toolbar",
    //dataviews
    "webix/device_info_view", "webix/device_properties_view", "webix/device_polling_view", "webix/device_event_view",
    "webix/device_attribute_config_view", "webix/device_logging_view", "webix/device_pipe_config_view", "webix/device_attribute_properties_view",
    //"webix/device_tab_view",
    //atk
    "webix/atk_panel_view",
    //windows
    "webix/test_device_window"
);