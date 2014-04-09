Ext.define("pa.extjs.FootnotePanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.footnotepanel",

    bodyCls: "pa-footnote-panel",
    border: false,
    bodyPadding: 10,
    height: 100,

    html: "Thanks to the Pittsburgh Business Times for their <a href='http://www.bizjournals.com/pittsburgh/promo/schoolguide' target='_blank'>2013 Western PA School Guide</a>" +
        "<ul>" +
        "<li>The ranking data can easily be scraped <a href='http://b3.caspio.com/dp.asp?AppKey=036b100066200d6020ed4ab4aab8' target='_blank'>here</a></li>" +
        "<li>The county info can easily be scraped <a href='http://b3.caspio.com/dp.asp?AppKey=036b10003ec5be0a033e48eaac99' target='_blank'>here</a></li>" +
        "</ul>" +
        "Thanks to the <a href='https://developers.google.com/maps/' target='_blank'>Google Maps API</a> for providing geocoding, distance and mapping functionality<br><br>" +
        "Thanks to the <a href='http://www.zillow.com/howto/api/GetDemographics.htm' target='_blank'>Zillow Demographics API</a> for providing home affordability data<br><br>" +
        "Based on the metrics (school district performance, housing affordability and location relative to Pittsburgh, PA) " +
        "that were most important to us, we developed a point system to help aid our search:" +
        "<ul>" +
        "<li>ranking_points = (&lt;max 2013 ranking&gt; / 2) - ((&lt;school district 2013 ranking&gt; - 1) / 2)</li>" +
        "<li>zillow points = (&lt;max zillow home value index&gt; - &lt;school district zillow home value index&gt;) / 10000</li>" +
        "<li>distance points = (&lt;max distance from Pittsburgh&gt; - &lt;school district distance from Pittsburgh&gt;) / 10</li>" +
        "</ul>"
});