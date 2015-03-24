/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
var friend = function () {
    "use strict";

    /* Misc functions */
    var renderMatches = function (data) {
        var progressCluster = $("<div/>", {class: "match"});
        if (typeof data.match != "undefined") {
            $.each(data.match, function (key, val) {
                progressCluster.append(
                    $("<a/>", {href: "/user/" + data.id + "/" + key.toLocaleLowerCase()}).text(key)
                ).append(
                    $("<div/>", {class: "progress"}).append(
                        $("<div/>", {
                            class: "progress-bar",
                            role: "progressbar",
                            "aria-valuemin": "0",
                            "aria-valuemax": "100",
                            "aria-valuenow": val,
                            style: "width: " + val + "%"
                        }).text(val + "%")
                    )
                );
            });
        }
        return progressCluster;
    };

    /* Buttons/action functions */
    var action = {
        sendmail: function () {
        },
        addfriend: function () {
        },
        deletefriend: function () {
        }
    };

    /* Click hooks */
    var registerClickhooks = function () {
        $("a.sendmail, a.addfriend, a.deletefriend").click(function (event) {
            event.preventDefault();
            console.log($(this).attr('href'));
            var arr = $(this).attr('href').replace("#", '').split('-');
            action[arr[0]](arr[1]);
        });
        $("a#prev,a#next").click(function(event){
            event.preventDefault();
            // getJSON update screen
        });
    };

    /* display/output functions */
    var output = {
        // existingfriends "users" expects : [{id:"#",name:"Name",img:"url?",match:{Category:30}}]
        existingfriends: function (users) {
            var userData = $("<div/>", {class: "row existingfriends"});
            $.each(users, function (key, val) {
                userData.append(
                    $("<div/>", {class: "col-md-3", id: "userid-" + val.id}).append(
                        $("<div/>", {class: "thumbnail"}).append(
                            // TODO:Swap with user image
                            $("<img/>", {src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkyLjQ2ODc1IiB5PSIxMDAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTFwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4yNDJ4MjAwPC90ZXh0PjwvZz48L3N2Zz4="})
                        ).append(
                            $("<div/>", {class: "caption"}).append(
                                // Swap with user profile URL TODO: DOUBLE CHECK THIS
                                $("<a/>", {href: "/user/" + val.id}).append(
                                    // Replace with user's display name
                                    $("<h3/>").text(val.name)
                                )
                            ).append(
                                renderMatches(val)
                            ).append(
                                $("<div/>", {class: "actions"}).append(
                                    $("<a/>", {class: "btn btn-default sendmail", href: "#sendmail-" + val.id}).append(
                                        $("<span/>", {class: "glyphicon glyphicon-envelope", "aria-hidden": "true"})
                                    )
                                ).append(
                                    $("<a/>", {
                                        class: "btn btn-default deletefriend",
                                        href: "#deletefriend-" + val.id
                                    }).append(
                                        $("<span/>", {class: "glyphicon glyphicon-trash", "aria-hidden": "true"})
                                    )
                                )
                            )
                        )
                    )
                );
            });
            $("div.existingfriends").replaceWith(userData);
        },
        findfriends: function (users) {
            var userData = $("<div/>", {class: "row findfriends"});
            $.each(users, function (key, val) {
                userData.append(
                    $("<div/>", {class: "col-md-3", id: "userid-" + val.id}).append(
                        $("<div/>", {class: "thumbnail"}).append(
                            // Swap with user image
                            $("<img/>", {src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkyLjQ2ODc1IiB5PSIxMDAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTFwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4yNDJ4MjAwPC90ZXh0PjwvZz48L3N2Zz4="})
                        ).append(
                            $("<div/>", {class: "caption"}).append(
                                // Swap with user profile URL
                                $("<a/>", {href: "/user/" + val.id}).append(
                                    // Replace with user's display name
                                    $("<h3/>").text(val.name)
                                )
                            ).append(
                                // Create a progress bar generator here
                                renderMatches(val)
                            ).append(
                                $("<div/>", {class: "actions"}).append(
                                    $("<a/>", {class: "btn btn-default sendmail", href: "#sendmail-" + val.id}).append(
                                        $("<span/>", {class: "glyphicon glyphicon-envelope", "aria-hidden": "true"})
                                    )
                                ).append(
                                    $("<a/>", {
                                        class: "btn btn-default addfriend",
                                        href: "#addfriend-" + val.id
                                    }).append(
                                        $("<span/>", {class: "glyphicon glyphicon-plus", "aria-hidden": "true"})
                                    ).append(
                                        $("<span/>", {class: "glyphicon glyphicon-user", "aria-hidden": "true"})
                                    )
                                )
                            )
                        )
                    )
                );
            });
            $("div.findfriends").replaceWith(userData);
        },
        discoverfriends: function (users) {
            var userData = $("<div/>", {class: "row discoverfriends"});
            $.each(users, function (key, val) {
                userData.append(
                    $("<div/>", {class: "col-md-3", id: "userid-" + val.id}).append(
                        $("<div/>", {class: "thumbnail"}).append(
                            // Swap with user image
                            $("<img/>", {src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI0MiAyMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMjQyIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjkyLjQ2ODc1IiB5PSIxMDAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MTFwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj4yNDJ4MjAwPC90ZXh0PjwvZz48L3N2Zz4="})
                        ).append(
                            $("<div/>", {class: "caption"}).append(
                                // Swap with user profile URL
                                $("<a/>", {href: "/user/" + val.id}).append(
                                    // Replace with user's display name
                                    $("<h3/>").text(val.name)
                                )
                            ).append(
                                // Create a progress bar generator here
                                renderMatches(val)
                            ).append(
                                $("<div/>", {class: "actions"}).append(
                                    $("<a/>", {class: "btn btn-default sendmail", href: "#sendmail-" + val.id}).append(
                                        $("<span/>", {class: "glyphicon glyphicon-envelope", "aria-hidden": "true"})
                                    )
                                ).append(
                                    $("<a/>", {
                                        class: "btn btn-default addfriend",
                                        href: "#addfriend-" + val.id
                                    }).append(
                                        $("<span/>", {class: "glyphicon glyphicon-plus", "aria-hidden": "true"})
                                    ).append(
                                        $("<span/>", {class: "glyphicon glyphicon-user", "aria-hidden": "true"})
                                    )
                                )
                            )
                        )
                    )
                );
            });
            $("div.discoverfriends").replaceWith(userData);
        }
    };

    /* Page specific logic */
    var mainElement = $("div.existingfriends, div.discoverfriends, div.findfriends");
    console.log(mainElement);
    if (mainElement.length) {
        mainElement = mainElement[0].classList[1];
        switch (mainElement) {
            case 'discoverfriends':
            case 'findfriends':
            case 'existingfriends':
                $.getJSON('/friend/api/' + mainElement, function (data) {
                    output[mainElement](data);
                    registerClickhooks();
                });
                break;
            default:
                break;
        }
    }

};
$(document).ready(friend);