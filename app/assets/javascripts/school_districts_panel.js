Ext.define("pa.extjs.SchoolDistrictsPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.schooldistrictspanel",

    layout: {
        type: "card",
        deferredRender: true
    },
    cls: "pa-panel",
    border: false,
    margin: 10,

    initComponent: function () {
        var self = this;

        self.dockedItems = [
            {
                xtype: "panel",
                dock: "left",
                border: false,
                html: "<img src='images/2_home.png' title='home' alt='home' height='32' width='32' class='pa-nav-menu-item' onclick='makeActiveItem(0);'></img>" +
                    "<img src='images/2_map.png' title='map' alt='home' height='32' width='32' class='pa-nav-menu-item' onclick='makeActiveItem(1);'></img>" +
                    "<img src='images/2_footnotes.png' title='footnotes' alt='footnotes' height='32' width='32' class='pa-nav-menu-item' onclick='makeActiveItem(2);'></img>",
                width: 50,
                bodyCls: "pa-nav-menu"
            }
        ];

        var gridPanel = Ext.create("pa.extjs.SchoolDistrictsGridPanel");

        var mapPanel = Ext.create("pa.extjs.SchoolDistrictsMapPanel");

        var footnotePanel = Ext.create("pa.extjs.FootnotePanel");

        self.items = [gridPanel, mapPanel, footnotePanel];

        window.makeActiveItem = function (index) {
            Ext.History.add(index);
//            self.getLayout().setActiveItem(index);
        };

        Ext.History.on("change", function(index) {
            self.getLayout().setActiveItem(parseInt(index, 10));
        });

        self.callParent();
    }
});