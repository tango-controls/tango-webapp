webix.protoUI({
    name: "textarea0",
    $cssName: "textarea",
    getValue: function () {
        var rv = webix.ui.textarea.prototype.getValue.call(this);
        return rv.split('\n');
    },
    setValue: function (value) {
        webix.ui.textarea.prototype.setValue.call(this, value.join('\n'));
    }
}, webix.ui.textarea);

webix.protoUI({
    _wizard_window: webix.ui({
        view: "window",
        zIndex: 1,
        toFront: true,
        position: "center",
        autofocus: true,
        autoheight: true,
        minwidth: 320,
        close: true,
        move: true,
        headHeight: 20,
        head: {template: "New server wizard"},
        body: {
            rows: [
                {
                    view: "form",
                    id: "frmServerWizard",
                    elements: [
                        {
                            view: "text",
                            name: "server",
                            label: "ServerName/Instance:",
                            labelWidth: 150,
                            labelPosition: "top",
                            placeholder: "server/instance, i.e. TangoTest/test",
                            validate: function (value) {
                                return /^[\w]*\/[\w]*$/.test(value);
                            }, invalidMessage: "Incorrect server/instance"
                        },
                        {
                            view: "text",
                            name: "className",
                            label: "Class name:",
                            labelWidth: 150,
                            labelPosition: "top",
                            placeholder: "MyClass",
                            validate: webix.rules.isNotEmpty,
                            invalidMessage: "Can not be empty"
                        },
                        {
                            view: "textarea0",
                            name: "devices",
                            label: "Devices:",
                            height: 200,
                            labelWidth: 150,
                            labelPosition: "top",
                            placeholder: "instance/family/member, i.e. sys/tg_test/1",
                            validate: function (value) {
                                var rv = false;
                                do {
                                    rv = /[\w]*\/[\w]*\/[\w]*/.test(value.shift());
                                } while (rv && value.length != 0);
                                return rv;
                            }, invalidMessage: "Incorrect devices"
                        }
                    ]
                },
                {
                    view: "toolbar", cols: [
                    {},
                    {
                        view: "button", value: "Apply", width: 100, align: "center", click: function () {
                        var $$serverWizard = $$('frmServerWizard');
                        if ($$serverWizard.validate()) {
                            TangoWebapp.helpers.serverWizard($$serverWizard.getValues());
                            this.getTopParentView().hide();
                        }
                    }
                    },
                    {
                        view: "button", value: "Close", width: 100, align: "right", click: function () {
                        this.getTopParentView().hide()
                    }
                    }]
                }
            ]
        }
    }),
    addTangoHost: function () {
        var top = this.getTopParentView();

        if (!top.$$('txtTangoHost').validate()) return;

        var tango_host = top.$$('txtTangoHost').getValue();

        var found = TangoHost.find_one({id: str_to_hash(tango_host)});
        if (found) {
            TangoWebapp.globals.tango_host = found;
        } else {
            TangoWebapp.globals.tango_host = new TangoHost({
                host: tango_host.split(':')[0],
                port: parseInt(tango_host.split(':')[1])
            });

            top.$$('txtTangoHost').define("suggest", TangoHost.find_all());
            top.$$('txtTangoHost').refresh();
        }

        TangoWebapp.globals.rest_api_host.addDb(TangoWebapp.globals.tango_host);

        //TODO send event
        //update cookie
        TangoGlobals.update(TangoWebapp.globals.id, TangoWebapp.globals.attributes());

        $$('device_tree').updateRoot();
    },
    rest_hosts: [],
    rest_ports: [],
    refresh: function () {
        var top = this.getTopParentView();

        if (!top.$$('txtTangoRestApiHost').validate()) return;
        if (!top.$$('txtTangoRestApiPort').validate()) return;

        var host = top.$$('txtTangoRestApiHost').getValue();
        var port = top.$$('txtTangoRestApiPort').getValue();
        var version = top.$$('txtTangoRestApiVersion').getValue();

        //TODO validate
        TangoWebapp.globals.rest_api_host = new RestApiHost(
            {
                host: host,
                port: parseInt(port),
                version: version
            }
        );

        //TODO send event
        //update cookie
        TangoGlobals.update(TangoWebapp.globals.id, TangoWebapp.globals.attributes());

        //TODO send event
        //update suggest
        top.rest_hosts.push(host);
        top.rest_ports.push(port);

        top.$$('txtTangoRestApiHost').define("suggest", top.rest_hosts);
        top.$$('txtTangoRestApiPort').define("suggest", top.rest_ports);
        top.$$('txtTangoRestApiHost').refresh();
        top.$$('txtTangoRestApiPort').refresh();


        //TODO send event
        //update device root
        $$('device_tree').updateRoot();
    },
    wizard: function () {
        var top = this.getTopParentView();

        top._wizard_window.show();
    },
    _getUI: function () {
        var top = this;
        return {
            cols: [
                {
                    view: "template",
                    type: "header",
                    borderless: true,
                    template: '<span style="width: 240px"><img style="max-width: 100%; max-height: 100%" src="images/logo_tangocontrols.png"></span>'
                },
                {
                    view: "label",
                    label: "TANGO_REST:",
                    width: 120
                },
                {
                    view: "text",
                    id: "txtTangoRestApiHost",
                    name: 'txtTangoRestApiHost',
                    placeholder: TangoWebapp.consts.REST_API_HOST,
                    inputAlign: "right",
                    required: true,
                    width: 100,
                    suggest: top.rest_hosts
                },
                {
                    view: "text",
                    id: "txtTangoRestApiPort",
                    name: 'txtTangoRestApiPort',
                    placeholder: TangoWebapp.consts.REST_API_PORT,
                    required: true,
                    width: 80,
                    suggest: top.rest_ports
                },
                {
                    view: "text",
                    id: "txtTangoRestApiVersion",
                    value: TangoWebapp.consts.REST_API_VERSION,
                    disabled: true, //TODO different versions support
                    width: 50
                },
                {
                    view: "button",
                    id: "btnRefresh",
                    type: "iconButton",
                    icon: "refresh",
                    width: 36,
                    click: top.refresh,
                    tooltip: "Refresh TANGO_REST_API root"
                },
                {},
                {
                    view: "label",
                    label: "TANGO_HOST =",
                    width: 120
                },
                {
                    view: "text",
                    name: "tango_host",
                    id: "txtTangoHost",
                    placeholder: TangoWebapp.globals.tango_host.toString(),
                    required: true,
                    width: 150,
                    suggest: TangoHost.find_all()
                },
                {
                    view: "button",
                    id: "btnAdd",
                    type: "iconButton",
                    icon: "plus",
                    width: 36,
                    click: top.addTangoHost,
                    tooltip: "Add TANGO_HOST"
                },
                {
                    view: "button",
                    id: "btnAddWizard",
                    label: "Add server wizard",
                    type: "iconButton",
                    icon: "magic",
                    width: 180,
                    click: top.wizard
                },
                {view: "label", label: "Logged in as: ", align: "right", width: 100},
                {view: "text", id: "lblUsername", readonly: true, disabled: true, align: "right", width: 180},
                {
                    view: "button",
                    id: "btnUser",
                    type: "iconButton",
                    tooltip: "Sign out...",
                    icon: "sign-out",
                    width: 36,
                    click: function () {
                        OpenAjax.hub.publish('tango_webapp.user_logout', {});
                    },
                    align: "right"
                }
            ]
        }
    },
    changeTangoHost: function () {
        TangoWebapp.helpers.changeTangoHost();
    },
    name: "MainToolbar",
    $init: function (config) {
        this.rest_hosts = RestApiHost.find_all().map(function (el) {
            return el.host;
        });

        this.rest_ports = RestApiHost.find_all().map(function (el) {
            return '' + el.port;
        });

        webix.extend(config, this._getUI());
    },
    defaults: {
        height: 40
    }
}, webix.IdSpace, webix.EventSystem, webix.ui.toolbar);


TangoWebapp.ui.newMainToolbar = function () {
    return {
        view: "MainToolbar",
        id: "main-toolbar"
    }
};