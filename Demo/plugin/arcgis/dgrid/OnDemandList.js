//>>built
define("./List ./_StoreMixin dojo/_base/declare dojo/_base/lang dojo/dom-construct dojo/on dojo/when ./util/misc".split(" "),function(E,F,G,H,q,I,J,v){return G([E,F],{minRowsPerPage:25,maxRowsPerPage:250,maxEmptySpace:Infinity,bufferRows:10,farOffRemoval:2E3,queryRowsOverlap:0,pagingMethod:"debounce",pagingDelay:v.defaultDelay,keepScrollPosition:!1,rowHeight:0,postCreate:function(){this.inherited(arguments);var c=this;I(this.bodyNode,"scroll",v[this.pagingMethod](function(g){c._processScroll(g)},
null,this.pagingDelay))},renderQuery:function(c,g){var f=this,e=g&&g.container||this.contentNode,b={query:c,count:0},l,n=this.preload,h={node:q.create("div",{className:"dgrid-preload",style:{height:"0"}},e),count:0,query:c,next:b};h.node.rowIndex=0;b.node=l=q.create("div",{className:"dgrid-preload"},e);b.previous=h;l.rowIndex=this.minRowsPerPage;n?((b.next=n.next)&&l.offsetTop>=n.node.offsetTop?b.previous=n:(b.next=n,b.previous=n.previous),b.previous.next=b,b.next.previous=b):this.preload=b;var a=
q.create("div",{className:"dgrid-loading"},l,"before");q.create("div",{className:"dgrid-below"},a).innerHTML=this.loadingMessage;g=H.mixin({start:0,count:this.minRowsPerPage},"level"in c?{queryLevel:c.level}:null);return this._trackError(function(){var e=c(g);return f.renderQueryResults(e,l,g).then(function(c){return e.totalLength.then(function(e){var h=c.length,n=l.parentNode;f._rows&&(f._rows.min=0,f._rows.max=h===e?Infinity:h-1);q.destroy(a);"queryLevel"in g||(f._total=e);0===e&&n&&(f.noDataNode&&
q.destroy(f.noDataNode),f._insertNoDataNode(n));f._calcAverageRowHeight(c);e-=h;b.count=e;l.rowIndex=h;e?l.style.height=Math.min(e*f.rowHeight,f.maxEmptySpace)+"px":l.style.display="none";f._previousScrollPosition&&(f.scrollTo(f._previousScrollPosition),delete f._previousScrollPosition);return J(f._processScroll()).then(function(){return c})})}).otherwise(function(b){q.destroy(a);throw b;})})},refresh:function(c){var g=this,f=c&&c.keepScrollPosition;"undefined"===typeof f&&(f=this.keepScrollPosition);
f&&(this._previousScrollPosition=this.getScrollPosition());this.inherited(arguments);if(this._renderedCollection)return this.renderQuery(function(c){return g._renderedCollection.fetchRange({start:c.start,end:c.start+c.count})}).then(function(){g._emitRefreshComplete()})},resize:function(){this.inherited(arguments);this.rowHeight||this._calcAverageRowHeight(this.contentNode.getElementsByClassName("dgrid-row"));this._processScroll()},cleanup:function(){this.inherited(arguments);this.preload=null},renderQueryResults:function(c){var g=
this.inherited(arguments),f=this._renderedCollection;f&&f.releaseRange&&g.then(function(e){e[0]&&!e[0].parentNode.tagName&&c.totalLength.then(function(){f.releaseRange(e[0].rowIndex,e[e.length-1].rowIndex+1)})});return g},_getFirstRowSibling:function(c){return c.lastChild},_calcRowHeight:function(c){var g=c.nextSibling;return g&&!/\bdgrid-preload\b/.test(g.className)?g.offsetTop-c.offsetTop:c.offsetHeight},_calcAverageRowHeight:function(c){for(var g=c.length,f=0,e=0;e<g;e++)f+=this._calcRowHeight(c[e]);
g&&f&&(this.rowHeight=f/g)},lastScrollTop:0,_processScroll:function(c){function g(a,c,e,g){var d=b.farOffRemoval,h=a.node;if(c>2*d){for(var k,l=h[e],z=0,m=0,n=[],p=l&&l.rowIndex,u;k=l;){var r=b._calcRowHeight(k);if(z+r+d>c||0>l.className.indexOf("dgrid-row")&&0>l.className.indexOf("dgrid-loading"))break;l=k[e];z+=r;m+=k.count||1;b.removeRow(k,!0);n.push(k);"rowIndex"in k&&(u=k.rowIndex)}b._renderedCollection.releaseRange&&"number"===typeof p&&"number"===typeof u&&(g?b._renderedCollection.releaseRange(u,
p+1):b._renderedCollection.releaseRange(p,u+1),b._rows[g?"max":"min"]=u,b._rows.max>=b._total-1&&(b._rows.max=Infinity));a.count+=m;g?(h.rowIndex-=m,f(a)):h.style.height=h.offsetHeight+z+"px";var t=document.createElement("div");for(a=n.length;a--;)t.appendChild(n[a]);setTimeout(function(){q.destroy(t)},1)}}function f(a,c){a.node.style.height=Math.min(a.count*b.rowHeight,c?Infinity:b.maxEmptySpace)+"px"}function e(b,a){do b=a?b.next:b.previous;while(b&&!b.node.offsetWidth);return b}if(this.rowHeight){var b=
this,l=b.bodyNode;c=c&&c.scrollTop||this.getScrollPosition().y;var l=l.offsetHeight+c,n,h,a=b.preload,v=b.lastScrollTop,x=b.bufferRows*b.rowHeight,C=x-b.rowHeight,D,y=!0;for(b.lastScrollTop=c;a&&!a.node.offsetWidth;)a=a.previous;for(;a&&a!==n;){n=b.preload;b.preload=a;h=a.node;var d=h.offsetTop;if(l+1+C<d)a=e(a,y=!1);else if(c-1-C>d+h.offsetHeight)a=e(a,y=!0);else{var d=((h.rowIndex?c-x:l)-d)/b.rowHeight,k=(l-c+2*x)/b.rowHeight,k=k+Math.min(Math.abs(Math.max(Math.min((c-v)*b.rowHeight,b.maxRowsPerPage/
2),b.maxRowsPerPage/-2)),10);0===h.rowIndex&&(d-=k);d=Math.max(d,0);10>d&&0<d&&k+d<b.maxRowsPerPage&&(k+=Math.max(0,d),d=0);k=Math.min(Math.max(k,b.minRowsPerPage),b.maxRowsPerPage,a.count);if(0===k)a=e(a,y);else{var k=Math.ceil(k),d=Math.min(Math.floor(d),a.count-k),m={};a.count-=k;var p=h,w,r=b.queryRowsOverlap,A=(0<h.rowIndex||h.offsetTop>c)&&a;if(A){var t=a.previous;t&&(g(t,c-(t.node.offsetTop+t.node.offsetHeight),"nextSibling"),0<d&&t.node===h.previousSibling?(d=Math.min(a.count,d),a.previous.count+=
d,f(a.previous,!0),h.rowIndex+=d,r=0):k+=d,a.count-=d);m.start=h.rowIndex-r;m.count=Math.min(k+r,b.maxRowsPerPage);h.rowIndex=m.start+m.count}else a.next&&(g(a.next,a.next.node.offsetTop-l,"previousSibling",!0),p=h.nextSibling,p===a.next.node?(a.next.count+=a.count-d,a.next.node.rowIndex=d+k,f(a.next),a.count=d,r=0):w=!0),m.start=a.count,m.count=Math.min(k+r,b.maxRowsPerPage);w&&p&&p.offsetWidth&&(w=p.offsetTop);f(a);"level"in a.query&&(m.queryLevel=a.query.level);if("queryLevel"in m||!(m.start>b._total||
0>m.count)){var B=q.create("div",{className:"dgrid-loading",style:{height:k*b.rowHeight+"px"}},p,"before");q.create("div",{className:"dgrid-"+(A?"below":"above"),innerHTML:b.loadingMessage},B);B.count=k;b._trackError(function(){(function(c,e,g){var h=a.query(m);D=b.renderQueryResults(h,c,m).then(function(a){var d=b._rows;!d||"queryLevel"in m||!a.length||(e?(d.max<=d.min&&(d.min=a[0].rowIndex),d.max=a[a.length-1].rowIndex):(d.max<=d.min&&(d.max=a[a.length-1].rowIndex),d.min=a[0].rowIndex));p=c.nextSibling;
q.destroy(c);g&&p&&p.offsetWidth&&(d=b.getScrollPosition(),b.scrollTo({x:d.x,y:d.y+p.offsetTop-g,preserveMomentum:!0}));h.totalLength.then(function(a){"queryLevel"in m||(b._total=a,b._rows&&b._rows.max>=b._total-1&&(b._rows.max=Infinity));e&&(e.count=a-e.node.rowIndex,f(e))});b._processScroll();return a},function(a){q.destroy(c);throw a;})})(B,A,w)});a=a.previous}}}}return D}}})});