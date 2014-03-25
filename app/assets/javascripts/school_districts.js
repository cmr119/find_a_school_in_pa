Ext.onDocumentReady(function () {
    Ext.create("Ext.container.Viewport", {
        layout: "fit",
        border: false,
        cls: "pa-panel",
        items: [
            {
                xtype: "schooldistrictspanel"
            }
        ]
    });
});