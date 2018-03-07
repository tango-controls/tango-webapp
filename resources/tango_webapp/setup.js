TangoWebapp.ui = {
    _webix_files: [
        "dashboard",
        "devices_tree",
        "plot", "test_device_panel",
        "device_view", "device_properties_view", "device_polling_view", "device_events_view",
        "device_attributes_config_view", "device_logging_view",
        "device_monitor_view"
    ]
};

if (MVC.Browser.Rhino)
    print("Skipping webix for Rhino");
else if (MVC.env() === 'production') {
    include.add(include.add_defaults('../../apps/tango_webapp/webix')); //this file is created during compression
} else
    include.apply(include, TangoWebapp.ui._webix_files);