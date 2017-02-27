var Conf = require('../../config/Config.js'),
    Navbar = require('../../components/Navbar.js'),
    Footer = require('../../components/Footer.js'),
    Sidebar = require('../../components/Sidebar.js'),
    Auth    = require('../../models/Auth');

module.exports = {
    controller: function () {
        var ctrl = this;

        if (!Auth.keypair()) {
            return m.route('/');
        }

        this.asset          = m.prop('');
        this.surname        = m.prop('');
        this.name           = m.prop('');
        this.middle_name    = m.prop('');
        this.email          = m.prop('');
        this.phone          = m.prop('');
        this.address        = m.prop('');
        this.ipn_code       = m.prop('');
        this.passport       = m.prop('');

        this.assets = m.prop([]);

        this.getAssets = function () {
            return Conf.horizon.assets()
                .call()
                .then((assets) => {
                    m.startComputation();
                    ctrl.assets(assets.records);
                    m.endComputation();
                })
                .catch(() => {
                    m.flashError(Conf.tr("Error requesting currencies"));
                })
        };

        this.getAssets();

        this.clearForm = function () {
            m.startComputation();
            ctrl.asset('');
            ctrl.surname('');
            ctrl.name('');
            ctrl.middle_name('');
            ctrl.email('');
            ctrl.phone('');
            ctrl.address('');
            ctrl.ipn_code('');
            ctrl.passport('');
            m.endComputation();
        };

        this.createRegisteredUser = function (e) {
            e.preventDefault();

            m.onLoadingStart();

            ctrl.asset(e.target.asset.value);
            ctrl.surname(e.target.surname.value);
            ctrl.name(e.target.name.value);
            ctrl.middle_name(e.target.middle_name.value);
            ctrl.email(e.target.email.value);
            ctrl.phone(e.target.phone.value);
            ctrl.address(e.target.address.value);
            ctrl.ipn_code(e.target.ipn_code.value);
            ctrl.passport(e.target.passport.value);

            var form_data = {
                asset       : ctrl.asset(),
                surname     : ctrl.surname(),
                name        : ctrl.name(),
                middle_name : ctrl.middle_name(),
                email       : ctrl.email(),
                phone       : ctrl.phone(),
                address     : ctrl.address(),
                ipn_code    : ctrl.ipn_code(),
                passport    : ctrl.passport()
            };

            Conf.SmartApi.Regusers.create(form_data)
                .then(function() {
                    ctrl.clearForm();
                    m.flashSuccess(Conf.tr('Success') + '. ' + Conf.tr('Enrollment was sent to email'));
                })
                .catch(function(error) {
                    console.error(error);
                    if (error.name === 'ApiError') {
                        return m.flashApiError(error);
                    }

                    return m.flashError(Conf.tr('Can not create registered user'));
                });
        };
    },

    view: function (ctrl) {
        return <div id="wrapper">
            {m.component(Navbar)}
            {m.component(Sidebar)}
            <div class="content-page">
                <div class="content">
                    <div class="container">
                        {
                            ctrl.assets().length ?
                                <div class="panel panel-primary panel-border">
                                    <div class="panel-heading">
                                        <h3 class="panel-title">{Conf.tr("Create new registered user")}</h3>
                                    </div>
                                    <div class="panel-body">
                                        <div class="col-lg-6">
                                            <form class="form-horizontal" role="form" method="post" onsubmit={ctrl.createRegisteredUser.bind(ctrl)}>
                                                <div class="form-group">
                                                    <label for="select" class="col-lg-2 control-label">{Conf.tr("Currency")}</label>
                                                    <div class="col-lg-6">
                                                        <select class="form-control" name="asset" id="input_asset">
                                                            {
                                                                ctrl.assets().map(function (asset) {
                                                                    return <option
                                                                        value={asset.asset_code}
                                                                        selected={ctrl.asset() && ctrl.asset() == asset.asset_code ? 'selected' : ''}
                                                                    >{asset.asset_code}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_surname" class="col-md-2 control-label">{Conf.tr("Surname")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="surname"
                                                               value={ctrl.surname()}
                                                               id="input_surname" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_name" class="col-md-2 control-label">{Conf.tr("Name")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="name"
                                                               value={ctrl.name()}
                                                               id="input_name" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_middle_name" class="col-md-2 control-label">{Conf.tr("Middle name")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="middle_name"
                                                               value={ctrl.middle_name()}
                                                               id="input_middle_name" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_email" class="col-md-2 control-label">{Conf.tr("Email")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="email"
                                                               value={ctrl.email()}
                                                               id="input_email" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_phone" class="col-md-2 control-label">{Conf.tr("Phone")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="phone"
                                                               value={ctrl.phone()}
                                                               id="input_phone" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_address" class="col-md-2 control-label">{Conf.tr("Address")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="address"
                                                               value={ctrl.address()}
                                                               id="input_address" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_ident_code" class="col-md-2 control-label">{Conf.tr("Ident. code")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="ipn_code"
                                                               value={ctrl.ipn_code()}
                                                               id="input_ipn_code" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="input_passport" class="col-md-2 control-label">{Conf.tr("Passport")}</label>
                                                    <div class="col-md-6">
                                                        <input class="form-control" name="passport"
                                                               value={ctrl.passport()}
                                                               id="input_passport" type="text" />
                                                    </div>
                                                </div>
                                                <div class="form-group m-b-0">
                                                    <div class="col-sm-offset-2 col-sm-3">
                                                        <button type="submit"
                                                                class="btn btn-primary btn-custom waves-effect w-md waves-light m-b-5">{Conf.tr("Create")}</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div class="portlet">
                                    <div class="portlet-heading bg-warning">
                                        <h3 class="portlet-title">
                                            {Conf.tr('No assets found')}
                                        </h3>
                                        <div class="portlet-widgets">
                                            <a data-toggle="collapse" data-parent="#accordion1" href="#bg-warning">
                                                <i class="ion-minus-round"></i>
                                            </a>
                                            <span class="divider"></span>
                                            <a href="#" data-toggle="remove"><i class="ion-close-round"></i></a>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                    <div id="bg-warning" class="panel-collapse collapse in">
                                        <div class="portlet-body">
                                            {Conf.tr('Please')}<a href='/currencies/create' config={m.route}> {Conf.tr("create")}</a>!
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
            {m.component(Footer)}
        </div>
    }
};