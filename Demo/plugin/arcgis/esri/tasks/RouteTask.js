// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("../geometry/support/normalizeUtils ../Graphic ../request ../core/promiseUtils ./support/NAMessage ./support/RouteResult ./Task ./support/NAServiceDescription dojo/_base/array dojo/_base/lang".split(" "),function(l,v,w,x,y,z,A,B,m,k){return A.createSubclass([B],{declaredClass:"esri.tasks.RouteTask",properties:{parsedUrl:{get:function(){var b=this._parseUrl(this.url);b.path+="/solve";return b}},url:{}},solve:function(b,c){var d=[],a=[],f={},g={};b.stops&&b.stops.features&&this._collectGeometries(b.stops.features,
a,"stops.features",f);b.barriers&&b.barriers.features&&this._collectGeometries(b.barriers.features,a,"barriers.features",f);b.polylineBarriers&&b.polylineBarriers.features&&this._collectGeometries(b.polylineBarriers.features,a,"polylineBarriers.features",f);b.polygonBarriers&&b.polygonBarriers.features&&this._collectGeometries(b.polygonBarriers.features,a,"polygonBarriers.features",f);return l.normalizeCentralMeridian(a).then(function(a){for(var b in f){var c=f[b];d.push(b);g[b]=a.slice(c[0],c[1])}return this._isInputGeometryZAware(g,
d)?this.getServiceDescription():x.resolve({dontCheck:!0})}.bind(this)).then(function(a){a.hasZ||a.dontCheck||this._dropZValuesOffInputGeometry(g,d);a={query:this._encode(k.mixin({},this.parsedUrl.query,{f:"json"},b.toJSON(g))),callbackParamName:"callback"};if(this.requestOptions||c)a=k.mixin({},this.requestOptions,c,a);return w(this.parsedUrl.path,a)}.bind(this)).then(this._handleSolveResponse)},_collectGeometries:function(b,c,d,a){a[d]=[c.length,c.length+b.length];b.forEach(function(a){c.push(a.geometry)})},
_handleSolveResponse:function(b){var c=[],d=[],a=b.data,f=a.routes?a.routes.features:[],g=a.stops?a.stops.features:[];b=a.barriers?a.barriers.features:[];var k=a.polygonBarriers?a.polygonBarriers.features:[],l=a.polylineBarriers?a.polylineBarriers.features:[],n=a.messages,h=m.forEach,p=m.indexOf,q=!0,e,r,t=a.routes&&a.routes.spatialReference||a.stops&&a.stops.spatialReference||a.barriers&&a.barriers.spatialReference||a.polygonBarriers&&a.polygonBarriers.spatialReference||a.polylineBarriers&&a.polylineBarriers.spatialReference;
h(a.directions||[],function(a){c.push(e=a.routeName);d[e]={directions:a}});h(f,function(a){-1===p(c,e=a.attributes.Name)&&(c.push(e),d[e]={});d[e].route=a});h(g,function(a){r=a.attributes;-1===p(c,e=r.RouteName||"esri.tasks.RouteTask.NULL_ROUTE_NAME")&&(c.push(e),d[e]={});"esri.tasks.RouteTask.NULL_ROUTE_NAME"!==e&&(q=!1);void 0===d[e].stops&&(d[e].stops=[]);d[e].stops.push(a)});0<g.length&&!0===q&&(d[c[0]].stops=d["esri.tasks.RouteTask.NULL_ROUTE_NAME"].stops,delete d["esri.tasks.RouteTask.NULL_ROUTE_NAME"],
c.splice(m.indexOf(c,"esri.tasks.RouteTask.NULL_ROUTE_NAME"),1));var u=[];h(c,function(a,b){d[a].routeName="esri.tasks.RouteTask.NULL_ROUTE_NAME"===a?null:a;d[a].spatialReference=t;u.push(z.fromJSON(d[a]))});a=function(a){h(a,function(b,c){b.geometry&&(b.geometry.spatialReference=t);a[c]=v.fromJSON(b)});return a};h(n,function(a,b){n[b]=y.fromJSON(a)});return{routeResults:u,barriers:a(b),polygonBarriers:a(k),polylineBarriers:a(l),messages:n}}})});