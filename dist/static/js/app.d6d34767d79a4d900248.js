webpackJsonp([2,0],{0:function(t,e,i){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}var s=i(24),r=a(s),n=i(176),o=a(n);new r.default({el:"#app",template:"<App/>",components:{App:o.default}})},10:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={PEN:window.Symbol("PEN"),BRUSH:window.Symbol("BRUSH"),ERASER:window.Symbol("ERASER"),SPOIT:window.Symbol("SPOIT"),FILL:window.Symbol("FILL"),COLOR:window.Symbol("COLOR"),fromName:function(t){switch(t){case"pen":return i.PEN;case"brush":return i.BRUSH;case"eraser":return i.ERASER;case"spoit":return i.SPOIT;case"fill":return i.FILL;case"color":return i.COLOR;default:return}}};e.default=i},25:function(t,e,i){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=i(14),r=a(s),n=i(27),o=a(n),l=i(28),h=a(l),u=i(29),d=a(u),c=i(31),g=a(c),v=i(10),f=a(v),w=function(){function t(e,i,a){var s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,n=!(arguments.length>5&&void 0!==arguments[5])||arguments[5],l=!(arguments.length>6&&void 0!==arguments[6])||arguments[6],u=!(arguments.length>7&&void 0!==arguments[7])||arguments[7];if((0,h.default)(this,t),this.mainColor=e,this.tool=i,this.canvas=a,this.url=null,this.history=null,this.shape=document.createElement("canvas"),this.overlap=document.createElement("canvas"),this.showPen=n,this.showBase=l,this.showExtra=u,0===s&&0===r){var d=a.currentStyle||window.getComputedStyle(a);this.styleWidth=window.parseInt(d.width),this.styleHeight=window.parseInt(d.height)}else this.styleWidth=s,this.styleHeight=r;var c=a.getContext("2d");this.canvas.width=this.styleWidth*window.devicePixelRatio,this.canvas.height=this.styleHeight*window.devicePixelRatio,this.canvas.style.width=this.styleWidth,this.canvas.style.height=this.styleHeight,c.scale(window.devicePixelRatio,window.devicePixelRatio),t.setupCanvas(this.canvas,this.styleWidth,this.styleHeight),t.setupCanvas(this.shape,this.styleWidth,this.styleHeight),t.setupCanvas(this.overlap,this.styleWidth,this.styleHeight),(0,o.default)(this,{_mainColor:{value:this.mainColor},_canvas:{value:this.canvas}})}return(0,d.default)(t,[{key:"draw",value:function(t,e,i,a){if(0!==t.length){var s=this.canvas.getContext("2d");switch(s.lineCap="round",i){case f.default.PEN:case f.default.BRUSH:s.strokeStyle=e.hex,s.globalAlpha=e.a;break;case f.default.ERASER:s.strokeStyle="#fff",s.globalAlpha=1;break;default:return}s.lineWidth=a,s.globalCompositeOperation="source-over",s.beginPath();for(var n=0;n<Math.max(t.length-1,1);n+=1){var o=(0,r.default)(t[n],2),l=o[0],h=o[1],u=t[n+1]||t[n],d=(0,r.default)(u,2),c=d[0],g=d[1];s.moveTo(l,h),s.lineTo(c,g)}s.stroke(),this.url=null}}},{key:"drawObjectComp",value:function(t,e){var i=this.shape.getContext("2d");e?i.drawImage(t.shape,e.lx*window.devicePixelRatio,e.ly*window.devicePixelRatio,(e.rx-e.lx)*window.devicePixelRatio,(e.ry-e.ly)*window.devicePixelRatio,e.lx,e.ly,e.rx-e.lx,e.ry-e.ly):i.drawImage(t.shape,0,0,this.styleWidth,this.styleHeight);var a=this.overlap.getContext("2d");e?a.drawImage(t.canvas,e.lx*window.devicePixelRatio,e.ly*window.devicePixelRatio,(e.rx-e.lx)*window.devicePixelRatio,(e.ry-e.ly)*window.devicePixelRatio,e.lx,e.ly,e.rx-e.lx,e.ry-e.ly):a.drawImage(t.overlap,0,0,this.styleWidth,this.styleHeight),this.updateCanvas(),this.url=null}},{key:"drawObject",value:function(t,e){if(this.tool){if("Symbol(PEN)"===this.tool&&!this.showPen)return;if("Symbol(BRUSH)"===this.tool&&!this.showBase)return}var i=this.shape.getContext("2d");e?i.drawImage(t.canvas,e.lx*window.devicePixelRatio,e.ly*window.devicePixelRatio,(e.rx-e.lx)*window.devicePixelRatio,(e.ry-e.ly)*window.devicePixelRatio,e.lx,e.ly,e.rx-e.lx,e.ry-e.ly):i.drawImage(t.canvas,0,0,this.styleWidth,this.styleHeight),this.updateCanvas(),this.url=null}},{key:"drawOverlapObject",value:function(t,e){if(this.showExtra){var i=this.overlap.getContext("2d");e?i.drawImage(t.canvas,e.lx*window.devicePixelRatio,e.ly*window.devicePixelRatio,(e.rx-e.lx)*window.devicePixelRatio,(e.ry-e.ly)*window.devicePixelRatio,e.lx,e.ly,e.rx-e.lx,e.ry-e.ly):i.drawImage(t.canvas,0,0,this.styleWidth,this.styleHeight),this.updateCanvas(),this.url=null}}},{key:"eraseObject",value:function(t){if(this.tool){if("Symbol(PEN)"===this.tool&&!this.showPen)return;if("Symbol(BRUSH)"===this.tool&&!this.showBase)return}var e=this.shape.getContext("2d");e.globalCompositeOperation="destination-out",e.drawImage(t.canvas,0,0,this.styleWidth,this.styleHeight),e.globalCompositeOperation="source-over",this.updateCanvas(),this.url=null}},{key:"eraseOverlapObject",value:function(t){if(this.showExtra){var e=this.overlap.getContext("2d");e.globalCompositeOperation="destination-out",e.drawImage(t.canvas,0,0,this.styleWidth,this.styleHeight),e.globalCompositeOperation="source-over",this.canvas.getContext("2d").clearRect(0,0,this.styleWidth,this.styleHeight),this.updateCanvas(),this.url=null}}},{key:"clear",value:function(t){var e=this.canvas.getContext("2d");t?e.clearRect(t.lx,t.ly,t.rx-t.lx,t.ry-t.ly):e.clearRect(0,0,this.styleWidth,this.styleHeight);var i=this.shape.getContext("2d");t?i.clearRect(t.lx,t.ly,t.rx-t.lx,t.ry-t.ly):i.clearRect(0,0,this.styleWidth,this.styleHeight);var a=this.shape.getContext("2d");t?a.clearRect(t.lx,t.ly,t.rx-t.lx,t.ry-t.ly):a.clearRect(0,0,this.styleWidth,this.styleHeight),this.url=null}},{key:"colorTune",value:function(e,i,a){t.tune(e,this.shape,a),t.tune(i,this.overlap,a),this.updateCanvas(),this.url=null}},{key:"updateCanvas",value:function(t){var e=this.canvas.getContext("2d");if(!this.tool||"Symbol(PEN)"===this.tool&&this.showPen||"Symbol(BRUSH)"===this.tool&&this.showBase){if(t){var i=(t.rx-t.lx)*window.devicePixelRatio,a=(t.ry-t.ly)*window.devicePixelRatio;e.putImageData(this.shape.getContext("2d").getImageData(t.lx,t.ly,i,a),t.lx,t.ly)}else e.putImageData(this.shape.getContext("2d").getImageData(0,0,this.shape.width,this.shape.height),0,0);e.globalCompositeOperation="source-atop"}"Symbol(BRUSH)"===this.tool&&this.showExtra&&e.drawImage(this.overlap,0,0,this.styleWidth,this.styleHeight),e.globalCompositeOperation="source-over"}},{key:"changeVisual",value:function(t,e,i){this.showPen=t,this.showBase=e,this.showExtra=i,this.url=null,this.canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height),this.updateCanvas()}},{key:"imageUrl",get:function(){return this.url||(this.url=this.canvas.toDataURL()),this.url}}],[{key:"setupCanvas",value:function(t,e,i){var a=t.getContext("2d");t.width=e*window.devicePixelRatio,t.height=i*window.devicePixelRatio,t.style.width=e,t.style.height=i,a.scale(window.devicePixelRatio,window.devicePixelRatio)}},{key:"tune",value:function(t,e,i){var a=new Uint8ClampedArray(t.data);a.set(t);for(var s=new window.ImageData(a,e.width,e.height),r={},n=0;n<s.data.length;n+=4)if(0!==s.data[n+3]){var o=void 0,l=r[s.data.slice(n,n+4).join(",")];l?o=l:(o=g.default.rgb(s.data.slice(n,n+4)).rotate(i.hue).saturate(i.sat).lighten(i.val),o=o.rgb().array(),r[s.data.slice(n,n+4).join(",")]=[].concat(o)),s.data[n]=o[0],s.data[n+1]=o[1],s.data[n+2]=o[2]}e.getContext("2d").putImageData(s,0,0)}}]),t}();e.default=w},58:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(t,e,i){t/=360,e/=100,i/=100;var a=void 0,s=void 0,r=void 0;if(0===e)a=s=r=i;else{var n=function(t,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t},o=i<.5?i*(1+e):i+e-i*e,l=2*i-o;a=n(l,o,t+1/3),s=n(l,o,t),r=n(l,o,t-1/3)}a=Math.round(255*a),s=Math.round(255*s),r=Math.round(255*r);var h=.299*a+.587*s+.114*r,u=-.169*a-.331*s+.5*r,d=.5*a-.419*s-.081*r;return[h,u,d]},a=function(t){var e=Math.round(t[0]),i=Math.round(t[1]),a=Math.round(t[2]),s=.299*e+.587*i+.114*a,r=-.169*e-.331*i+.5*a,n=.5*e-.419*i-.081*a;return[s,r,n]};e.hslToYuv=i,e.rgbToYuv=a},59:function(t,e,i){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=i(14),r=a(s),n=i(26),o=a(n),l=i(66),h=a(l),u=i(27),d=a(u),c=i(28),g=a(c),v=i(29),f=a(v),w=i(161),y=a(w),p=i(152),m=a(p),b=i(25),x=a(b),C=i(10),S=a(C),R=i(58),_=500,k=1,I=0,P=function(){function t(e){(0,g.default)(this,t);var i=e.currentStyle||window.getComputedStyle(e);this.styleWidth=window.parseInt(i.width),this.styleHeight=window.parseInt(i.height),this.fixedObject=new x.default(null,null,e,this.styleWidth,this.styleHeight),this.objects={},this.objectIndexes=[],this.layers=[],this.histories=[],this.sortCache={},this.lastKey=null,this.clearedKey=null,this.showPen=!0,this.showBase=!0,this.showExtra=!0,(0,d.default)(this,{_styleWidth:{value:this.styleWidth},_styleHeight:{value:this.styleHeight}})}return(0,f.default)(t,[{key:"draw",value:function(t,e,i,a){switch(i){case S.default.PEN:this.drawPen(t,e,i,a);break;case S.default.BRUSH:this.drawBrush(t,e,i,a)}this.updateSort(),this.update()}},{key:"drawPen",value:function(e,i,a){if(this.showPen){var s=t.getKey(a,i.rgba.r,i.rgba.g,i.rgba.b),r=void 0;if(this.objectIndexes.indexOf(s)===-1){var n=document.createElement("canvas");r=new x.default(i,a.toString(),n,this.styleWidth,this.styleHeight,this.showPen,this.showBase,this.showExtra),this.objectIndexes.push(s),this.clearedKey&&"Symbol(PEN)"===t.getToolString(this.clearedKey)&&this.objects[this.clearedKey]&&(r.history=(0,h.default)({},this.objects[this.clearedKey])),this.clearedKey=null}else r=this.objects[s];r.drawObject(e),this.objects[s]=r,this.lastKey=s}}},{key:"drawBrush",value:function(e,i,a,s){if(this.showBase){var r=t.getKey(a,i.rgba.r,i.rgba.g,i.rgba.b),n=t.getColorString(r),o=this.objectIndexes.filter(function(e){return"Symbol(BRUSH)"===t.getToolString(e)}).map(function(e){return t.getColor(t.getColorString(e))});o.push(t.getColor(n));var l=this.checkOverlap(e,s),u=[];u=u.concat(l.comp.map(function(e){return t.getColorString(e)})),u=u.concat(l.spilled.map(function(e){return t.getColorString(e)})),u=u.filter(function(t,e,i){return i.indexOf(t)===e});for(var d=[],c=-1;;){var g=u.indexOf(n,c+1);if(g===-1)break;d.push(g),c=g}for(var v=[],f=t.getColor(n),w=(0,R.rgbToYuv)(f),y=0;y<u.length;y+=1){var p=(0,R.rgbToYuv)(t.getColor(u[y]));console.log("----"),console.log(Math.abs(p[0]-w[0])),console.log(m.default.distance.euclidean([p[1],p[2]],[w[1],w[2]])),console.log(m.default.distance.euclidean(t.getColor(u[y]),f)),Math.abs(p[0]-w[0])>100||m.default.distance.euclidean([p[1],p[2]],[w[1],w[2]])>40||v.push(y)}var b=void 0;if((l.spilled.length>0||l.comp.length>0)&&v.length>0&&v.length!==d.length)if(l.comp.length>0){for(var C=0,S=1e4,_=0;_<l.comp.length;_+=1){var k=m.default.distance.euclidean(t.getColor(t.getColorString(l.comp[_])),f);k<S&&(C=_,S=k)}b=this.objects[l.comp[C]];for(var I=!1,P=0;P<l.spilled.length;P+=1){var j=m.default.distance.euclidean(t.getColor(t.getColorString(l.spilled[P])),f);j<S&&(C=P,S=j,I=!0)}I&&(b=this.objects[l.spilled[C]]),b.drawOverlapObject(e),this.lastKey=l.comp[v[0]]}else{for(var T=0,O=1e4,M=0;M<l.spilled.length;M+=1){var E=m.default.distance.euclidean(t.getColor(t.getColorString(l.spilled[M])),f);console.log(E),E<O&&(console.log("min!!!"),T=M,O=E)}b=this.objects[l.spilled[T]],b.drawOverlapObject(e),this.lastKey=l.spilled[v[0]]}else if((l.comp.length>0||l.spilled.length>0)&&d.length>0)if(l.comp.length>0){for(var H=0;H<l.comp.length;H+=1){var B=l.comp[H];t.getColorString(B)===n&&(b?(b.drawObjectComp(this.objects[B]),delete this.objects[B],this.objectIndexes.splice(this.objectIndexes.indexOf(B),1)):b=this.objects[l.comp[H]])}if(!b)for(var W=0;W<l.spilled.length;W+=1){var D=l.spilled[W];t.getColorString(D)===n&&(b?(b.drawObjectComp(this.objects[D]),delete this.objects[D],this.objectIndexes.splice(this.objectIndexes.indexOf(D),1)):b=this.objects[l.spilled[W]])}b.drawObject(e),this.lastKey=l.comp[d[0]]}else{for(var K=0;K<l.spilled.length;K+=1){var A=l.spilled[K];t.getColorString(A)===n&&(b?(b.drawObjectComp(this.objects[A]),delete this.objects[A],this.objectIndexes.splice(this.objectIndexes.indexOf(A),1)):b=this.objects[l.spilled[K]])}b.drawObject(e),this.lastKey=l.spilled[d[0]]}else{var $=document.createElement("canvas");b=new x.default(i,a.toString(),$,this.styleWidth,this.styleHeight,this.showPen,this.showBase,this.showExtra),b.drawObject(e),this.objectIndexes.push(r),this.objects[r]=b,this.lastKey=r,this.clearedKey&&"Symbol(BRUSH)"===t.getToolString(this.clearedKey)&&this.objects[this.clearedKey]&&(b.history=(0,h.default)({},this.objects[this.clearedKey])),this.clearedKey=null}}}},{key:"erase",value:function(t,e,i,a,s){if(s){if(s.indexOf("_overlap")===-1){var r=this.objects[s];r.eraseObject(t),this.lastKey=s}else{var n=s.split("_overlap")[0],o=this.objects[n];o.eraseOverlapObject(t),this.lastKey=n}this.update(),this.updateSort()}}},{key:"update",value:function(e){this.layers=[],this.fixedObject.clear(e);var i=!0,a=!1,s=void 0;try{for(var r,n=(0,o.default)(this.objectIndexes);!(i=(r=n.next()).done);i=!0){for(var l=r.value,h=t.getToolString(l),u=this.objects[l],d=[];u.history;)d.push(u.history.url),u=u.history;this.layers.push({url:this.objects[l].imageUrl,histories:d}),("Symbol(PEN)"===h&&this.showPen||"Symbol(BRUSH)"===h&&(this.showBase||this.showExtra))&&this.fixedObject.drawObject(this.objects[l],e)}}catch(t){a=!0,s=t}finally{try{!i&&n.return&&n.return()}finally{if(a)throw s}}this.layers=this.layers.reverse()}},{key:"updateSort",value:function(){var e=this,i=document.createElement("canvas");i.style.width=this.styleWidth,i.style.height=this.styleHeight;var a=new x.default(null,null,i,this.styleWidth/k,this.styleHeight/k),s=a.canvas.getContext("2d"),n=document.createElement("canvas");n.style.width=this.styleWidth,n.style.height=this.styleHeight;var o=new x.default(null,null,n,this.styleWidth/k,this.styleHeight/k),l=o.canvas.getContext("2d");this.objectIndexes.sort(function(n,h){var u=e.objects[n],d=e.objects[h],c=n.split(",")[0],g=h.split(",")[0];if(c!==g)return"Symbol(PEN)"===c?1:-1;var v=n+"-"+h,f=e.sortCache[v];if(f&&n!==e.lastKey&&h!==e.lastKey)return f;var w=u.canvas,y=d.canvas;s.globalCompositeOperation="source-over",s.drawImage(w,0,0,e.styleWidth/k,e.styleHeight/k),s.globalCompositeOperation="source-in",s.fillStyle="#f00",s.fillRect(0,0,e.styleWidth/k,e.styleHeight/k),l.globalCompositeOperation="source-over",l.drawImage(y,0,0,e.styleWidth/k,e.styleHeight/k),l.globalCompositeOperation="source-in",l.fillStyle="#00f",l.fillRect(0,0,e.styleWidth/k,e.styleHeight/k),l.globalCompositeOperation="xor",l.drawImage(i,0,0,e.styleWidth/k,e.styleHeight/k);var p=l.getImageData(0,0,o.canvas.width,o.canvas.height).data,m=t.measureArea(p,o.canvas.width,o.canvas.height,[[255,0,0],[0,0,255]]),b=(0,r.default)(m,2),x=b[0],C=b[1];return a.clear(),o.clear(),f=x>C?-1:1,e.sortCache[v]=f,f})}},{key:"checkOverlap",value:function(e,i){var a={comp:[],spilled:[]};if(!this.showBase)return a;var s=document.createElement("canvas");s.style.width=this.styleWidth,s.style.height=this.styleHeight;var n=new x.default(null,null,s,this.styleWidth/k,this.styleHeight/k,!1,!0,!1),o=n.canvas.getContext("2d");o.globalCompositeOperation="source-over",o.drawImage(e.canvas,0,0,this.styleWidth/k,this.styleHeight/k),o.globalCompositeOperation="source-in",o.fillStyle="#f00",o.fillRect(0,0,this.styleWidth/k,this.styleHeight/k);var l=document.createElement("canvas");l.style.width=this.styleWidth,l.style.height=this.styleHeight;for(var h=new x.default(null,null,l,this.styleWidth/k,this.styleHeight/k,!1,!0,!1),u=h.canvas.getContext("2d"),d=0;d<this.objectIndexes.length;d+=1){var c=this.objectIndexes[d];if("Symbol(PEN)"!==t.getToolString(c)){var g=this.objects[this.objectIndexes[d]];u.globalCompositeOperation="source-over",u.drawImage(g.canvas,0,0,this.styleWidth/k,this.styleHeight/k),u.globalCompositeOperation="source-in",u.fillStyle="#00f",u.fillRect(0,0,this.styleWidth/k,this.styleHeight/k),u.globalCompositeOperation="difference",u.drawImage(s,0,0,this.styleWidth/k,this.styleHeight/k);var v=u.getImageData(0,0,h.canvas.width,h.canvas.height).data,f=t.measureArea(v,h.canvas.width,h.canvas.height,[[255,0,0],[255,0,255],[0,0,255]],i),w=(0,r.default)(f,3),y=w[0],p=w[1],m=w[2];h.clear(),0!==y&&0!==p&&0!==m?a.spilled.push(c):0!==y&&0!==m||0===p||a.comp.push(c)}}return a}},{key:"spoit",value:function(e){var i=this.fixedObject.canvas.getContext("2d").getImageData(0,0,this.fixedObject.canvas.width,this.fixedObject.canvas.height).data;return t.spoitColor(i,e,this.fixedObject.canvas.width)}},{key:"getTopKey",value:function(e){for(var i=this.objectIndexes.length-1;i>=0;i-=1){var a=this.objectIndexes[i],s=this.objects[a],r=s.overlap.getContext("2d").getImageData(0,0,s.overlap.width,s.overlap.height).data;if(this.showExtra&&t.filledColor(r,e,s.overlap.width))return a+"_overlap";var n=s.shape.getContext("2d").getImageData(0,0,s.shape.width,s.shape.height).data,o=!s.tool||"Symbol(PEN)"===s.tool&&s.showPen||"Symbol(BRUSH)"===s.tool&&s.showBase;if(o&&t.filledColor(n,e,s.shape.width))return a}}},{key:"clearAll",value:function(){this.objects=[],this.histories=[],this.layers=[]}},{key:"undo",value:function(){this.objects=this.histories[this.histories.length-1]}},{key:"rollback",value:function(e,i){for(var a=this.objectIndexes.length,s=this.objectIndexes[a-e-1],r=document.createElement("canvas"),n=new x.default(null,t.getToolString(s),r,this.styleWidth,this.styleHeight),o=this.objects[s].history,l=0;l<i;l+=1)o=o.history;n.drawObjectComp(o),n.history=(0,h.default)({},this.objects[s]),this.objects[s]=n,this.update()}},{key:"changeVisual",value:function(t,e,i){this.showPen=t,this.showBase=e,this.showExtra=i;for(var a=0;a<this.objectIndexes.length;a+=1)this.objects[this.objectIndexes[a]].changeVisual(t,e,i);this.update()}}],[{key:"getKey",value:function(t,e,i,a){I+=1;var s=t===S.default.PEN?0:I;return t.toString()+","+e+","+i+","+a+","+s}},{key:"getToolString",value:function(t){return t.split(",")[0]}},{key:"getColorString",value:function(t){return t.split(",").splice(1,3).join(",")}},{key:"getColor",value:function(t){return t.split(",").map(function(t){return parseInt(t,10)})}},{key:"getImageDataFaster",value:function(t,e,i,a){var s=Math.round(t),r=Math.round(e),n=Math.round(i),o=a[4*(r*n+s)],l=a[4*(r*n+s)+1],h=a[4*(r*n+s)+2],u=a[4*(r*n+s)+3];return[o,l,h,u]}},{key:"measureArea",value:function(e,i,a,s,r){var n=new Array(s.length);n.fill(0);var o=i,l=a,h=0,u=0;r&&(o=(r.rx-r.lx)/k*window.devicePixelRatio,l=(r.ry-r.ly)/k*window.devicePixelRatio,h=r.lx/k*window.devicePixelRatio,u=r.ly/k*window.devicePixelRatio);for(var d=0;d<_;d+=1)for(var c=Math.round(Math.random()*(o-1)+h),g=Math.round(Math.random()*(l-1)+u),v=t.getImageDataFaster(c,g,Math.round(i),e),f=0;f<s.length;f+=1){var w=s[f];v[0]===w[0]&&v[1]===w[1]&&v[2]===w[2]&&(n[f]+=1)}return n}},{key:"filledColor",value:function(e,i,a){var s=!0,r=!1,n=void 0;try{for(var l,h=(0,o.default)(i);!(s=(l=h.next()).done);s=!0){var u=l.value,d=t.getImageDataFaster(u[0],u[1],Math.round(a),e);if(0!==d[0]||0!==d[1]||0!==d[2]||0!==d[3])return!0}}catch(t){r=!0,n=t}finally{try{!s&&h.return&&h.return()}finally{if(r)throw n}}return!1}},{key:"spoitColor",value:function(e,i,a){var s=!0,r=!1,n=void 0;try{for(var l,h=(0,o.default)(i);!(s=(l=h.next()).done);s=!0){var u=l.value,d=t.getImageDataFaster(u[0],u[1],Math.round(a),e);if(0!==d[0]||0!==d[1]||0!==d[2]||0!==d[3])return d}}catch(t){r=!0,n=t}finally{try{!s&&h.return&&h.return()}finally{if(r)throw n}}return null}},{key:"d",value:function(e,i){for(var a=[],s=[null,null],r=[Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY],n=0;n<2;n+=1)if(!(e.cluster_arr[n].length<2)){var o=(0,y.default)(e.cluster_arr[n],2),l=[];l=l.concat(e.cluster_arr[n]),l=l.concat(e.cluster_arr[1-n]);for(var h=0;h<e.cluster_arr[1-n].length;h+=1)o.clusters.push(2);var u=t.computeBic(l,o);u.bic>i&&(r[n]=u.bic,s[n]=o)}if(r[0]>i||r[1]>i)for(var d=0;d<2;d+=1)if(r[d]>i){for(var c=s[d],g=new Array(2),v=0;v<c.clusters.length;v+=1)g[c.clusters[v]]||(g[c.clusters[v]]=[]),g[c.clusters[v]].push(e.cluster_arr[d][v]);c.arr=e.cluster_arr[d],c.cluster_arr=g,a=a.concat(t.d(c,r[d]))}else a.push(e.cluster_arr[d]);else a.push([].concat(e.cluster_arr[0],e.cluster_arr[1]));return a}},{key:"divide",value:function(e){if(e.length<2)return[e];for(var i=(0,y.default)(e,2),a=new Array(2),s=0;s<i.clusters.length;s+=1)a[i.clusters[s]]||(a[i.clusters[s]]=[]),a[i.clusters[s]].push(e[s]);if(!a[1])return[e];i.arr=e,i.cluster_arr=a;var r=t.computeBic(e,i),n=t.d(i,r.bic);return n}},{key:"computeBic",value:function(t,e){for(var i=e.centroids.map(function(t){return t.centroid}),a=e.clusters,s=e.centroids.length,r=e.centroids.map(function(t){return t.size}),n=t.length,o=t[0].length,l=new Array(s),h=0;h<e.clusters.length;h+=1)l[e.clusters[h]]||(l[e.clusters[h]]=[]),l[e.clusters[h]].push(t[h]);for(var u=0,d=0;d<s;d+=1)for(var c=0;c<n;c+=1)d===a[c]&&(u+=m.default.distance.euclidean(t[c],i[d]));var g=1/(n-s)/o*u,v=.5*s*Math.log(n)*(o+1);if(!g)return{clusters:l,centers:i,bic:Number.NEGATIVE_INFINITY};for(var f=0,w=0;w<s;w+=1){var y=r[w];f+=y*Math.log(y)-y*Math.log(n)-y*o/2*Math.log(2*Math.PI*g)-(y-1)*o/2}return f-=v,{clusters:l,centers:i,bic:f}}}]),t}();e.default=P},60:function(t,e,i){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=i(64),r=a(s),n=i(175),o=i(24),l=a(o),h=i(31),u=a(h),d=i(184),c=a(d);i(113);var g=i(177),v=a(g),f=i(179),w=a(f),y=i(178),p=a(y),m=i(59),b=a(m),x=i(10),C=a(x);l.default.use(c.default);var S={hex:"#4A4A4A",rgba:{r:74,g:74,b:74,a:1},a:1},R=C.default.PEN,_=R,k={};k[C.default.PEN]=4,k[C.default.BRUSH]=30,k[C.default.ERASER]=30,e.default={name:"app",components:{Sketch:n.Sketch,UiCanvas:v.default,UiLayerList:p.default,UiSlider:w.default},data:function(){return{currentColor:S,currentTool:R,prevTool:_,toolSizes:k,drawingManager:void 0,defaultSize:4,tuneTargetKey:void 0,tuneTarget:void 0,tuneInfo:void 0,tuneShape:void 0,tuneOverlap:void 0,showPen:!0,showBase:!0,showExtra:!0,showPalette:!0}},mounted:function(){window.devicePixelRatio=1,this.drawingManager=new b.default(document.querySelector("#fixed-canvas"));var t=0,e=0,i=function i(){t+=1,(new Date).getTime()-e>1e3&&(document.title="(FPS: "+t+")",t=0,e=(new window.Date).getTime()),window.requestAnimationFrame(i)};window.requestAnimationFrame(i)},methods:{onchange:function(t){this.currentColor=t},toggletool:function(t){this.prevTool=this.currentTool,this.currentTool=C.default.fromName(t),this.$refs.slider.setValue(this.toolSizes[this.currentTool],!0,!1)},onchangesize:function(t){this.toolSizes[this.currentTool]=t},onextractcolor:function(t){this.$refs.colorPicker.colorChange({hex:u.default.rgb(t).hex(),rgba:{r:t[0],g:t[1],b:t[2],a:1},a:1})},newcanvas:function(){this.drawingManager=new b.default(document.querySelector("#fixed-canvas")),this.currentColor=S,this.currentTool=R,this.$refs.slider.setValue(this.defaultSize,!0,!1),(0,r.default)(this.$refs.toolButtons.$el.children).map(function(t){return t.classList.remove("md-toggle")}),this.$refs.penButton.$el.classList.add("md-toggle"),this.showPen=!0,this.showBase=!0,this.showExtra=!0,this.showPalette=!0},onclear:function(t){if(this.drawingManager){var e=this.drawingManager.objectIndexes.length,i=this.drawingManager.objectIndexes.splice(e-t-1,1)[0];this.drawingManager.clearedKey=i,this.drawingManager.update()}},rollback:function(t,e){this.drawingManager.rollback(t,e)},openColorDialog:function(){this.$refs.hueSlider.setValue(50,!0,!1),this.$refs.satSlider.setValue(50,!0,!1),this.$refs.valSlider.setValue(50,!0,!1),this.$refs.colorDialog.open()},closeColorDialog:function(){var t=new Uint8ClampedArray(this.tuneShape.data);t.set(this.tuneShape);var e=new window.ImageData(t,this.tuneTarget.shape.width,this.tuneTarget.shape.height);this.tuneTarget.shape.getContext("2d").putImageData(e,0,0);var i=new Uint8ClampedArray(this.tuneOverlap.data);i.set(this.tuneOverlap);var a=new window.ImageData(i,this.tuneTarget.overlap.width,this.tuneTarget.overlap.height);this.tuneTarget.overlap.getContext("2d").putImageData(a,0,0),this.tuneTarget.url=null,this.tuneTarget.updateCanvas(),this.drawingManager.update(),this.$refs.colorDialog.close()},applyColorDialog:function(){var t=b.default.getToolString(this.tuneTargetKey),e=b.default.getColor(b.default.getColorString(this.tuneTargetKey)),i=u.default.rgb(e).rotate(this.tuneInfo.hue).saturate(this.tuneInfo.sat).lighten(this.tuneInfo.val).rgb().array();i=i.map(function(t){return Math.floor(t)});var a=b.default.getKey(t,Math.floor(i[0]),Math.floor(i[1]),Math.floor(i[2])),s=this.drawingManager.objectIndexes.indexOf(this.tuneTargetKey);s!==-1&&(this.drawingManager.objectIndexes[s]=a,this.drawingManager.objects[a]=this.tuneTarget,delete this.drawingManager.objects[this.tuneTargetKey],this.drawingManager.update(),this.$refs.colorDialog.close())},ontune:function(t){this.tuneTargetKey=t,this.tuneTarget=this.drawingManager.objects[t],this.tuneInfo={hue:0,sat:0,val:0},this.tuneShape=this.tuneTarget.shape.getContext("2d").getImageData(0,0,this.tuneTarget.shape.width,this.tuneTarget.shape.height),this.tuneOverlap=this.tuneTarget.overlap.getContext("2d").getImageData(0,0,this.tuneTarget.overlap.width,this.tuneTarget.overlap.height),this.openColorDialog()},onchangehue:function(t){this.tuneInfo.hue=(t-50)/100*360,this.colorTune()},onchangesat:function(t){this.tuneInfo.sat=(t-50)/100,this.colorTune()},onchangeval:function(t){this.tuneInfo.val=(t-50)/100,this.colorTune()},colorTune:function(){this.tuneTarget.colorTune(this.tuneShape,this.tuneOverlap,this.tuneInfo),this.drawingManager.update()},onchangevisiual:function(){this.drawingManager.changeVisual(this.showPen,this.showBase,this.showExtra)},togglepalette:function(){this.showPalette=!this.showPalette}}}},61:function(t,e,i){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=i(14),r=a(s),n=i(25),o=a(n),l=i(10),h=a(l),u=function(t){var e=t.target.getBoundingClientRect(),i=t.clientX||t.touches[0].clientX,a=t.clientY||t.touches[0].clientY;return[i-e.left,a-e.top]};e.default={name:"UiCanvas",props:["current-color","current-tool","prev-tool","tool-sizes","drawing-manager"],data:function(){return{currentStroke:[],drawing:null,editRange:{lx:0,ly:0,rx:0,ry:0},eraseTarget:void 0}},mounted:function(){this.$refs.drawing.addEventListener("dragover",this.dragover,!1),this.$refs.drawing.addEventListener("drop",this.drop,!1)},methods:{mousedown:function(t){t.preventDefault();var e=u(t),i=(0,r.default)(e,2),a=i[0],s=i[1],n=void 0,l=void 0;switch(this.currentTool){case h.default.PEN:case h.default.BRUSH:case h.default.ERASER:this.drawing=new o.default(this.currentColor,null,document.querySelector("#drawing"));break;case h.default.SPOIT:return l=this.drawingManager.spoit([[a*window.devicePixelRatio,s*window.devicePixelRatio]]),void(l&&this.$emit("onextractcolor",l));case h.default.FILL:return;case h.default.COLOR:return n=this.drawingManager.getTopKey([[a*window.devicePixelRatio,s*window.devicePixelRatio]]),void(n&&this.$emit("ontune",n.split("_overlap")[0]));default:return}var d=this.toolSizes[this.currentTool];this.currentStroke.push([a,s]),this.drawing.draw(this.currentStroke,this.currentColor,this.currentTool,d),this.editRange.lx=a-d,this.editRange.ly=s-d,this.editRange.rx=a+d,this.editRange.ry=s+d,this.updateerasertarget(a*window.devicePixelRatio,s*window.devicePixelRatio)},mousemove:function(t){if(t.preventDefault(),this.drawing){var e=(0,r.default)(this.currentStroke[this.currentStroke.length-1],2),i=e[0],a=e[1],s=u(t),n=(0,r.default)(s,2),o=n[0],l=n[1];if(o!==i||l!==a){var h=this.toolSizes[this.currentTool];this.currentStroke.push([o,l]),this.drawing.clear(this.editRange),this.drawing.draw(this.currentStroke,this.currentColor,this.currentTool,h),this.editRange.lx=Math.min(o-h,this.editRange.lx),this.editRange.ly=Math.min(l-h,this.editRange.ly),this.editRange.rx=Math.max(o+h,this.editRange.rx),this.editRange.ry=Math.max(l+h,this.editRange.ry),this.updateerasertarget(o*window.devicePixelRatio,l*window.devicePixelRatio)}}},mouseup:function(t){if(t.preventDefault(),this.drawing){switch(this.currentTool){case h.default.PEN:case h.default.BRUSH:this.drawingManager.draw(this.drawing,this.currentColor,this.currentTool,this.editRange);break;case h.default.ERASER:this.drawingManager.erase(this.drawing,this.currentColor,this.currentTool,this.editRange,this.eraseTarget);break;case h.default.SPOIT:return;case h.default.FILL:return;default:return}this.drawing.clear(this.editRange),this.drawing=null,this.currentStroke=[],this.editRange={lx:0,ly:0,rx:0,ry:0},this.eraseTarget=void 0,this.$parent.$emit("update-layer-list")}},updateerasertarget:function(t,e){var i=this.toolSizes[this.currentTool];if(this.currentTool===h.default.ERASER&&!this.eraseTarget){var a=[];a.push([t,e]);for(var s=0;s<16;s+=1)a.push([t+.5*i*Math.cos(2*Math.PI/16*s),e+.5*i*Math.sin(2*Math.PI/16*s)]);var r=this.drawingManager.getTopKey(a);r&&(this.eraseTarget=r)}},dragover:function(t){t.preventDefault()},drop:function(t){var e=this;t.preventDefault();var i=t.dataTransfer.files[0];if("image/png"===i.type||"image/jpeg"===i.type){var a=new FileReader;a.onload=function(){var t=document.createElement("img");t.setAttribute("src",a.result),e.drawing=new o.default(e.currentColor,null,document.querySelector("#drawing")),e.drawing.drawObject({canvas:t}),e.drawingManager.draw(e.drawing,e.currentColor,e.currentTool,e.editRange)},a.readAsDataURL(i)}}}}},62:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"UiLayerList",props:["layers"],data:function(){return{active:-1}},methods:{clear:function(t){this.$emit("onclear",t)},mouseover:function(t){this.active=t},mouseleave:function(t){t===this.active&&(this.active=-1)},rollback:function(t,e){this.$emit("rollback",t,e)}}}},63:function(t,e,i){"use strict";function a(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=i(107),r=a(s);e.default={name:"UiSlider",props:["defaultValue"],data:function(){return{keyboardStep:5,value:this.defaultValue,dragging:!1,draggable:null}},mounted:function(){this.$refs.thumb.style.left=this.value+"%",this.draggable=new r.default(this.$refs.thumb,{containment:this.$refs.container,axis:"x"}),this.draggable.on("dragStart",this.dragStart),this.draggable.on("dragMove",this.dragMove),this.draggable.on("dragEnd",this.dragEnd)},methods:{sliderClick:function(t){var e=this.$refs.slider.getBoundingClientRect(),i=(t.clientX-e.left)/e.width*100;this.setValue(i,!0),t.target!==this.$refs.thumb&&this.draggable._pointerDown(t,t),this.$refs.slider.focus()},dragStart:function(){this.dragging=!0,this.$refs.slider.focus()},dragMove:function(){var t=this.draggable.position.x,e=t/this.$refs.slider.getBoundingClientRect().width*100;this.setValue(e)},dragEnd:function(){this.dragging=!1},increment:function(){100!==this.value&&this.setValue(this.value+this.keyboardStep,!0)},decrement:function(){0!==this.value&&this.setValue(this.value-this.keyboardStep,!0)},setValue:function(t,e){var i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(t!==this.value){var a=Math.round(t);a>=100&&(a=100),a<=0&&(a=0),this.value=a,e&&(this.$refs.thumb.style.left=this.value+"%"),i&&this.$emit("change-value",this.value)}}}}},109:function(t,e){},110:function(t,e){},111:function(t,e){},112:function(t,e){},113:function(t,e){},176:function(t,e,i){i(111);var a=i(13)(i(60),i(182),null,null);t.exports=a.exports},177:function(t,e,i){i(109);var a=i(13)(i(61),i(180),null,null);t.exports=a.exports},178:function(t,e,i){i(112);var a=i(13)(i(62),i(183),null,null);t.exports=a.exports},179:function(t,e,i){i(110);var a=i(13)(i(63),i(181),null,null);t.exports=a.exports},180:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"ui-canvas"}},[i("canvas",{attrs:{id:"fixed-canvas"}}),t._v(" "),i("canvas",{ref:"drawing",attrs:{id:"drawing"},on:{mousedown:t.mousedown,touchstart:t.mousedown,mousemove:t.mousemove,touchmove:t.mousemove,mouseup:t.mouseup,touchend:t.mouseup,
mouseleave:t.mouseup}})])},staticRenderFns:[]}},181:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"slider",staticClass:"ui-slider",class:{min:0===t.value,max:100===t.value,dragging:t.dragging},attrs:{tabindex:"0"},on:{mousedown:t.sliderClick,keydown:[function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"left",37,e.key,["Left","ArrowLeft"])?null:"button"in e&&0!==e.button?null:(e.preventDefault(),t.decrement(e))},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"right",39,e.key,["Right","ArrowRight"])?null:"button"in e&&2!==e.button?null:(e.preventDefault(),t.increment(e))}]}},[i("div",{ref:"container",staticClass:"ui-slider-containment"}),t._v(" "),i("div",{staticClass:"ui-slider-wrapper"},[i("div",{staticClass:"ui-slider-track-container"},[i("div",{staticClass:"ui-slider-track"}),t._v(" "),i("div",{staticClass:"ui-slider-track-fill",style:{width:t.value+"%"}})]),t._v(" "),i("div",{ref:"thumb",staticClass:"ui-slider-thumb-container"},[i("div",{staticClass:"ui-slider-focus-ring"}),t._v(" "),i("div",{ref:"thumbCircle",staticClass:"ui-slider-thumb"})])])])},staticRenderFns:[]}},182:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("ui-canvas",{attrs:{"current-color":t.currentColor,"current-tool":t.currentTool,"prev-tool":t.prevTool,"tool-sizes":t.toolSizes,"drawing-manager":t.drawingManager},on:{ontune:t.ontune,onextractcolor:t.onextractcolor}}),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showPalette,expression:"showPalette"}],staticClass:"palette"},[i("sketch",{ref:"colorPicker",attrs:{id:"color-picker"},on:{"change-color":t.onchange},model:{value:t.currentColor,callback:function(e){t.currentColor=e},expression:"currentColor"}}),t._v(" "),i("ui-slider",{ref:"slider",attrs:{defaultValue:t.defaultSize},on:{"change-value":t.onchangesize}})],1),t._v(" "),i("div",{attrs:{id:"layer-box"}},[t.drawingManager?i("ui-layer-list",{staticClass:"layer-list",attrs:{layers:t.drawingManager.layers},on:{onclear:t.onclear,rollback:t.rollback}}):t._e(),t._v(" "),i("div",{attrs:{id:"show-layer-box"}},[i("md-switch",{on:{change:t.onchangevisiual},model:{value:t.showPen,callback:function(e){t.showPen=e},expression:"showPen"}},[t._v("線画を表示")]),t._v(" "),i("md-switch",{on:{change:t.onchangevisiual},model:{value:t.showBase,callback:function(e){t.showBase=e},expression:"showBase"}},[t._v("基本塗りを表示")]),t._v(" "),i("md-switch",{on:{change:t.onchangevisiual},model:{value:t.showExtra,callback:function(e){t.showExtra=e},expression:"showExtra"}},[t._v("塗り重ねを表示")])],1)],1),t._v(" "),i("div",{attrs:{id:"canvas-box"}},[i("md-button",{staticClass:"md-fab",on:{click:t.newcanvas}},[i("md-icon",[t._v("note_add")])],1),t._v(" "),i("md-button",{staticClass:"md-fab md-mini",on:{click:t.togglepalette}},[i("md-icon",[t._v("palette")])],1)],1),t._v(" "),i("div",{attrs:{id:"tool-box"}},[i("md-button-toggle",{ref:"toolButtons",staticClass:"md-accent",attrs:{"md-single":""}},[i("md-button",{ref:"penButton",staticClass:"md-icon-button md-toggle",on:{click:function(e){return t.toggletool("pen")}}},[i("md-icon",[t._v("edit")])],1),t._v(" "),i("md-button",{ref:"brushButton",staticClass:"md-icon-button",on:{click:function(e){return t.toggletool("brush")}}},[i("md-icon",[t._v("brush")])],1),t._v(" "),i("md-button",{staticClass:"md-icon-button",on:{click:function(e){return t.toggletool("eraser")}}},[i("md-icon",[t._v("call_to_action")])],1),t._v(" "),i("md-button",{staticClass:"md-icon-button",on:{click:function(e){return t.toggletool("spoit")}}},[i("md-icon",[t._v("colorize")])],1),t._v(" "),i("md-button",{staticClass:"md-icon-button",on:{click:function(e){return t.toggletool("color")}}},[i("md-icon",[t._v("tune")])],1)],1)],1),t._v(" "),i("md-dialog",{ref:"colorDialog",attrs:{id:"color-dialog"}},[i("md-dialog-title",[t._v("色の調整")]),t._v(" "),i("md-dialog-content",[t._v("\n      色合い\n      "),i("ui-slider",{ref:"hueSlider",attrs:{defaultValue:50},on:{"change-value":t.onchangehue}}),t._v("\n      彩度\n      "),i("ui-slider",{ref:"satSlider",attrs:{defaultValue:50},on:{"change-value":t.onchangesat}}),t._v("\n      明るさ\n      "),i("ui-slider",{ref:"valSlider",attrs:{defaultValue:50},on:{"change-value":t.onchangeval}})],1),t._v(" "),i("md-dialog-actions",[i("md-button",{staticClass:"md-primary",on:{click:t.closeColorDialog}},[t._v("キャンセル")]),t._v(" "),i("md-button",{staticClass:"md-primary",on:{click:t.applyColorDialog}},[t._v("適用")])],1)],1)],1)},staticRenderFns:[]}},183:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"ui-layer-list"}},[t.layers?i("ul",t._l(t.layers,function(e,a){return i("li",{on:{mouseover:function(e){return t.mouseover(a)},mouseleave:function(e){return t.mouseleave(a)}}},[i("md-button",{on:{click:function(e){return t.clear(a)}}},[i("md-icon",[t._v("clear")])],1),t._v(" "),i("img",{attrs:{src:e.url}}),t._v(" "),e.histories&&t.active===a?i("ul",t._l(e.histories,function(e,s){return i("li",{staticStyle:{display:"inline"}},[i("img",{attrs:{src:e},on:{click:function(e){return t.rollback(a,s)}}})])}),0):t._e()],1)}),0):t._e()])},staticRenderFns:[]}}});
//# sourceMappingURL=app.d6d34767d79a4d900248.js.map