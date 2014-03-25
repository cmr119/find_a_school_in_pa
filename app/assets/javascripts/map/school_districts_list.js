Ext.define("pa.extjs.SchoolDistrictsList", {
    extend: "Ext.panel.Panel",
    alias: "widget.schooldistrictslist",

    cls: "pa-panel",
    border: false,
    width: 250,
    autoScroll: true,
    layout: 'vbox',
    margin: "0 5 0 0 ",

    initComponent: function () {
        var self = this;
        self.selectedListItems = {};

        self.addEvents("checkboxClicked");

        self.dockedItems = [
            {
                xtype: "panel",
                dock: "top",
                cls: "pa-list-item",
                border: false,
                bodyPadding: 10,
                width: self.width,
                html: "<label><input type='checkbox' id='mapCheckbox'>Search by Map</label>"
            }
        ];

        self.on("afterrender", function () {
            Ext.addBehaviors({
                "#mapCheckbox@click": function (e, t) {
                    self.fireEvent("checkboxClicked", t.checked);
                }
            });
        });

        self.callParent();
    },

    addListItem: function (item) {
        var self = this;

        var listItem = Ext.create("pa.extjs.SchoolDistrictsListItem", {
            item: item,
            selected: Ext.Array.contains(Ext.Object.getKeys(self.selectedListItems), item.id.toString()),
            width: self.width
        });

        listItem.on("itemSelected", function (listItem) {
            self.selectedListItems[listItem.item.id] = listItem;
        });

        listItem.on("itemUnselected", function (listItem) {
            delete self.selectedListItems[listItem.item.id];
        });

        self.add(listItem);
    },

    removeAll: function (autoDestroy) {
        Ext.Object.each(this.selectedListItems, function (key, value) {
            value.marker.setMap(null);
        });

        this.callParent();
    }
});

Ext.define("pa.extjs.SchoolDistrictsListItem", {
    extend: "Ext.panel.Panel",
    alias: "widget.schooldistrictslistitem",

    cls: "pa-list-item",
    bodyPadding: 10,
    bodyCls: "list-not-selected",
    border: false,

    selected: false,

    initComponent: function () {
        var self = this;
        self.addEvents("itemSelected", "itemUnselected");
        self.bubbleEvents = ["itemSelected", "itemUnselected"];

        self.html = "<div><b>" + self.item.name + "</b></div>" +
            "<div><i>Ryan Points:</i> " + self.item.ryan_points + "</div>" +
            "<div><i>2013 District Ranking:</i> " + self.item.rank_2013 + "</div>" +
            "<div><i>2013 Statewide Ranking:</i> " + self.item.statewide_rank + "</div>" +
            "<div><i>2012 District Ranking:</i> " + self.item.rank_2012 + "</div>" +
            "<div><i>Minutes To Pittsburgh:</i> " + self.item.distance_to_pittsburgh + "</div>" +
            "<div><i>Zillow Home Value Index:</i> " + Ext.util.Format.usMoney(self.item.zillow_home_value_index) + "</div>";

        self.on("boxready", function () {
            if (self.selected) {
                self.select(false);
            }

            self.body.setStyle("cursor", "default");

            self.body.on("click", function () {
                if (!self.selected) {
                    self.select(true);
                }
                else {
                    self.unselect(true);
                }
            });
        });

        self.callParent();
    },

    select: function () {
        var self = this;

        self.selected = true;
        self.removeBodyCls("list-not-selected");
        self.addBodyCls("list-selected");

        self.fireEvent("itemSelected", self);
    },

    unselect: function () {
        var self = this;

        self.selected = false;
        self.removeBodyCls("list-selected");
        self.addBodyCls("list-not-selected");

        self.fireEvent("itemUnselected", self);
    }
});