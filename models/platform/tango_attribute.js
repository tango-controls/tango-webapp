/**
 * @module TangoAttribute
 */
(function () {
    /**
     * Model tango_attribute
     *
     * @type {TangoAttribute}
     */
    TangoAttribute = MVC.Model.extend('tango_attribute',
        /** @Static */
        {

            attributes: {
                id: 'string',//host_id/device_id/name
                name: 'string',
                device_id: 'string',
                display_name: 'string'
                //TODO value
            },
            default_attributes: {},
            /**
             *
             * @param id
             * @return {{tango_host: string, tango_port: number, device: string, name: string}}
             */
            parseId:function(id){
                var parts = id.split('/');

                return {
                    id: id,
                    host:parts[0],
                    device:[parts[1],parts[2], parts[3]].join('/'),
                    name:parts[4]
                }
            }
        },
        /** @Prototype */
        {
            /**
             *
             * @param attrs
             * @constructor
             */
            init:function(attrs){
                attrs.display_name = attrs.display_name || attrs.name;
                this._super(attrs);
            },
            /**
             *
             * @return {boolean}
             */
            isScalar:function(){
                return this.info.data_format === 'SCALAR';
            },
            _handle_resp : function (resp) {
                var result = resp[0];
                this.update_attributes(result);
                if (!this.valid())
                    throw this;
                else return this;
            },
            /**
             * @returns {webix.promise}
             */
            read: function () {
                var device = PlatformContext.devices.getItem(this.device_id);


                return device.fetchAttrValues([this.name]).then(this._handle_resp.bind(this));
            },
            /**
             *
             * @param value
             * @returns {webix.promise}
             */
            write: function (value) {
                var device = PlatformContext.devices.getItem(this.device_id);

                var values = {};
                values[this.name] = value;
                return device.putAttrValues(values).then(this._handle_resp.bind(this)).then(function(attr){
                    if(attr.value !== value) {
                        attr.add_errors([['tango_attribute[',attr.id,']#write has failed: request value(',value,') != response value (',attr.value,')'].join('')]); //TODO error object
                        throw attr;
                    } else 
                        return attr;
                });
            },
            /**
             *
             * @returns {*|webix.promise}
             */
            //TODO extract AttributeInfo (aka MVC.Model.JSON) and move this method there
            putInfo: function () {
                var device = PlatformContext.devices.getItem(this.device_id);

                return device.toTangoRestApiRequest().attributes(this.name).put('/info?async=true', this.info);
            },
            /**
             *
             * @returns {'STATE'|'STATUS'|'SCALAR'|'SPECTRUM'|'IMAGE'}
             */
            getDataFormat:function(){
                if(this.name === 'State') return 'STATE';
                if(this.name === 'Status') return 'STATUS';
                return this.info.data_format;
            }
        }
    );
})();
