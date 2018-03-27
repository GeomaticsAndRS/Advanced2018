// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See https://js.arcgis.com/4.4/esri/copyright.txt for details.
//>>built
define("require exports ../../../../core/Logger ../../lib/glMatrix ../../webgl-engine/materials/HUDMaterial ./Graphics3DWebStyleSymbol".split(" "),function(h,k,q,l,r,t){function m(a){return a instanceof t?a.graphics3DSymbol:a}function n(a){return{screenLength:a.screenLength,minWorldLength:a.minWorldLength,maxWorldLength:a.maxWorldLength}}Object.defineProperty(k,"__esModule",{value:!0});var u=q.getLogger("esri.views.3d.graphics.Labeling");k.get=function(a){var b=e[a.labelClass.labelPlacement]||e["default"],
d=a.graphics3DGraphic._graphics[0],c=d.graphics3DSymbolLayer.getGraphicElevationInfo(a.graphics3DGraphic.graphic),b={placement:b.placement,anchor:b.anchor,normalizedOffset:b.normalizedOffset,needsOffsetAdjustment:d.isDraped()?void 0:c.hasOffsetAdjustment,verticalOffset:null,screenOffset:[0,0],centerOffset:[0,0,0,-1],centerOffsetUnits:"world",translation:[0,0,0],elevationOffset:0,hasLabelVerticalOffset:!1,isValid:!0},d=a.labelSymbol,c=a.graphics3DGraphic,f=m(c.graphics3DSymbol).symbol;if("point-symbol-3d"===
f.type&&f.supportsCallout()&&f.hasVisibleVerticalOffset()&&!c.isDraped())b.verticalOffset=n(f.verticalOffset);else if(d&&d.hasVisibleCallout()&&(!f.supportsCallout()||!f.verticalOffset||c.isDraped())){a:switch(b.placement){case "above-center":c=!0;break a;default:c=!1}c?(b.verticalOffset=n(d.verticalOffset),b.anchor="bottom",b.normalizedOffset=[0,b.normalizedOffset[1],0],b.hasLabelVerticalOffset=!0):(u.error("verticalOffset","Callouts and vertical offset on labels are currently only supported with above-center label placement (not with "+
b.placement+" placement)"),b.isValid=!1)}switch(a.graphic.geometry.type){case "polyline":case "polygon":case "extent":b.anchor="center";break;case "point":switch(c=a.graphics3DGraphic,d=m(c.graphics3DSymbol).symbol.symbolLayers.getItemAt(0),c=c.getCenterObjectSpace(),l.vec3d.set(c,b.translation),d.type){case "icon":case "text":c=a.graphics3DGraphic;d=c._graphics[0].getScreenSize();c.isDraped()?b.hasLabelVerticalOffset||(b.anchor="center"):(c=void 0,void 0===c&&(c=v),a=a.graphics3DGraphic._graphics[0].stageObject.getGeometryRecords()[0].materials[0],
a instanceof r?(a=a.getParams().anchorPos,c[0]=2*(a[0]-.5),c[1]=2*(a[1]-.5)):(c[0]=0,c[1]=0),a=c,g[0]=d[0]/2*(b.normalizedOffset[0]-a[0]),g[1]=d[1]/2*(b.normalizedOffset[1]-a[1]),b.screenOffset[0]=g[0],b.hasLabelVerticalOffset?(b.centerOffset[1]=g[1],b.centerOffsetUnits="screen"):b.screenOffset[1]=g[1]);break;case "object":a=a.graphics3DGraphic._graphics[0].getBoundingBoxObjectSpace(),a=[a[3]-a[0],a[4]-a[1],a[5]-a[2]],b.centerOffset[0]=1.1*Math.max(a[0],a[1])/2*b.normalizedOffset[0],d=a[2]/2*b.normalizedOffset[1]+
b.translation[2],b.translation[2]=d*(1.1-1),b.elevationOffset=d,a=l.vec3d.length(a),b.centerOffset[2]=1.1*a/2*b.normalizedOffset[2]}}return b};var e={"above-center":{placement:"above-center",normalizedOffset:[0,1,0],anchor:"bottom"},"above-left":{placement:"above-left",normalizedOffset:[-1,1,0],anchor:"bottom-right"},"above-right":{placement:"above-right",normalizedOffset:[1,1,0],anchor:"bottom-left"},"below-center":{placement:"below-center",normalizedOffset:[0,-1,2],anchor:"top"},"below-left":{placement:"below-left",
normalizedOffset:[-1,-1,0],anchor:"top-right"},"below-right":{placement:"below-right",normalizedOffset:[1,-1,0],anchor:"top-left"},"center-center":{placement:"center-center",normalizedOffset:[0,0,1],anchor:"center"},"center-left":{placement:"center-left",normalizedOffset:[-1,0,0],anchor:"right"},"center-right":{placement:"center-right",normalizedOffset:[1,0,0],anchor:"left"}},p={"above-center":["default","esriServerPointLabelPlacementAboveCenter"],"above-left":["esriServerPointLabelPlacementAboveLeft"],
"above-right":["esriServerPointLabelPlacementAboveRight"],"below-center":["esriServerPointLabelPlacementBelowCenter"],"below-left":["esriServerPointLabelPlacementBelowLeft"],"below-right":["esriServerPointLabelPlacementBelowRight"],"center-center":["esriServerPointLabelPlacementCenterCenter"],"center-left":["esriServerPointLabelPlacementCenterLeft"],"center-right":["esriServerPointLabelPlacementCenterRight"]};h=function(a){var b=e[a];p[a].forEach(function(a){e[a]=b})};for(var w in p)h(w);Object.freeze&&
(Object.freeze(e),Object.keys(e).forEach(function(a){Object.freeze(e[a]);Object.freeze(e[a].normalizedOffset)}));var g=[0,0],v=[0,0]});