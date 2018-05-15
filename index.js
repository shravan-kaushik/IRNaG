alertify.defaults = {
    autoReset:true,
    basic:false,
    closable:true,
    closableByDimmer:true,
    frameless:false,
    maintainFocus:true,
    maximizable:true,
    modal:true,
    movable:true,
    moveBounded:false,
    overflow:true,
    padding: true,
    pinnable:true,
    pinned:true,
    preventBodyShift:false,
    resizable:true,
    startMaximized:false,
    transition:"",

    // notifier defaults
    notifier:{
        // auto-dismiss wait time (in seconds)  
        delay:5,
        // default position
        position:"bottom-right",
        // adds a close button to notifier messages
        closeButton: false
    },

    // language resources 
    glossary:{
        // dialogs default title
        title:"",
        // ok button text
        ok: "Yes",
        // cancel button text
        cancel: "No"            
    },

    // theme settings
    theme:{
        // class name attached to prompt dialog input textbox.
        input:"box is-small is-size-5-desktop is-size-7-touch",
        // class name attached to ok button
        ok:"button is-small is-size-5-desktop is-size-7-touch",
        // class name attached to cancel button 
        cancel:"button is-primary is-size-5-desktop is-size-7-touch"
    }
};

var options = {
    tripTheme: "dark",
    finishLabel: "Gotcha!",
    showNavigation: true,
    delay: -1,
};


$(document).ready(function() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (w < 400 ) {
        $("#input_new_name").attr("placeholder", "");
    }
    else {
        $("#input_new_name").attr("placeholder", "Add a name...");
    }


    $(window).resize(function(){
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if(w < 400){
            $("#input_new_name").attr("placeholder", "");
        }
        else{
            $("#input_new_name").attr("placeholder", "Add a name...");
        }
    });


    $(".modal-close").click(function() {
        $(".modal").removeClass("is-active");
    });

    var app = new Vue({
        el: "#app",
        data: {
            source_names: name_set["source"],
            result_names: name_set["result"],
            new_name: "",
        },
        methods: {
            gen_names: function() {
                if (name_set["source"].length < 1) {
                    // alert("You need to enter at least one name!");
                    $("#modal-need-at-least-one-name").addClass("is-active");
                    $("#input_new_name").addClass("is-warning");
                    $(".modal-background").click(function() {
                        $(".modal").removeClass("is-active");
                    });
                    return;
                }

                $("#button_generate").addClass("is-loading");

                name_set["result"].length = 0;
                var count = 0;

                for (var i=0; i < 1000; i++) { // fixed at 1000 to avoid an infinite loop
                    name = generate_name("source").trim();
                    if ((name_set["result"].indexOf(name) === -1) && (name_set["source"].indexOf(name) === -1)) {
                        name_set["result"].push(name);
                        count++;
                    }
                    if (count == 15) break;
                }

                if (count < 1) {
                    // alert("Failed to generate new names. Try adding more names you like.");
                    $("#modal-failed-to-create-names").addClass("is-active");
                    $(".modal-background").click(function() {
                        $(".modal").removeClass("is-active");
                    });
                }

                $("#button_generate").removeClass("is-loading");
            },
            add_name: function(name) {
                name = name.trim();
                if (!name) {
                    this.new_name = "";
                    return;
                }
                if (name_set["source"].indexOf(name) === -1) {
                    name_set["source"].push(name);
                }
                $("#input_new_name").removeClass("is-warning");
                this.new_name = "";
                name_set["source"].sort();
            },
            remove_name: function(name) {
                alertify.confirm("Are you sure you want to remove '" + name + "'?", function () {
                    var index = name_set["source"].indexOf(name);
                        if (index > -1) {
                            name_set["source"].splice(index, 1);
                        }
                });
            },
        }
    });


    var trip = new Trip([
        {
            sel: $("#input_new_name"),
            content: "Enter a name here, and press the 'Enter' key...",
            position: "s"
        },
        {
            sel: $("#button_generate"),
            content: "Click on this button to generate names based on the name(s) you like.",
            position: "s"
        }
    ], options);
    trip.start();

});
