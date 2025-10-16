var GetUpdateSetArtifacts = Class.create();
GetUpdateSetArtifacts.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    getArtifacts: function() {
		var instanceUrl = gs.getProperty('doc.uri'); 
		
        var updates = this.getParameter('sysparm_updates') || '';
        var updatesArr = updates.split(/\s*,\s*/).map(function(u){ return u.trim(); });

        var notTypes = this.getParameter('sysparm_notTypes') || '';
        var notTypesArr = notTypes.split(/\s*,\s*/).map(function(u){ return u.trim(); });

        var types = this.getParameter('sysparm_types') || '';
        var typesArr = types.split(/\s*,\s*/).map(function(u){ return u.trim(); });

        var result = [];
        var gr = new GlideRecord('sys_update_xml');
        gr.addQuery('update_set.name', 'IN', updatesArr);
        this.getParameter('sysparm_types') ? gr.addQuery('type', 'IN', typesArr) : '';
        this.getParameter('sysparm_notTypes') ? gr.addQuery('type', 'NOT IN', notTypesArr) : '';
        gr.query();

		var total = gr.getRowCount();

        while (gr.next()) {
            var link = "";
			var nameMatch = gr.name.match(/^(.*)_([0-9a-f]{32})$/i);
			if (nameMatch) link = instanceUrl + nameMatch[1] + ".do?sys_id=" + nameMatch[2];

            result.push({
                name: gr.target_name.toString() || "Não informado",
                link: (link === '#' ? "Não informado" : link),
                type: gr.type.toString() || "Não informado",
                updateSet: gr.update_set.name.toString() || "Não informado",
				application: gr.application.name.toString() || "Não informado",
				action: gr.action.toString() || "Não informado",
				count: total.toString()
            });
        }

        return JSON.stringify(result);
    },

    type: 'GetUpdateSetArtifacts'
});
