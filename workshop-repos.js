jQuery.githubOrg = function(orgname, callback) {
   jQuery.getJSON('https://api.github.com/orgs/'+orgname+'/repos?per_page=100&callback=?',callback)
}
 
jQuery.fn.loadWorkshopRepositories = function(orgname) {
    this.html("<span>Querying GitHub for " + orgname +"'s repositories...</span>");
     
    var target = this;
    $.githubOrg(orgname, function(data) {
        var repos = data.data; // JSON Parsing
        //sortByName(repos);    
        reverseSortByName(repos);    
     
        // Create html elements for the workshop lists
        // These are not yet added to the page
        var future_header = '<h2>Current Workshops</h2>';
        var past_header = '<h2>Past Workshops</h2>';
        var future_list = $('<dl/>');
        var list = $('<dl/>');

        // Add entries for each workshop repo into the appropriate list
        $(repos).each(function() {
            // Only include repositories that have pages enabled
            // AND that have names matching the workshop pattern
            // i.e. "YYYY-mm-dd-somewhere"
            if (this.homepage && this.name.match(/^20[0-9][0-9]-[01][0-9]-[0-3][0-9]-.*$/)) {
                /* We'll consider a workshop to be in the past if the current
                   date is two days or more past the date in the repo name,
                   otherwise we'll consider it to be current/future. */
                var workshop_date = new Date(this.name.substring(0, 10));
                var elapsed_time = Date.now() - workshop_date;
                var two_days = 1000 * 2 * 86400; // two days in milliseconds

                /* Create a dt tag with the repo name as a link to the workshop 
                   page, and a dd tag with the workshop description. */
                var workshop_entry = '<dt><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a></dt>' + '<dd>' + this.description + '</dd>';

                if (elapsed_time < two_days) { 
                    future_list.append(workshop_entry);
                } else {
                    list.append(workshop_entry);
                }
            }
        }); // end adding repos to lists

        // Clear the target div and add the workshop lists
        target.empty();
        // Omit the current/future header and list if there aren't any workshops
        if (future_list.children().length > 0) {
            target.append(future_header);
            target.append(future_list);
        }
        target.append(past_header);
        target.append(list);
    });
      
    function sortByName(repos) {
        repos.sort(function(a,b) {
        return a.name.localeCompare( b.name );
       });
    }

    function reverseSortByName(repos) {
        repos.sort(function(a,b) {
        return b.name.localeCompare( a.name );
       });
    }
};
