// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("require exports ../core/tsSupport/extendsHelper ../core/tsSupport/decorateHelper ../core/typescript ./core/messageHandler".split(" "),function(c,h,k,f,g,d){c=function(){function b(a){this.dataSourceProxy=null;this._featureIds={}}b.prototype.dojoConstructor=function(a){this.dataSourceProxy=a;this._featureIds={}};b.prototype._addFeature=function(a){if(!this.dataSourceProxy||!a)return null;var e=a;if("object"===typeof a){if(!a.attributes||!a.attributes[this.dataSourceProxy.objectIdFieldName])return null;
e=a.attributes[this.dataSourceProxy.objectIdFieldName]}return this._featureIds[e]=e};b.prototype.addFeature=function(a){this.dataSourceProxy&&(a=this._addFeature(a))&&d._sendMessage({functionName:"featureActionFeaturesAdded",args:{dataSourceId:this.dataSourceProxy.id,objectIds:[a]}})};b.prototype.addFeatures=function(a){var e=this;if(this.dataSourceProxy&&Array.isArray(a)&&0!==a.length){var b=[];a.forEach(function(a){(a=e._addFeature(a))&&b.push(a)});0!==b.length&&d._sendMessage({functionName:"featureActionFeaturesAdded",
args:{dataSourceId:this.dataSourceProxy.id,objectIds:b}})}};b.prototype._removeFeature=function(a){if(!this.dataSourceProxy||!a)return null;var b=a;if("object"===typeof a){if(!a.attributes||!a.attributes[this.dataSourceProxy.objectIdFieldName])return null;b=a.attributes[this.dataSourceProxy.objectIdFieldName]}if(!this._featureIds[b])return null;delete this._featureIds[b];return b};b.prototype.removeFeature=function(a){this.dataSourceProxy&&(a=this._removeFeature(a))&&d._sendMessage({functionName:"featureActionFeaturesRemoved",
args:{dataSourceId:this.dataSourceProxy.id,objectIds:[a]}})};b.prototype.removeFeatures=function(a){var b=this;if(this.dataSourceProxy&&Array.isArray(a)&&0!==a.length){var c=[];a.forEach(function(a){(a=b._removeFeature(a))&&c.push(a)});0!==c.length&&d._sendMessage({functionName:"featureActionFeaturesRemoved",args:{dataSourceId:this.dataSourceProxy.id,objectIds:c}})}};b.prototype.clear=function(){this.dataSourceProxy&&(this._featureIds={},d._sendMessage({functionName:"featureActionFeaturesClear"}))};
b.prototype.indexOf=function(a){if(!this.dataSourceProxy||!a)return-1;var b=a;if("object"===typeof a){if(!a.attributes||!a.attributes[this.dataSourceProxy.objectIdFieldName])return-1;b=a.attributes[this.dataSourceProxy.objectIdFieldName]}return this._featureIds[b]||-1};b.prototype.contains=function(a){return-1!==this.indexOf(a)};return b}();return c=f([g.subclass()],c)});