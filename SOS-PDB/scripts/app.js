(function () {
    var apiKey = "68s7rFRK3GauGzv2";
    var el = new Everlive(apiKey);

    var childrenDataSource = new kendo.data.DataSource({
        type: "everlive",
        sort: {
            field: "LastName",
            dir: "asc"
        },
        transport: {
            typeName: "Child"
        }
    });

    function initialize() {

        var app = new kendo.mobile.Application(document.body, {
            skin: "flat",
            transition: "slide"
        });

        $("#children-list").kendoMobileListView({
            dataSource: childrenDataSource,
            template: "#: LastName #, #: FirstName #"
        });

		navigator.splashscreen.hide();
    }

    window.loginView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Ingresa tu nombre de usuario.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Ingresa tu password.");
                return;
            }
            el.Users.login(this.username, this.password,
                function (data) {
                    window.location.href = "#list";
                    childrenDataSource.read();
                },
                function () {
                    navigator.notification.alert("No hemos podido encontrar tu cuenta.");
                });
        }
    });

    window.registerView = kendo.observable({
        submit: function () {
            if (!this.username) {
                navigator.notification.alert("Ingrese su nombre de usuario.");
                return;
            }
            if (!this.password) {
                navigator.notification.alert("Ingrese su password.");
                return;
            }
            el.Users.register(this.username, this.password, {
                    Email: this.email
                },
                function () {
                    navigator.notification.alert("Tu cuenta se ha creado correctamente.");
                    window.location.href = "#login";
                },
                function () {
                    navigator.notification.alert("Desafortunadamente no hemos podido crear tu cuenta.");
                });
        }
    });
    window.passwordView = kendo.observable({
        submit: function () {
            if (!this.email) {
                navigator.notification.alert("Ingresa tu correo electronico.");
                return;
            }
            $.ajax({
                type: "POST",
                url: "https://api.everlive.com/v1/" + apiKey + "/Users/resetpassword",
                contentType: "application/json",
                data: JSON.stringify({
                    Email: this.email
                }),
                success: function () {
                    navigator.notification.alert("Tu password fue reseteado correctamente. Por favor verifica las instrucciones en tu correo electronico.");
                    window.location.href = "#login";
                },
                error: function () {
                    navigator.notification.alert("Lamentablemente, ocurrio un error reseteando tu password.")
                }
            });
        }
    });
    window.listView = kendo.observable({
        logout: function (event) {
            // Prevent going to the login page until the login call processes.
            event.preventDefault();
            el.Users.logout(function () {
                this.loginView.set("username", "");
                this.loginView.set("password", "");
                window.location.href = "#login";
            }, function () {
                navigator.notification.alert("Ocurrio un error mientras desconectabamos tu cuenta.");
            });
        }
    });
    window.addView = kendo.observable({
        add: function () {
            if (!this.FirstName) {
                navigator.notification.alert("Ingresa el nombre por favor.");
                return;
            }
            if (!this.LastName) {
                navigator.notification.alert("Ingresa el apellido por favor.");
                return;
            }
            childrenDataSource.add({
                FirstName: this.FirstName,
                LastName: this.LastName,
                Birthdate: this.Birthdate
            });
            childrenDataSource.one("sync", this.close);
            childrenDataSource.sync();
        },
        close: function () {
            $("#add").data("kendoMobileModalView").close();
            this.FirstName = "";
            this.LastName = "";
        }
    });

    document.addEventListener("deviceready", initialize);
}());