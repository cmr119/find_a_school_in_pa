Ext.define("pa.extjs.SchoolDistrictsGrid", {
    extend: "Ext.grid.Panel",
    alias: "widget.schooldistrictsgrid",

    border: false,

    initComponent: function () {
        var self = this;

        self.store = Ext.create("Ext.data.Store", {
            fields: [
                { name: "id", type: "int" },
                { name: "name", type: "string" },
                { name: "county", type: "string" },
                { name: "rank_2013", type: "int" },
                { name: "statewide_rank", type: "int" },
                { name: "economic_disadvantaged_rank", type: "int" },
                { name: "overachiever_rank", type: "int" },
                { name: "rank_2012", type: "int" },
                { name: "rank_11th", type: "int" },
                { name: "rank_8th", type: "int" },
                { name: "rank_7th", type: "int" },
                { name: "rank_6th", type: "int" },
                { name: "rank_5th", type: "int" },
                { name: "rank_4th", type: "int" },
                { name: "rank_3rd", type: "int" },
                { name: "address", type: "string" },
                { name: "phone", type: "string" },
                { name: "url", type: "string" },
                { name: "budget", type: "float" },
                { name: "tax_rate", type: "float" },
                { name: "enrollment", type: "int" },
                { name: "lat", type: "float" },
                { name: "lng", type: "float" },
                { name: "zillow_home_value_index", type: "int" },
                { name: "zillow_median_home_value", type: "int" },
                { name: "zillow_median_list_price", type: "int" },
                { name: "zillow_median_sale_price", type: "int" },
                { name: "zillow_property_tax", type: "int" },
                { name: "distance_to_pittsburgh", type: "int" },
                { name: "ryan_points", type: "float" }
            ],
            sorters: [
                { property: "ryan_points", direction: "DESC" }
            ],
            proxy: {
                type: "ajax",
                url: "list",
                reader: {
                    type: "json"
                }
            },
            autoLoad: true
        });

        self.columns = [
            { text: "Name", dataIndex: "name", flex: 1 },
            { text: "County", dataIndex: "county", flex: 1, hidden: true },
            { text: "Ryan Points", dataIndex: "ryan_points", sortable: true, flex: 1 },
            { text: "Rankings",
                columns: [
                    { text: "2013 District", dataIndex: "rank_2013", sortable: true, flex: 1 },
                    { text: "2013 Statewide", dataIndex: "statewide_rank", sortable: true, flex: 1 },
                    { text: "2012 District", dataIndex: "rank_2012", sortable: true, flex: 1 },
                ]
            },
            { text: "Economic Disadvantaged Rank", dataIndex: "economic_disadvantaged_rank", flex: 1, hidden: true },
            { text: "Overachiever Rank", dataIndex: "overachiever_rank", flex: 1, hidden: true },
            { text: "11th Grade Rank", dataIndex: "rank_11th", flex: 1, hidden: true },
            { text: "8th Grade Rank", dataIndex: "rank_8th", flex: 1, hidden: true },
            { text: "7th Grade Rank", dataIndex: "rank_7th", flex: 1, hidden: true },
            { text: "6th Grade Rank", dataIndex: "rank_6th", flex: 1, hidden: true },
            { text: "5th Grade Rank", dataIndex: "rank_5th", flex: 1, hidden: true },
            { text: "4th Grade Rank", dataIndex: "rank_4th", flex: 1, hidden: true },
            { text: "3rd Grade Rank", dataIndex: "rank_3rd", flex: 1, hidden: true },
            { text: "Budget", dataIndex: "budget", flex: 1, hidden: true, renderer: Ext.util.Format.numberRenderer("0,000.00") },
            { text: "Tax Rate", dataIndex: "tax_rate", flex: 1, hidden: true },
            { text: "Enrollment", dataIndex: "enrollment", flex: 1, hidden: true, renderer: Ext.util.Format.numberRenderer("0,000") },
            { text: "Zillow Home Value Index", dataIndex: "zillow_home_value_index", flex: 1, renderer: Ext.util.Format.numberRenderer("0,000.00") },
            { text: "Median Home Value", dataIndex: "zillow_median_home_value", flex: 1, hidden: true, renderer: Ext.util.Format.numberRenderer("0,000.00") },
            { text: "Median List Price", dataIndex: "zillow_median_list_price", flex: 1, hidden: true, renderer: Ext.util.Format.numberRenderer("0,000.00") },
            { text: "Median Sale Price", dataIndex: "zillow_median_sale_price", flex: 1, hidden: true, renderer: Ext.util.Format.numberRenderer("0,000.00") },
            { text: "Property Tax", dataIndex: "zillow_property_tax", flex: 1, hidden: true, renderer: Ext.util.Format.numberRenderer("0,000.00") },
            { text: "Minutes to Pittsburgh", dataIndex: "distance_to_pittsburgh", flex: 1, hidden: false }
        ];

        self.selModel = Ext.create('Ext.selection.CheckboxModel', { showHeaderCheckbox: false });

        var compareButtonHandler = function () {
            var selectionModel = self.getSelectionModel();

            if (selectionModel.getCount() < 2) {
                Ext.Msg.show({
                    msg: "Please select at least 2 school districts to compare.",
                    buttons: false,
                    icon: Ext.MessageBox.ERROR
                });
            }
            else if (selectionModel.getCount() > 3) {
                Ext.Msg.show({
                    msg: "Please select no more than 3 school districts to compare.",
                    buttons: false,
                    icon: Ext.MessageBox.ERROR
                });
            }
            else {
                var comparisonWindow = Ext.create("pa.extjs.SchoolDistrictsComparisonWindow", {
                    data: selectionModel.getSelection()
                });
                comparisonWindow.show();
            }
        };

        self.tbar = [
            {
                xtype: "tbfill"
            },
            {
                text: "Compare",
                tooltip: "Select up to 3 school districts to compare",
                tooltipType: "title",
                handler: compareButtonHandler
            }
        ];

        self.callParent();
    }
});