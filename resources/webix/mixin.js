TangoWebapp.DeviceTabActivator = {
    activate:function(){
        this.getParentView().show();
        this.show();
    }
};

TangoWebapp.DeviceSetter = {
    device_setter: function (device) {
        webix.assert(device, "device can not be undefined");
        this._device = device;
        return device;
    }
};