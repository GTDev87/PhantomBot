(function(){var e=[],r=[],t=[],a=[],s=[],i=$.inidb.exists("chatModerator","linksToggle")?$.getIniDbBoolean("chatModerator","linksToggle"):true,o=$.inidb.exists("chatModerator","linksMessage")?$.inidb.get("chatModerator","linksMessage"):"you were timed out for linking",n=$.inidb.exists("chatModerator","linkPermitTime")?parseInt($.inidb.get("chatModerator","linkPermitTime")):120,g=$.inidb.exists("chatModerator","capsToggle")?$.getIniDbBoolean("chatModerator","capsToggle"):true,l=$.inidb.exists("chatModerator","capsMessage")?$.inidb.get("chatModerator","capsMessage"):"you were timed out for overusing caps",d=$.inidb.exists("chatModerator","capsLimit")?parseInt($.inidb.get("chatModerator","capsLimit")):50,m=$.inidb.exists("chatModerator","capsTriggerLength")?parseInt($.inidb.get("chatModerator","capsTriggerLength")):10,h=$.inidb.exists("chatModerator","spamToggle")?$.getIniDbBoolean("chatModerator","spamToggle"):true,u=$.inidb.exists("chatModerator","spamMessage")?$.inidb.get("chatModerator","spamMessage"):"you were timed out for spamming",c=$.inidb.exists("chatModerator","spamLimit")?parseInt($.inidb.get("chatModerator","spamLimit")):25,f=$.inidb.exists("chatModerator","symbolsToggle")?$.getIniDbBoolean("chatModerator","symbolsToggle"):true,p=$.inidb.exists("chatModerator","symbolsMessage")?$.inidb.get("chatModerator","symbolsMessage"):"you were timed out for overusing symbols",b=$.inidb.exists("chatModerator","symbolsLimit")?parseInt($.inidb.get("chatModerator","symbolsLimit")):25,y=$.inidb.exists("chatModerator","symbolsTriggerLength")?parseInt($.inidb.get("chatModerator","symbolsTriggerLength")):5,w=$.inidb.exists("chatModerator","emotesToggle")?$.getIniDbBoolean("chatModerator","emotesToggle"):false,x=$.inidb.exists("chatModerator","emotesMessage")?$.inidb.get("chatModerator","emotesMessage"):"you were timed out for overusing emotes",M=$.inidb.exists("chatModerator","emotesLimit")?parseInt($.inidb.get("chatModerator","emotesLimit")):30,I=$.inidb.exists("chatModerator","regularsToggle")?$.getIniDbBoolean("chatModerator","regularsToggle"):false,P=$.inidb.exists("chatModerator","subscribersToggle")?$.getIniDbBoolean("chatModerator","subscribersToggle"):true,C=$.inidb.exists("chatModerator","blacklistMessage")?$.inidb.get("chatModerator","blacklistMessage"):"you were timed out using a blacklisted phrase",T=$.inidb.exists("chatModerator","warningTime")?parseInt($.inidb.get("chatModerator","warningTime")):5,k=$.inidb.exists("chatModerator","timeoutTime")?parseInt($.inidb.get("chatModerator","timeoutTime")):600,q=$.inidb.exists("chatModerator","msgCooldownSec")?parseInt($.inidb.get("chatModerator","msgCooldownSec")):20,L="";function v(e){var r=$.inidb.GetKeyList("blacklist","");if(e){for(var t in r){s.push($.inidb.get("blacklist",r[t]))}}}function D(e){var r=$.inidb.GetKeyList("whitelist","");if(e){for(var t in r){a.push($.inidb.get("whitelist",r[t]))}}}function _(e,r){$.say(".timeout "+e+" "+r);setTimeout(function(){$.say(".timeout "+e+" "+r)},1e3)}function B(e){for(var t in r){if(r[t].equalsIgnoreCase(e)){_(e,k);j(e);L="(timeout)";return}}_(e,T);j(e);L="(warning)"}function S(e,r){if(t.length<=1){$.say("@"+$.username.resolve(e)+", "+r+" "+L)}}function j(e){r.push(e);A(e);if(q>0){t.push($.systemTime())}}function A(e){if(q>0){var a=setTimeout(function(){t.splice(0);clearTimeout(a)},q*1e3)}var s=setTimeout(function(){for(var t in r){if(r[t].equalsIgnoreCase(e)){r.splice(t,0);break}}clearTimeout(s)},60*60*1e3)}function N(r){e.push(r);var t=setTimeout(function(){for(var a in e){if(e[a].equalsIgnoreCase(r)){e.splice(a,1);break}}clearTimeout(t)},n*1e3)}function R(e){return e?$.lang.get("common.enabled"):$.lang.get("common.disabled")}$.bind("ircChannelMessage",function(r){var t=r.getSender(),n=r.getMessage(),T;if(!$.isModv3(t,r.getTags())){for(T in s){if(n.contains(s[T])){_(t,k);L="(timeout)";S(t,C);return}}for(T in e){if(e[T].equalsIgnoreCase(t)&&$.patternDetector.hasLinks(r)){e.splice(T,1);return}}if(i&&$.patternDetector.hasLinks(r)){for(T in a){if(n.contains(a[T])){return}}if($.youtubePlayerConnected){if(n.contains("youtube.com")||n.contains("youtu.be")||n.contains("m.youtube.com")){return}}if(I&&$.isReg(t)){return}if(P&&$.isSubv3(t,r.getTags())){return}B(t);S(t,o);return}if(g&&n.length()>m){if(r.getCapsCount()>d){B(t);S(t,l);return}}if(f&&n.length()>y){if($.patternDetector.getNumberOfNonLetters(r)>b){B(t);S(t,p);return}}if(h){if($.patternDetector.getLongestRepeatedSequence(r)>c){B(t);S(t,u);return}}if(w){if($.patternDetector.getNumberOfEmotes(r)>M){B(t);S(t,x)}}}});$.bind("command",function(e){var r=e.getSender(),t=e.getCommand(),L=e.getArguments(),_=e.getArgs(),B=_[0],S=_[1];if(t.equalsIgnoreCase("permit")){if(!$.isModv3(r,e.getTags())){$.say($.whisperPrefix(r)+$.modMsg);return}if(!B){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.permit.usage"));return}N(B);$.say($.username.resolve(B)+$.lang.get("chatmoderator.permited",n));return}if(t.equalsIgnoreCase("blacklist")){if(!$.isAdmin(r)){$.say($.whisperPrefix(r)+$.adminMsg);return}if(!B){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.usage"));return}if(B.equalsIgnoreCase("add")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.add.usage"));return}var j=L.replace(B,"").trim();$.inidb.set("blackList","phrase_"+s.length,j);s.push(j);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.added"))}if(B.equalsIgnoreCase("remove")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.remove.usage"));return}else if(!$.inidb.exists("blackList","phrase_"+parseInt(S))){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.err"));return}$.inidb.del("blackList","phrase_"+parseInt(S));v(true);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.removed"))}if(B.equalsIgnoreCase("show")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.show.usage"));return}else if(!$.inidb.exists("blackList","phrase_"+parseInt(S))){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.err"));return}$.say($.whisperPrefix(r)+$.inidb.get("blackList","phrase_"+parseInt(S)))}}if(t.equalsIgnoreCase("whiteList")){if(!$.isAdmin(r)){$.say($.whisperPrefix(r)+$.adminMsg);return}if(!B){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.whitelist.usage"));return}if(B.equalsIgnoreCase("add")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.whitelist.add.usage"));return}var A=L.replace(B,"").trim();$.inidb.set("whiteList","link_"+a.length,A);a.push(A);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.whitelist.link.added"))}if(B.equalsIgnoreCase("remove")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.whitelist.remove.usage"));return}else if(!$.inidb.exists("whiteList","link_"+parseInt(S))){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.err"));return}$.inidb.del("whiteList","link_"+parseInt(S));D(true);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.whitelist.removed"))}if(B.equalsIgnoreCase("show")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.whitelist.show.usage"));return}else if(!$.inidb.exists("whiteList","link_"+parseInt(S))){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.err"));return}$.say($.whisperPrefix(r)+$.inidb.get("whiteList","link_"+parseInt(S)))}}if(t.equalsIgnoreCase("moderation")||t.equalsIgnoreCase("mod")){if(!$.isAdmin(r)){$.say($.whisperPrefix(r)+$.adminMsg);return}if(!B){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.usage.toggles"));$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.usage.messages"));$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.options"));return}if(B.equalsIgnoreCase("links")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.link.usage",R(i)));return}if(S.equalsIgnoreCase("on")){i=true;$.inidb.set("chatModerator","linksToggle",i);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.link.filter.enabled"));return}else if(S.equalsIgnoreCase("off")){i=false;$.inidb.set("chatModerator","linksToggle",i);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.link.filter.disabled"));return}}if(B.equalsIgnoreCase("caps")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.usage",R(g)));return}if(S.equalsIgnoreCase("on")){g=true;$.inidb.set("chatModerator","capsToggle",g);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.filter.enabled"));return}else if(S.equalsIgnoreCase("off")){g=false;$.inidb.set("chatModerator","capsToggle",g);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.filter.disabled"));return}}if(B.equalsIgnoreCase("spam")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.spam.usage",R(h)));return}if(S.equalsIgnoreCase("on")){h=true;$.inidb.set("chatModerator","spamToggle",h);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.spam.filter.enabled"));return}else if(S.equalsIgnoreCase("off")){h=false;$.inidb.set("chatModerator","spamToggle",h);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.spam.filter.disabled"));return}}if(B.equalsIgnoreCase("symbols")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.usage",R(f)));return}if(S.equalsIgnoreCase("on")){f=true;$.inidb.set("chatModerator","symbolsToggle",f);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.filter.enabled"));return}else if(S.equalsIgnoreCase("off")){f=false;$.inidb.set("chatModerator","symbolsToggle",f);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.filter.disabled"));return}}if(B.equalsIgnoreCase("emotes")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.emotes.usage",R(w)));return}if(S.equalsIgnoreCase("on")){w=true;$.inidb.set("chatModerator","emotesToggle",w);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.emotes.filter.enabled"));return}else if(S.equalsIgnoreCase("off")){w=false;$.inidb.set("chatModerator","symbolsToggle",w);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.emotes.filter.disabled"));return}}if(B.equalsIgnoreCase("regulars")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.regulars.usage"));return}if(S.equalsIgnoreCase("true")){I=true;$.inidb.set("chatModerator","regularsToggle",I);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.regulars.enabled"));return}else if(S.equalsIgnoreCase("false")){I=false;$.inidb.set("chatModerator","regularsToggle",I);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.regulars.disabled"));return}}if(B.equalsIgnoreCase("subscribers")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.subscribers.usage"));return}if(S.equalsIgnoreCase("true")){P=true;$.inidb.set("chatModerator","subscribersToggle",P);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.subscribers.enabled"));return}else if(S.equalsIgnoreCase("false")){P=false;$.inidb.set("chatModerator","subscribersToggle",P);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.subscribers.disabled"));return}}if(B.equalsIgnoreCase("linksmessage")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.link.message.usage"));return}o=L.replace(B,"").trim();$.inidb.set("chatModerator","linksMessage",o);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.link.message.set",o));return}if(B.equalsIgnoreCase("capsmessage")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.message.usage"));return}l=L.replace(B,"").trim();$.inidb.set("chatModerator","capsMessage",l);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.message.set",l));return}if(B.equalsIgnoreCase("symbolsmessage")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.message.usage"));return}p=L.replace(B,"").trim();$.inidb.set("chatModerator","symbolsMessage",p);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.message.set",p));return}if(B.equalsIgnoreCase("emotesmessage")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.emotes.message.usage"));return}x=L.replace(B,"").trim();$.inidb.set("chatModerator","emotesMessage",x);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.emotes.message.set",x));return}if(B.equalsIgnoreCase("spammessage")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.spam.message.usage"));return}u=L.replace(B,"").trim();$.inidb.set("chatModerator","spamMessage",u);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.spam.message.set",u));return}if(B.equalsIgnoreCase("blacklistmessage")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.message.usage"));return}C=L.replace(B,"").trim();$.inidb.set("chatModerator","blacklistMessage",C);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.blacklist.message.set",C));return}if(B.equalsIgnoreCase("permittime")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.permit.time.usage"));return}n=parseInt(S);$.inidb.set("chatModerator","linkPermitTime",n);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.permit.time.set",n));return}if(B.equalsIgnoreCase("capslimit")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.limit.usage"));return}d=parseInt(S);$.inidb.set("chatModerator","capsLimit",d);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.limit.set",d));return}if(B.equalsIgnoreCase("capstriggerlength")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.trigger.length.usage"));return}m=parseInt(S);$.inidb.set("chatModerator","capsTriggerLength",m);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.caps.trigger.length.set",d));return}if(B.equalsIgnoreCase("spamlimit")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.spam.limit.usage"));return}c=parseInt(S);$.inidb.set("chatModerator","spamLimit",c);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.spam.limit.set",c));return}if(B.equalsIgnoreCase("symbolslimit")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.limit.usage"));return}b=parseInt(S);$.inidb.set("chatModerator","symbolsLimit",b);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.limit.set",b));return}if(B.equalsIgnoreCase("symbolsTriggerLength")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.trigger.length.usage"));return}y=parseInt(S);$.inidb.set("chatModerator","symbolsTriggerLength",y);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.symbols.trigger.length.set",y));return}if(B.equalsIgnoreCase("emoteslimit")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.emotes.limit.usage"));return}M=parseInt(S);$.inidb.set("chatModerator","emotesLimit",M);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.emotes.limit.set",M));return}if(B.equalsIgnoreCase("timeouttime")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.timeout.time.usage"));return}k=parseInt(S);$.inidb.set("chatModerator","timeoutTime",k);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.timeout.time.set",k));return}if(B.equalsIgnoreCase("warningtime")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.warning.time.usage"));return}T=parseInt(S);$.inidb.set("chatModerator","warningTime",T);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.warning.time.set",T));return}if(B.equalsIgnoreCase("messagecooldown")){if(!S){$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.mesgcooldown.usage"));return}q=parseInt(S);$.inidb.set("chatModerator","msgCooldownSec",q);$.say($.whisperPrefix(r)+$.lang.get("chatmoderator.mesgcooldown.set",q));return}}});$.bind("initReady",function(){if($.bot.isModuleEnabled("./core/chatmoderator.js")){$.consoleLn("loading the link whitelist...");D(true);$.consoleLn("loading the blacklist...");v(true);$.registerChatCommand("./core/chatmoderator.js","permit",2);$.registerChatCommand("./core/chatmoderator.js","moderation",1);$.registerChatCommand("./core/chatmoderator.js","mod",1);$.registerChatCommand("./core/chatmoderator.js","blacklist",1);$.registerChatCommand("./core/chatmoderator.js","whitelist",1)}});$.timeoutUser=_;$.permitUserLink=N})();
