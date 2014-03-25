Ext.define("pa.extjs.SchoolDistrictsDetailsPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.schooldistrictsdetailpanel",

    layout: "border",
    cls: "pa-panel",
    border: false,
    margin: "0 0 0 5",
    width: 300,

    initComponent: function () {
        var self = this;

        var detailsPanel = Ext.create("Ext.panel.Panel", {
            region: "center",
            border: false,
            autoScroll: true,
            bodyPadding: 10,
            padding: "0, 0, 5, 0",
            cls: "pa-panel",
            tpl: new Ext.XTemplate(
                '<div align="center"><b>{name}</b></div>',
                '<div align="center">Ryan Points: {ryan_points}</div><br/>',
                '<div style="text-decoration: underline">Honor Roll Rankings</div>',
                '<div>2013 District: {rank_2013}</div>',
                '<div>2013 Statewide: {statewide_rank}</div>',
                '<div>2012 District: {rank_2012}</div>',
                '<div>Economic Disadvantaged: {economic_disadvantaged_rank}</div>',
                '<div>Overachiever: {overachiever_rank}</div><br/>',
                '<div style="text-decoration: underline">Grade Level Rankings</div>',
                '<div>11th: {rank_11th}</div>',
                '<div>8th: {rank_8th}</div>',
                '<div>7th: {rank_7th}</div>',
                '<div>6th: {rank_6th}</div>',
                '<div>5th: {rank_5th}</div>',
                '<div>4th: {rank_4th}</div>',
                '<div>3rd: {rank_3rd}</div><br/>',
                '<div style="text-decoration: underline">School Data</div>',
                '<div>Enrollment: {enrollment:number("0,000")}</div>',
                '<div>Budget {budget:usMoney}</div>',
                '<div>Tax Rate: {tax_rate}%</div>',
                '<div>Minutes To Pittsburgh: {distance_to_pittsburgh}</div><br/>',
                '<div style="text-decoration: underline">Real Estate</div>',
                '<div>Zillow Home Value Index: {zillow_home_value_index:usMoney}</div>',
                '<div>Median Home Value: {zillow_median_home_value:usMoney}</div>',
                '<div>Median List Price: {zillow_median_list_price:usMoney}</div>',
                '<div>Median Sale Price: {zillow_median_sale_price:usMoney}</div>',
                '<div>Property Tax: {zillow_property_tax:usMoney}</div><br/>',
                '<div style="text-decoration: underline">Contact Info</div>',
                '<div>Address: {address}</div>',
                '<div>Phone: {phone}</div>',
                '<div>URL: <a href="http://{url}" target="_blank">{url}</a></div>'
            )
        });

        var googleMap = Ext.create("Ext.Img", {
            region: "south",
            src: "http://maps.googleapis.com/maps/api/staticmap?size=300x300&center=Pittsburgh, PA&maptype=roadmap&sensor=false"
        });

        self.items = [detailsPanel, googleMap];

        self.updateDetails = function (record) {
            detailsPanel.update(record.data);
            googleMap.setSrc("http://maps.googleapis.com/maps/api/staticmap?size=300x300&center=Pittsburgh, PA&maptype=roadmap&markers=" + record.get("address") + "&sensor=false");
        };

        self.callParent();
    }
});