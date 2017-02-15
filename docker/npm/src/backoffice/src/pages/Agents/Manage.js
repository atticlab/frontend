var Conf      = require('../../config/Config.js'),
    Navbar    = require('../../components/Navbar.js'),
    Footer    = require('../../components/Footer.js'),
    Sidebar   = require('../../components/Sidebar.js'),
    Limits    = require('../../components/Limits'),
    Restricts = require('../../components/Restricts'),
    Helpers   = require('../../models/Helpers'),
    Auth      = require('../../models/Auth'),
    Pagination  = require('../../components/Pagination.js');

var Session = require('../../models/Session.js');

module.exports = {
    controller: function () {
        var ctrl = this;

        if (!Auth.username()) {
            return m.route('/');
        }

        this.is_initialized = m.prop(false);

        this.page = (m.route.param('page')) ? m.prop(Number(m.route.param('page'))) : m.prop(1);
        this.limit = Conf.pagination.limit;
        this.offset = (ctrl.page() - 1) * ctrl.limit;
        this.pagination_data = m.prop({func: "getAgentsList", page: ctrl.page()});

        this.agents = m.prop([]);

        this.getAgents = function () {
            m.onLoadingStart();
            return Auth.api().getAgentsList({limit: ctrl.limit, offset: ctrl.offset})
                .then(function(agents){
                    if (typeof agents.items != 'undefined') {
                        m.startComputation();
                        ctrl.agents(agents.items);
                        ctrl.is_initialized(true);
                        m.endComputation();
                    } else {
                        console.error('Unexpected response');
                        console.error(agents);
                    }
                })
                .catch(function(error) {
                    console.error(error);
                })
                .then(function() {
                    m.onLoadingEnd();
                });
        };

        ctrl.getAgents();

        this.toggleManageLimits = function (account_id) {
            ctrl.showManagePanel(m.component(Limits, account_id));
        };

        this.toggleManageRestricts = function (account_id) {
            ctrl.showManagePanel(m.component(Restricts, account_id));
        };

        this.showManagePanel = function(data) {
            m.startComputation();
            Session.modal(data, Conf.tr("Manage panel"), 'big');
            m.endComputation();
        }
    },

    view: function (ctrl) {
        return <div id="wrapper">
            {m.component(Navbar)}
            {m.component(Sidebar)}
            <div class="content-page">
                <div class="content">
                    <div class="container">
                        {(ctrl.is_initialized()) ?
                            <div>
                                {(ctrl.agents().length) ?
                                    <div class="panel panel-color panel-primary">
                                        <div class="panel-heading">
                                            <h3 class="panel-title">{Conf.tr('Registered agents')}</h3>
                                        </div>
                                        <div class="panel-body">
                                            <div class="alert alert-info">
                                                {Conf.tr('This page allows to view and modify current permissions and limits of the agents')}
                                            </div>
                                            <table class="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>{Conf.tr("Account account ID")}</th>
                                                    <th>{Conf.tr('Agent ID')}</th>
                                                    <th>{Conf.tr('Company CODE')}</th>
                                                    <th>{Conf.tr('Company')}</th>
                                                    <th>{Conf.tr('Agent type')}</th>
                                                    <th>{Conf.tr('Restrictions')}</th>
                                                    <th>{Conf.tr('Limits')}</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {ctrl.agents().map(function (agent) {
                                                    return <tr
                                                        class={agent.account_id ?
                                                                ''
                                                                :
                                                                'active'
                                                        }
                                                        >
                                                        <td>
                                                            {agent.account_id ?
                                                                <button
                                                                    class="btn-xs btn-warning waves-effect waves-light"
                                                                    onclick={function(){
                                                                        Session.modal(agent.account_id, Conf.tr("Agenr account ID"))
                                                                    }}
                                                                >{Conf.tr("Show account ID")}</button>
                                                            :
                                                                <span>{Conf.tr("Account ID is not approved yet")}</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            <span title={Conf.tr("Agent ID")}>{agent.id}</span>
                                                        </td>
                                                        <td>
                                                            <span title={Conf.tr("Company Code")}>{agent.cmp_code}</span>
                                                        </td>
                                                        <td>
                                                            <span title={Conf.tr("Company")}>{agent.cmp_title}</span>
                                                        </td>
                                                        <td>
                                                            <span title={Conf.tr("Agent type")}>{Helpers.getTextAgentType(agent.type)}</span>
                                                        </td>
                                                        <td style="text-align: center">
                                                            {agent.account_id ?
                                                                <button class="btn btn-primary btn-custom waves-effect waves-light btn-xs manage-restricts"
                                                                        onclick={ctrl.toggleManageRestricts.bind(ctrl, agent.account_id)}>{Conf.tr("Edit")}</button>
                                                                :
                                                                ''
                                                            }
                                                            </td>
                                                        <td>
                                                            {agent.account_id ?
                                                                <button class="btn btn-primary btn-custom waves-effect waves-light btn-xs"
                                                                        onclick={ctrl.toggleManageLimits.bind(ctrl, agent.account_id)}>{Conf.tr("Edit")}</button>
                                                                :
                                                                ''
                                                            }
                                                            </td>
                                                    </tr>
                                                })}
                                                </tbody>
                                            </table>
                                            {m.component(Pagination, {pagination: ctrl.pagination_data()})}
                                        </div>
                                    </div>
                                    :
                                    <div class="portlet">
                                        <div class="portlet-heading bg-warning">
                                            <h3 class="portlet-title">
                                                {Conf.tr('No agents found')}
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
                                                {Conf.tr('Please')}<a href='/agents/create' config={m.route}> {Conf.tr("create")}</a>!
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            :
                            <div class="portlet">
                                <div class="portlet-heading bg-primary">
                                    <h3 class="portlet-title">
                                        {Conf.tr('Wait for data loading')}...
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
                            </div>
                        }
                    </div>
                </div>
            </div>
            {m.component(Footer)}
        </div>
    }
};