Ext.define("pa.extjs.SchoolDistrictsGridPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.schooldistrictsgridpanel",

    layout: "border",
    cls: "pa-panel",
    border: false,

    initComponent: function () {
        var self = this;

        var detailsPanel = Ext.create("pa.extjs.SchoolDistrictsDetailsPanel", {
            region: "east"
        });

        var gridPanel = Ext.create("pa.extjs.SchoolDistrictsGrid", {
            region: "center"
        });

        gridPanel.on("select", function (theGridPanel, record) {
            detailsPanel.updateDetails(record);
        });

        self.items = [gridPanel, detailsPanel];

        self.callParent();
    }
});