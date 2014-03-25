Ext.define("pa.extjs.SchoolDistrictsMap", {
    extend: "Ext.panel.Panel",
    alias: "widget.schooldistrictsmap",

    cls: "pa-panel",
    border: false,

    mapOptions: {},

    initComponent: function () {
        var self = this;
        self.addEvents("mapRendered");

        self.on("afterrender", function () {
            self.map = new google.maps.Map(self.body.dom, self.mapOptions);
            self.fireEvent("mapRendered");
        });

        self.callParent();
    },

    getMap: function () {
        return this.map;
    }
});