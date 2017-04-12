define(['readium_shared_js/helpers'], function(Helpers) {
    
var biblemesh_Helpers = {};
var serverTimeOffset = 0;

/**
 *
 * @returns object (map between URL query parameter names and corresponding decoded / unescaped values)
 */
biblemesh_Helpers.getURLQueryParams = function() {
    var params = Helpers.getURLQueryParams();

    if(window.location.pathname.match(/^\/book\/([0-9]+)$/)) {
        var bookId = parseInt(window.location.pathname.replace(/^\/book\/([0-9]+)$/, '$1'), 10);
        params['epub'] = '/epub_content/book_' + bookId;
    }

    return params;
};


/**
 * @param urlpath: string corresponding a URL without query parameters (i.e. the part before the '?' question mark in index.html?param=value). If undefined/null, the default window.location is used.
 * @param overrides: object that maps query parameter names with values (to be included in the resulting URL, while any other query params in the current window.location are preserved as-is) 
 * @returns a string corresponding to a URL obtained by concatenating the given URL with the given query parameters (and those already in window.location)
 */
biblemesh_Helpers.buildUrlQueryParameters = function(urlpath, overrides, ignoreCurrentQueryParams) {
    
    if (!urlpath) {
        urlpath =
        window.location ? (
            window.location.protocol
            + "//"
            + window.location.hostname
            + (window.location.port ? (':' + window.location.port) : '')
            // + window.location.pathname
        ) : 'index.html';
    }

    var epubRegEx = /^.*?epub_content\/book_([0-9]+)$/;
    if((overrides.epub || "").match(epubRegEx)) {
        urlpath = overrides.epub.replace(epubRegEx, '/book/$1');
    }

    var paramsString = "";
    
    for (var key in overrides) {
        if (!overrides.hasOwnProperty(key)) continue;
        
        if (!overrides[key]) continue;

        if (key == 'epub') continue;
        
        var val = overrides[key].trim();
        if (!val) continue;
        
        console.debug("URL QUERY PARAM OVERRIDE: " + key + " = " + val);

        paramsString += (key + "=" + encodeURIComponent(val));
        paramsString += "&";
    }
    
    var urlParams = ignoreCurrentQueryParams ? {} : biblemesh_Helpers.getURLQueryParams();
    for (var key in urlParams) {
        if (!urlParams.hasOwnProperty(key)) continue;
        
        if (!urlParams[key]) continue;
        
        if (overrides[key]) continue;

        var val = urlParams[key].trim();
        if (!val) continue;
        
        console.debug("URL QUERY PARAM PRESERVED: " + key + " = " + val);

        paramsString += (key + "=" + encodeURIComponent(val));
        paramsString += "&";
    }
    
    return urlpath + "?" + paramsString;
};

biblemesh_Helpers.setupGoogleAnalytics = function(gaCode) {
    // biblemesh_: Google Analytics code below is new
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', gaCode, 'auto');
}

biblemesh_Helpers.setServerTimeOffset = function(currentServerTime) {
    serverTimeOffset = currentServerTime - new Date().getTime();
    console.log('Set serverTimeOffset to ' + serverTimeOffset);
}

biblemesh_Helpers.getUTCTimeStamp = function() {
    return new Date().getTime() + serverTimeOffset;
}

biblemesh_Helpers.getCurrentSpotInfo = function() {
    var urlParams = biblemesh_Helpers.getURLQueryParams();
    return {
        ebookURL: urlParams['epub'],
        ebookSpot: urlParams['goto'],
        bookId: parseInt((urlParams['epub'] || "").replace(/^.*?book_([0-9]+).*$/, '$1') , 10) || 0
    };
}

return biblemesh_Helpers;
});
