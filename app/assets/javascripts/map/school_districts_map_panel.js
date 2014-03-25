Ext.define("pa.extjs.SchoolDistrictsMapPanel", {
    extend: "Ext.panel.Panel",
    alias: "widget.schooldistrictsmappanel",

    layout: "border",
    cls: "pa-panel",
    border: false,

    initComponent: function () {
        var self = this,
            searchByMap = false,
            allListed = false;

        var listPanel = Ext.create("pa.extjs.SchoolDistrictsList", {
            region: "west"
        });

        listPanel.on("checkboxClicked", function (checked) {
            searchByMap = checked;
            updateList();
        });

        listPanel.on("itemSelected", function (selectedItem) {
            if (selectedItem.marker != null) {
                selectedItem.marker.setMap(mapPanel.getMap());
            }
            else {
                selectedItem.marker = createMarker(selectedItem.item);
            }

            if (!searchByMap) {
                var markerBounds = new google.maps.LatLngBounds();
                Ext.Object.each(listPanel.selectedListItems, function (key, value) {
                    markerBounds = markerBounds.extend(value.marker.getPosition());
                });

                mapPanel.getMap().fitBounds(markerBounds);
            }
        });

        listPanel.on("itemUnselected", function (selectedItem) {
            selectedItem.marker.setMap(null);
        });

        var mapPanel = Ext.create("pa.extjs.SchoolDistrictsMap", {
            region: "center",
            mapOptions: {
                zoom: 12,
                maxZoom: 13,
                center: new google.maps.LatLng(40.442081355571446, -79.9879460003906), //Pittsburgh, PA
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        });

        mapPanel.on("mapRendered", function () {
            google.maps.event.addListener(mapPanel.getMap(), "dragend", function () {
                updateList();
            });

            google.maps.event.addListener(mapPanel.getMap(), "zoom_changed", function () {
                updateList();
            });

            google.maps.event.addListener(mapPanel.getMap(), "idle", function () {
                updateList();
            });
        });

        var updateList = function () {
            var loadMask = new Ext.LoadMask({ target: listPanel, msg: "Updating..." });

            if (searchByMap || !allListed) {
                loadMask.show();
                clearList();

                Ext.Ajax.request({
                    url: "map/markers",
                    params: {
                        searchByMap: searchByMap,
                        swLat: mapPanel.getMap().getBounds().getSouthWest().lat(),
                        swLng: mapPanel.getMap().getBounds().getSouthWest().lng(),
                        neLat: mapPanel.getMap().getBounds().getNorthEast().lat(),
                        neLng: mapPanel.getMap().getBounds().getNorthEast().lng(),
                        authenticity_token: window._token
                    },
                    callback: function () {
                        loadMask.hide();
                    },
                    success: function (response) {
                        results = Ext.JSON.decode(response.responseText);

                        allListed = !searchByMap;

                        Ext.Array.each(results, function (result) {
                            listPanel.addListItem(result);
                        });
                    },
                    failure: function () {
                        Ext.Msg.show({
                            msg: "An error occurred updating the list.",
                            buttons: false,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                });
            }
        };

        var clearList = function () {
            listPanel.removeAll();
        };

        var createMarker = function (item) {
            var infowindow = new google.maps.InfoWindow({
                content: "<div>" + item.name + "</div>"
            });

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.lat, item.lng),
                map: mapPanel.getMap(),
                title: item.name
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(mapPanel.getMap(), marker);
            });

            return marker;
        };

        self.items = [listPanel, mapPanel];

        self.callParent();
    }
});