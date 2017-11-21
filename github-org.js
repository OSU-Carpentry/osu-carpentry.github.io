jQuery.githubOrg = function(orgname, callback) {
   jQuery.getJSON('https://api.github.com/orgs/'+orgname+'/repos?callback=?',callback)
}
 
jQuery.fn.loadRepositories = function(orgname) {
    this.html("<span>Querying GitHub for " + orgname +"'s repositories...</span>");
     
    var target = this;
    $.githubOrg(orgname, function(data) {
        var repos = data.data; // JSON Parsing
        //sortByName(repos);    
        reverseSortByName(repos);    
     
        var list = $('<dl/>');
        target.empty().append(list);
        $(repos).each(function() {
            //if (this.name != (orgname.toLowerCase()+'.github.io')) {
            if (this.homepage && this.name.match(/^20[0-9][0-9]-[01][0-9]-[0-3][0-9]-.*$/)) {
                //list.append('<dt><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a> <em>'+(this.language?('('+this.language+')'):'')+'</em></dt>');
                list.append('<dt><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a></dt>');
                list.append('<dd>' + this.description +'</dd>');
            }
        });     
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
