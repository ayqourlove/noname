'use strict';
character.sp={
	character:{
		yangxiu:['male','wei',3,['jilei','danlao']],
		chenlin:['male','wei',3,['bifa','songci']],
		caohong:['male','wei',4,['yuanhu']],
		xiahouba:['male','shu',4,['baobian']],
		gongsunzan:['male','qun',4,['yicong']],
		yuanshu:['male','qun',4,['yongsi']],
		sp_diaochan:['female','qun',3,['lihun','biyue']],
		sp_zhaoyun:['male','qun',3,['longdan','chongzhen']],
		jsp_zhaoyun:['male','qun',3,['chixin','yicong','suiren']],
		liuxie:['male','qun',3,['tianming','mizhao']],
		zhugejin:['male','wu',3,['hongyuan','huanshi','mingzhe']],
		zhugeke:['male','wu',3,['aocai','duwu']],
		guanyinping:['female','shu',3,['huxiao','xueji','wuji']],
		simalang:['male','wei',3,['junbing','quji']],
		zhangxingcai:['female','shu',3,['shenxian','qiangwu']],
		fuwan:['male','qun',4,['moukui']],
		sp_sunshangxiang:['female','shu',3,['liangzhu','xiaoji']],
		caoang:['male','wei',4,['kaikang']],
		re_yuanshu:['male','qun',4,['wangzun','tongji']],
		sp_caoren:['male','wei',4,['kuiwei','yanzheng']],
		zhangbao:['male','qun',3,['zhoufu','yingbin']],
		zhangliang:['male','qun',3,['fulu','fuji']],
		maliang:['male','shu',3,['xiemu','naman']],
		sp_pangtong:['male','qun',3,['manjuan','zuixiang']],
		zhugedan:['male','wei',4,['gongao','juyi']],
		sp_jiangwei:['male','shu',4,['kunfen','fengliang']],
		sp_machao:['male','qun',4,['zhuiji','cihuai']],
		sunhao:['male','wu',5,['canshi','chouhai']],
		shixie:['male','qun',3,['biluan','lixia']],
		mayunlu:['female','shu',4,['fengpo','mashu']],
		zhanglu:['male','qun',3,['yishe','bushi','midao']],
		wutugu:['male','qun',15,['ranshang','hanyong']],
		sp_caiwenji:['female','wei',3,['chenqing','mozhi']],
		zhugeguo:['female','shu',3,['yuhua','qirang']],
		liuzan:['male','wu',4,['fenyin']],
		lingcao:['male','wu',4,['dujin']],
		sunru:['female','wu',3,['shixin','qingyi']],
		lingju:['female','qun',3,['jieyuan','fenxin']],
		lifeng:['male','shu',3,['tunchu','shuliang']],
	},
	perfectPair:{
		zhugejin:['zhugeke'],
		guanyinping:['guanyu'],
		zhangxingcai:['liushan'],
		fuwan:['fuhuanghou'],
		sunshangxiang:['liubei'],
		caoang:['caocao'],
		zhangbao:['zhangliang','zhangjiao'],
		zhangliang:['zhangjiao'],
		maliang:['masu'],
		lingcao:['lingtong'],
		lingju:['diaochan','lvbu'],
	},
	skill:{
		tunchu:{
			audio:2,
			trigger:{player:'phaseDrawBegin'},
			check:function(event,player){
				return player.num('h')-player.num('h',{type:'equip'})+2<=player.hp;
			},
			content:function(){
				trigger.num+=2;
				player.addTempSkill('tunchu_choose','phaseDrawAfter');
			},
			init:function(player){
				player.storage.tunchu=[];
			},
			intro:{
				content:'cards'
			},
			group:'tunchu_disable',
			subSkill:{
				choose:{
					trigger:{player:'phaseDrawEnd'},
					forced:true,
					popup:false,
					content:function(){
						'step 0'
						player.removeSkill('tunchu_choose');
						if(player.num('h')){
							player.chooseCard('h',true);
						}
						else{
							event.finish();
						}
						'step 1'
						player.lose(result.cards,ui.special);
						player.storage.tunchu=player.storage.tunchu.concat(result.cards);
						player.markSkill('tunchu');
						player.syncStorage('tunchu');
					}
				},
				disable:{
					mod:{
						cardEnabled:function(card,player){
							if(player.storage.tunchu&&player.storage.tunchu.length&&
								(card.name=='sha'||card.name=='juedou')){
								return false;
							}
						},
						cardUsable:function(card,player){
							if(player.storage.tunchu&&player.storage.tunchu.length&&
								(card.name=='sha'||card.name=='juedou')){
								return false;
							}
						},
					}
				}
			}
		},
		shuliang:{
			audio:2,
			trigger:{global:'phaseEnd'},
			direct:true,
			filter:function(event,player){
				return player.storage.tunchu&&player.storage.tunchu.length>0&&event.player.num('h')==0;
			},
			content:function(){
				'step 0'
				var goon=(ai.get.attitude(player,trigger.player)>0);
				player.chooseCardButton('是否对'+get.translation(trigger.player)+'发动【输粮】？',player.storage.tunchu).ai=function(){
					if(goon) return 1;
					return 0;
				}
				'step 1'
				if(result.bool){
					player.logSkill('shuliang',trigger.player);
					player.storage.tunchu.remove(result.links[0]);
					player.$throw(result.links);
					ui.discardPile.appendChild(result.links[0]);
					player.syncStorage('tunchu');
					if(player.storage.tunchu.length==0){
						player.unmarkSkill('tunchu');
					}
					trigger.player.draw(2);
				}
			}
		},
		jieyuan:{
			group:['jieyuan_more','jieyuan_less'],
			subSkill:{
				more:{
					audio:true,
					trigger:{source:'damageBegin'},
					direct:true,
					filter:function(event,player){
						if(!player.num('h',{color:'black'})) return false;
						return event.player.hp>=player.hp&&player!=event.player;
					},
					content:function(){
						'step 0'
						var goon=(ai.get.attitude(player,trigger.player)<0);
						var next=player.chooseToDiscard('是否对'+get.translation(trigger.player)+'发动【竭缘】？',{color:'black'});
						next.ai=function(){
							if(goon){
								return 8-ai.get.value(card);
							}
							return 0;
						}
						next.logSkill=['jieyuan_more',trigger.player];
						'step 1'
						if(result.bool){
							trigger.num++;
						}
					}
				},
				less:{
					audio:true,
					trigger:{player:'damageBegin'},
					filter:function(event,player){
						if(!player.num('h',{color:'red'})) return false;
						return event.source&&event.source.hp>=player.hp&&player!=event.source;
					},
					direct:true,
					content:function(){
						"step 0"
						var next=player.chooseToDiscard('竭缘：是否弃置一张红色手牌令伤害-1？',{color:'red'});
						next.ai=function(card){
							if(player.hp==1||trigger.num>1){
								return 9-ai.get.value(card);
							}
							if(player.hp==2){
								return 8-ai.get.value(card);
							}
							return 7-ai.get.value(card);
						};
						next.logSkill='jieyuan_less';
						"step 1"
						if(result.bool){
							game.delay();
							trigger.num--;
						}
					}
				}
			},
			ai:{
				expose:0.2,
				threaten:1.5
			}
		},
		fenxin:{
			mode:['identity'],
			trigger:{source:'dieBegin'},
			init:function(player){
				player.storage.fenxin=false;
			},
			intro:{
				content:'limited'
			},
			audio:2,
			mark:true,
			filter:function(event,player){
				if(player.storage.fenxin) return false;
				return event.player.identity!='zhu'&&player.identity!='zhu'&&
					player.identity!='mingzhong'&&event.player.identity!='mingzhong';
			},
			check:function(event,player){
				if(player.identity==event.player.identity) return Math.random()<0.5;
				var stat=ai.get.situation();
				switch(player.identity){
					case 'fan':
						if(stat<0) return false;
						if(stat==0) return Math.random()<0.6;
						return true;
					case 'zhong':
						if(stat>0) return false;
						if(stat==0) return Math.random()<0.6;
						return true;
					case 'nei':
						if(event.player.identity=='fan'&&stat<0) return true;
						if(event.player.identity=='zhong'&&stat>0) return true;
						if(stat==0) return Math.random()<0.7;
						return false;
				}
			},
			prompt:function(event,player){
				return '焚心：是否与'+get.translation(event.player)+'交换身份？';
			},
			content:function(){
				var identity=player.identity;
				player.identity=trigger.player.identity;
				if(player.identityShown||player==game.me){
					player.setIdentity();
				}
				trigger.player.identity=identity;
				player.line(trigger.player,'green');
				player.storage.fenxin=true;
				player.unmarkSkill('fenxin');
			}
		},
		qingyi:{
			group:['qingyi1','qingyi2']
		},
		qingyi1:{
			audio:true,
			trigger:{player:'phaseBegin'},
			direct:true,
			content:function(){
				"step 0"
				player.addSkill('qingyi3');
				var check= player.num('h')>2;
				player.chooseTarget('是否发动【轻逸】？',function(card,player,target){
					if(player==target) return false;
					return player.canUse({name:'sha'},target);
				}).ai=function(target){
					if(!check) return 0;
					return ai.get.effect(target,{name:'sha'},_status.event.player);
				}
				"step 1"
				if(result.bool){
					player.logSkill('qingyi1',result.targets);
					player.useCard({name:'sha'},result.targets[0],false);
					player.skip('phaseJudge');
					player.skip('phaseDraw');
				}
				player.removeSkill('qingyi3');
			}
		},
		qingyi2:{
			audio:true,
			trigger:{player:'phaseUseBefore'},
			direct:true,
			filter:function(event,player){
				return player.num('he',{type:'equip'})>0;
			},
			content:function(){
				"step 0"
				player.addSkill('qingyi3');
				var check=player.num('h')<=player.hp;
				player.chooseCardTarget({
					prompt:'是否发动【轻逸】？',
					filterCard:function(card){
						return get.type(card)=='equip'
					},
					position:'he',
					filterTarget:function(card,player,target){
						if(player==target) return false;
						return player.canUse({name:'sha'},target);
					},
					ai1:function(card){
						if(!check) return 0;
						return 6-ai.get.value(card);
					},
					ai2:function(target){
						if(!check) return 0;
						return ai.get.effect(target,{name:'sha'},_status.event.player);
					}
				});
				"step 1"
				if(result.bool){
					player.logSkill('qingyi2',result.targets);
					player.discard(result.cards[0]);
					player.useCard({name:'sha'},result.targets[0]);
					trigger.untrigger();
					trigger.finish();
				}
				player.removeSkill('qingyi3');
			}
		},
		qingyi3:{
			mod:{
				targetInRange:function(card,player,target,now){
					return true;
				}
			},
		},
		shixin:{
			audio:2,
			trigger:{player:'damageBefore'},
			filter:function(event){
				return event.nature=='fire';
			},
			forced:true,
			content:function(){
				trigger.untrigger();
				trigger.finish();
			},
			ai:{
				nofire:true,
				effect:{
					target:function(card,player,target,current){
						if(get.tag(card,'fireDamage')) return 0;
					}
				}
			}
		},
		fenyin:{
			audio:2,
			trigger:{player:'useCard'},
			frequent:true,
			filter:function(event,player){
				if(!event.cards||event.cards.length!=1) return false;
				if(_status.currentPhase!=player) return false;
				if(!player.storage.fenyin) return false;
				return get.color(player.storage.fenyin)!=get.color(event.cards[0]);
			},
			content:function(){
				player.draw();
			},
			intro:{
				content:'card'
			},
			group:['fenyin2','fenyin3']
		},
		fenyin3:{
			trigger:{player:'useCard'},
			priority:-1,
			forced:true,
			popup:false,
			silent:true,
			filter:function(event,player){
				if(!event.cards||event.cards.length!=1) return false;
				if(_status.currentPhase!=player) return false;
				return true;
			},
			content:function(){
				player.storage.fenyin=trigger.cards[0];
			}
		},
		fenyin2:{
			trigger:{player:'phaseAfter'},
			forced:true,
			silent:true,
			popup:false,
			content:function(){
				player.storage.fenyin=null;
			}
		},
		dujin:{
			audio:2,
			trigger:{player:'phaseDrawBegin'},
			frequent:true,
			content:function(){
				trigger.num+=1+Math.floor(player.num('e')/2);
			}
		},
		qirang:{
			audio:2,
			trigger:{player:'equipEnd'},
			frequent:true,
			content:function(){
				player.gain(get.cardPile(function(card){
					return get.type(card,'trick')=='trick';
				}),'gain2');
			},
			ai:{
				effect:{
					target:function(card,player,target,current){
						if(get.type(card)=='equip') return [1,3];
					}
				},
				threaten:1.3
			}
		},
		yuhua:{
			trigger:{player:'phaseDiscardBegin'},
			forced:true,
			audio:2,
			filter:function(event,player){
				return player.num('h',{type:'basic'})<player.num('h');
			},
			content:function(){
				'step 0'
				var hs=player.get('h');
				for(var i=0;i<hs.length;i++){
					if(get.type(hs[i])=='basic'){
						hs.splice(i--,1);
					}
				}
				if(hs.length){
					player.lose(hs,ui.special)._triggered=null;
					player.storage.yuhua=hs;
				}
				else{
					event.finish();
				}
				'step 1'
				game.delay();
			},
			group:'yuhua2'
		},
		yuhua2:{
			audio:false,
			trigger:{player:'phaseDiscardEnd'},
			forced:true,
			filter:function(event,player){
				return player.storage.yuhua?true:false;
			},
			content:function(){
				player.directgain(player.storage.yuhua);
				delete player.storage.yuhua;
			}
		},
		chenqing:{
			trigger:{global:'dying'},
			priority:6,
			filter:function(event,player){
				return event.player.hp<=0&&!player.skills.contains('chenqing2');
			},
			direct:true,
			content:function(){
				'step 0'
				player.chooseTarget('是否发动【陈情】？',function(card,player,target){
					return target!=player&&target!=trigger.player;
				}).ai=function(target){
					if(ai.get.attitude(player,trigger.player)>0){
						var att1=ai.get.attitude(target,player);
						var att2=ai.get.attitude(target,trigger.player);
						var att3=ai.get.attitude(player,target);
						if(att3<0) return 0;
						return att1/2+att2+att3;
					}
					else{
						return ai.get.attitude(player,target);
					}
				}
				'step 1'
				if(result.bool){
					player.addTempSkill('chenqing2',{player:'phaseBegin'});
					event.target=result.targets[0];
					event.target.draw(4);
					player.logSkill('chenqing',event.target);
				}
				else{
					event.finish();
				}
				'step 2'
				var target=event.target;
				var tosave=trigger.player;
				var att=ai.get.attitude(target,tosave);
				var hastao=target.num('h','tao');
				target.chooseToDiscard(4,true).ai=function(card){
					if(!hastao&&att>0){
						var suit=get.suit(card);
						for(var i=0;i<ui.selected.cards.length;i++){
							if(get.suit(ui.selected.cards[i])==suit){
								return -4-ai.get.value(card);
							}
						}
					}
					if(att<0&&ui.selected.cards.length==3){
						var suit=get.suit(card);
						for(var i=0;i<ui.selected.cards.length;i++){
							if(get.suit(ui.selected.cards[i])==suit){
								return -ai.get.value(card);
							}
						}
						return -10-ai.get.value(card);
					}
					return -ai.get.value(card);
				}
				'step 3'
				if(result.cards&&result.cards.length==4){
					var suits=[];
					for(var i=0;i<result.cards.length;i++){
						suits.add(get.suit(result.cards[i]));
					}
					if(suits.length==4){
						event.target.useCard({name:'tao'},trigger.player);
					}
				}
			},
			ai:{
				skillTagFilter:function(player){
					return !player.skills.contains('chenqing2');
				},
				expose:0.2,
				threaten:1.5,
				save:true,
			}
		},
		mozhi:{
			intro:{
				content:'cards'
			},
			init:function(player){
				player.storage.mozhi=[];
			},
			trigger:{player:'phaseEnd'},
			direct:true,
			filter:function(event,player){
				return player.storage.mozhi.length>0&&player.num('h')>0;
			},
			content:function(){
				if(player.storage.mozhi.length&&player.num('h')){
					var card=player.storage.mozhi.shift();
					card={name:card.name,nature:card.nature,suit:card.suit,number:card.number};
					if(lib.filter.cardEnabled(card)){
						for(var i=0;i<game.players.length;i++){
							if(player.canUse(card,game.players[i])){
								break;
							}
						}
						if(i<game.players.length){
							lib.skill.mozhix.viewAs=card;
							var next=player.chooseToUse();
							next.logSkill='mozhi';
							if(event.isMine()){
								next.openskilldialog='将一张手牌当'+get.translation(card)+'使用';
							}
							next.norestore=true;
							next.backup('mozhix');
						}
					}
					event.redo();
				}
			},
			group:['mozhi2','mozhi3']
		},
		mozhix:{
			filterCard:true,
			selectCard:1
		},
		mozhi2:{
			trigger:{player:'phaseAfter'},
			forced:true,
			silent:true,
			popup:false,
			content:function(){
				player.storage.mozhi.length=0;
				player.unmarkSkill('mozhi');
			}
		},
		mozhi3:{
			trigger:{player:'useCard'},
			forced:true,
			silent:true,
			popup:false,
			filter:function(event,player){
				if(_status.currentPhase!=player) return false;
				if(event.parent.parent.name!='phaseUse') return false;
				var type=get.type(event.card);
				return player.storage.mozhi.length<2&&(type=='basic'||type=='trick');
			},
			content:function(){
				player.storage.mozhi.add(trigger.card);
				player.markSkill('mozhi');
			}
		},
		chenqing2:{},
		ranshang:{
			audio:2,
			trigger:{player:'damageEnd'},
			filter:function(event,player){
				return event.nature=='fire';
			},
			init:function(player){
				player.storage.ranshang=0;
			},
			forced:true,
			check:function(){
				return false;
			},
			content:function(){
				if(player.storage.ranshang){
					player.storage.ranshang++;
				}
				else{
					player.storage.ranshang=1;
					player.markSkill('ranshang');
				}
				game.addVideo('storage',player,['ranshang',player.storage.ranshang]);
			},
			intro:{
				content:'mark'
			},
			ai:{
				effect:{
					target:function(card,player,target,current){
						if(card.name=='sha'){
							if(card.nature=='fire'||player.skills.contains('zhuque_skill')) return 2;
						}
						if(get.tag(card,'fireDamage')&&current<0) return 2;
					}
				}
			},
			group:'ranshang2'
		},
		ranshang2:{
			audio:2,
			trigger:{player:'phaseEnd'},
			forced:true,
			filter:function(event,player){
				return player.storage.ranshang>0;
			},
			content:function(){
				player.loseHp(player.storage.ranshang);
			}
		},
		hanyong:{
			trigger:{player:'useCard'},
			filter:function(event,player){
				return player.storage.hanyong>player.hp&&event.card&&
					(event.card.name=='nanman'||event.card.name=='wanjian');
			},
			content:function(){
				player.addTempSkill('hanyong3','useCardAfter');
			},
			init:function(player){
				player.storage.hanyong=0;
			},
			group:'hanyong2'
		},
		hanyong2:{
			audio:false,
			trigger:{player:'phaseBegin'},
			forced:true,
			popup:false,
			silent:true,
			content:function(){
				player.storage.hanyong++;
			}
		},
		hanyong3:{
			audio:false,
			trigger:{source:'damageBegin'},
			forced:true,
			filter:function(event,player){
				return event.card&&(event.card.name=='nanman'||event.card.name=='wanjian');
			},
			content:function(){
				trigger.num++;
			}
		},
		yishe:{
			trigger:{player:'phaseEnd'},
			init:function(player){
				player.storage.yishe=[];
			},
			filter:function(event,player){
				return !player.storage.yishe||!player.storage.yishe.length;
			},
			intro:{
				content:'cards'
			},
			content:function(){
				'step 0'
				player.draw(2);
				player.chooseCard(2,'he',true,'选择两张牌作为“米”');
				'step 1'
				player.markSkill('yishe');
				player.storage.yishe=result.cards;
				player.lose(result.cards,ui.special);
				game.addVideo('storage',player,['yishe',get.cardsInfo(player.storage.yishe),'cards']);
			}
		},
		bushi:{
			trigger:{player:'damageEnd',source:'damageEnd'},
			filter:function(event,player){
				return player.storage.yishe&&player.storage.yishe.length&&event.player.isAlive();
			},
			direct:true,
			content:function(){
				'step 0'
				trigger.player.chooseCardButton('选择获得一张“米”',player.storage.yishe);
				'step 1'
				if(result.bool){
					player.logSkill('bushi');
					trigger.player.gain(result.buttons[0].link,'gain2');
					player.storage.yishe.remove(result.buttons[0].link);
					game.addVideo('storage',player,['yishe',get.cardsInfo(player.storage.yishe),'cards']);
					if(player.storage.yishe.length==0){
						player.recover();
						player.unmarkSkill('yishe');
					}
				}
			}
		},
		midao:{
			unique:true,
			trigger:{global:'judge'},
			direct:true,
			filter:function(event,player){
				return player.storage.yishe&&player.storage.yishe.length&&event.player.isAlive();
			},
			content:function(){
				"step 0"
				var list=player.storage.yishe;
				var dialog=ui.create.dialog(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+get.translation(trigger.player.judging[0])+
					'，是否发动【米道】？',list,'hidden');
				player.chooseButton(dialog,function(button){
					var card=button.link;
					var trigger=_status.event.parent._trigger;
					var player=_status.event.player;
					var result=trigger.judge(card)-trigger.judge(trigger.player.judging[0]);
					var attitude=ai.get.attitude(player,trigger.player);
					return result*attitude;
				});
				"step 1"
				if(result.bool){
					event.card=result.buttons[0].link;
					player.$throw(event.card,1000);
					player.storage.yishe.remove(result.buttons[0].link);
					game.addVideo('storage',player,['yishe',get.cardsInfo(player.storage.yishe),'cards']);
					if(player.storage.yishe.length==0){
						player.recover();
						player.unmarkSkill('yishe');
					}
					if(event.card.clone){
						event.card.clone.classList.add('thrownhighlight');
						game.addVideo('highlightnode',player,get.cardInfo(event.card));
					}
				}
				"step 2"
				if(event.card){
					player.logSkill('midao',trigger.player);
					ui.discardPile.appendChild(trigger.player.judging[0]);
					trigger.player.judging[0]=event.card;
					trigger.position.appendChild(event.card);
					game.log(trigger.player,'的判定牌改为',event.card);
					event.card.expired=true;
					game.delay(2);
				}
			},
			ai:{
				tag:{
					rejudge:0.6
				}
			}
		},
		fengpo:{
			audio:2,
			trigger:{player:['shaBegin','juedouBegin']},
			filter:function(event,player){
				if(player.skills.contains('fengpo3')) return false;
				return event.target&&event.targets&&event.targets.length==1;
			},
			direct:true,
			content:function(){
				'step 0'
				player.addTempSkill('fengpo3','phaseAfter');
				player.chooseControl('draw_card','加伤害','cancel',
				ui.create.dialog('是否发动【凤魄】？','hidden'));
				'step 1'
				if(result.control&&result.control!='cancel'){
					player.logSkill('fengpo');
					var nd=trigger.target.num('h',{suit:'diamond'});
					if(result.control=='draw_card'){
						player.draw(nd);
					}
					else{
						player.addTempSkill('fengpo2','useCardToAfter');
						player.storage.fengpo=nd;
					}
				}
			}
		},
		fengpo2:{
			trigger:{source:'damageBegin'},
			filter:function(event){
				return event.card&&(event.card.name=='sha'||event.card.name=='juedou')&&
				event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
			},
			forced:true,
			audio:false,
			content:function(){
				if(typeof player.storage.fengpo=='number'){
					trigger.num+=player.storage.fengpo;
				}
			}
		},
		fengpo3:{},
		biluan:{
			trigger:{player:'phaseDrawBefore'},
			mark:true,
			unique:true,
			intro:{
				content:function(storage){
					if(storage>0){
						return '防御距离+'+storage;
					}
					else if(storage<0){
						return '防御距离'+storage;
					}
					else{
						return '无距离变化';
					}
				}
			},
			init:function(player){
				player.storage.biluan=0;
			},
			check:function(event,player){
				if(player.num('h')>player.hp) return true;
				if(player.num('j','lebu')) return true;
				var ng=[];
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].group!='unknown'){
						ng.add(game.players[i].group);
					}
				}
				ng=ng.length;
				if(ng<2) return false;
				var nai=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player){
						var dist=get.distance(game.players[i],player,'attack');
						if(dist<=1&&dist+ng>1){
							nai++;
						}
					}
				}
				return nai>=2;
			},
			filter:function(event,player){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=player&&
						get.distance(game.players[i],player)<=1){
						return true;
					}
				}
				return false;
			},
			content:function(){
				var ng=[];
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].group!='unknown'){
						ng.add(game.players[i].group);
					}
				}
				player.$damagepop(ng.length,'unknownx');
				player.storage.biluan+=ng.length;
				game.addVideo('storage',player,['biluan',player.storage.biluan]);
				trigger.untrigger();
				trigger.finish();
			},
			mod:{
				globalTo:function(from,to,distance){
					if(typeof to.storage.biluan=='number'){
						return distance+to.storage.biluan;
					}
				}
			}
		},
		lixia:{
			trigger:{global:'phaseEnd'},
			filter:function(event,player){
				return event.player!=player&&get.distance(event.player,player,'attack')>1;
			},
			forced:true,
			content:function(){
				'step 0'
				player.chooseTarget(function(card,player,target){
					return target==player||target==trigger.player;
				},true,'礼下：选择一个目标摸一张牌').ai=function(target){
					return target==player;
				}.ai=function(target){
					return player==target?1:0;
				};
				'step 1'
				if(result.targets.length){
					result.targets[0].draw();
					player.line(result.targets[0],'green');
				}
				player.storage.biluan--;
				game.addVideo('storage',player,['biluan',player.storage.biluan]);
			}
		},
		fuji:{
			trigger:{global:'damageBegin'},
			filter:function(event){
				return event.source&&event.nature=='thunder';
			},
			check:function(event,player){
				return ai.get.attitude(player,event.source)>0;
			},
			prompt:function(event){
				return get.translation(event.source)+'即将对'+get.translation(event.player)+'造成伤害，是否发动【辅祭】？';
			},
			content:function(){
				"step 0"
				trigger.source.judge(ui.special);
				"step 1"
				if(result.color=='black'){
					result.card.goto(ui.discardPile);
					trigger.num++;
				}
				else{
					trigger.source.gain(result.card);
					trigger.source.$gain2(result.card);
				}
			}
		},
		fulu:{
			enable:'chooseToUse',
			filterCard:function(card){
				return card.name=='sha'&&!card.nature;
			},
			viewAs:{name:'sha',nature:'thunder'},
			ai:{
				order:function(){
					return lib.card.sha.ai.order+0.1;
				}
			}
		},
		canshi:{
			audio:2,
			trigger:{player:'phaseDrawBefore'},
			check:function(event,player){
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].hp<game.players[i].maxHp){
						num++;
						if(num>3) return true;
					}
				}
				return false;
			},
			prompt:function(){
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].hp<game.players[i].maxHp){
						num++;
					}
				}
				return '是否放弃摸牌，改为摸'+get.cnNumber(num)+'张牌？';
			},
			content:function(){
				trigger.untrigger();
				trigger.finish();
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].hp<game.players[i].maxHp){
						num++;
					}
				}
				if(num>0){
					player.draw(num);
				}
				player.addTempSkill('canshi2','phaseAfter');
			}
		},
		canshi2:{
			trigger:{player:'useCard'},
			forced:true,
			filter:function(event,player){
				if(player.num('he')==0) return false;
				var type=get.type(event.card,'trick');
				return type=='basic'||type=='trick';
			},
			content:function(){
				game.delay(0.5);
				player.chooseToDiscard(true,'he');
			}
		},
		chouhai:{
			audio:2,
			trigger:{player:'damageBegin'},
			forced:true,
			check:function(){
				return false;
			},
			filter:function(event,player){
				return player.num('h')==0;
			},
			content:function(){
				trigger.num++;
			},
			ai:{
				effect:{
					target:function(card,player,target,current){
						if(get.tag(card,'damage')&&target.num('h')==0) return [1,-2];
					}
				}
			}
		},
		kunfen:{
			audio:2,
			trigger:{player:'phaseEnd'},
			direct:true,
			check:function(event,player){
				if(player.hp>2) return true;
				if(player.hp==2&&player.num('h')==0) return true;
				return false;
			},
			content:function(){
				"step 0"
				if(player.storage.kunfen){
					player.chooseBool('是否发动【困奋】？').ai=function(){
						if(player.hp>3) return true;
						if(player.hp==3&&player.num('h')<3) return true;
						if(player.hp==2&&player.num('h')==0) return true;
						return false;
					}
				}
				else{
					event.forced=true;
				}
				"step 1"
				if(event.forced||result.bool){
					player.logSkill('kunfen');
					player.loseHp();
				}
				else{
					event.finish();
				}
				"step 2"
				player.draw(2);
			},
			ai:{
				threaten:1.5
			}
		},
		fengliang:{
			unique:true,
			audio:2,
			trigger:{player:'dying'},
			priority:10,
			forced:true,
			filter:function(event,player){
				return !player.storage.kunfen;
			},
			content:function(){
				"step 0"
				player.loseMaxHp();
				"step 1"
				if(player.hp<2){
					player.recover(2-player.hp);
				}
				"step 2"
				player.addSkill('tiaoxin');
				player.storage.kunfen=true;
			},
		},
		zhuiji:{
			mod:{
				globalFrom:function(from,to){
					if(from.hp>to.hp) return -Infinity;
				}
			}
		},
		cihuai:{
			trigger:{player:'phaseUseBegin'},
			direct:true,
			filter:function(event,player){
				return player.num('h','sha')==0;
			},
			content:function(){
				"step 0"
				player.chooseTarget('是否发动【刺槐】？',function(card,player,target){
					return player.canUse({name:'sha'},target);
				}).ai=function(target){
					return ai.get.effect(target,{name:'sha'},player,player);
				}
				"step 1"
				if(result.bool){
					player.logSkill('cihuai');
					player.showHandcards();
					player.useCard({name:'sha'},result.targets);
				}
			},
			ai:{
				expose:0.2,
			}
		},
		jilei:{
			trigger:{player:'damageEnd'},
			priority:9,
			audio:2,
			check:function(event,player){
				return ai.get.attitude(player,event.source)<0;
			},
			filter:function(event){
				return event&&event.source;
			},
			content:function(){
				trigger.source.addSkill('jilei2');
			},
			ai:{
				threaten:0.6
			}
		},
		jilei2:{
			unique:true,
			trigger:{global:'phaseAfter'},
			forced:true,
			priority:10,
			audio:2,
			mod:{
				cardEnabled:function(){
					return false;
				},
				cardUsable:function(){
					return false;
				},
				cardRespondable:function(){
					return false;
				},
				cardSavable:function(){
					return false;
				}
			},
			content:function(){
				player.removeSkill('jilei2')
			},
		},
		danlao:{
			priority:9,
			audio:2,
			filter:function(event,player){
				return event.player!=player&&get.type(event.card)=='trick'&&event.targets&&event.targets.length>1;
			},
			check:function(event,player){
				return get.tag(event.card,'multineg')||ai.get.effect(player,event.card,event.player,player)<=0;
			},
			trigger:{target:'useCardToBefore'},
			content:function(){
				trigger.untrigger();
				trigger.finish();
				player.draw();
			},
			ai:{
				effect:{
					target:function(card){
						if(get.type(card)!='trick') return;
						if(card.name=='tiesuo') return [0,0];
						if(card.name=='yihuajiemu') return [0,1];
						if(get.tag(card,'multineg')) return [0,2];
					}
				}
			}
		},
		taichen:{
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return player.canUse('sha',target);
			},
			content:function(){
				"step 0"
				player.loseHp();
				"step 1"
				player.useCard({name:'sha'},target,false);
			},
			ai:{
				order:1,
				result:{
					target:function(player,target){
						if(player.hp>2&&player.hp>target.hp&&target.num('he')<4){
							return ai.get.effect(target,{name:'sha'},player,target);
						}
						return 0;
					}
				}
			}
		},
		manjuan:{
			audio:true,
			trigger:{global:'discardAfter'},
			filter:function(event,player){
				if(event.player==player) return false;
				if(!player.num('he')) return false;
				for(var i=0;i<event.cards.length;i++){
					if(get.position(event.cards[i])=='d'){
						return true;
					}
				}
				return false;
			},
			direct:true,
			content:function(){
				"step 0"
				if(trigger.delay==false) game.delay();
				"step 1"
				var cards=[];
				var suits=['club','spade','heart','diamond']
				for(var i=0;i<trigger.cards.length;i++){
					if(get.position(trigger.cards[i])=='d'){
						cards.push(trigger.cards[i]);
						suits.remove(get.suit(trigger.cards[i]));
					}
				}
				if(cards.length){
					var dialog;
					if(event.isMine()){
						dialog=ui.create.dialog('是否发动【'+get.translation(event.name)+'】？','hidden');
						dialog.add(cards);
						for(var i=0;i<dialog.buttons.length;i++){
							dialog.buttons[i].style.opacity=1;
						}
					}
					var maxval=0;
					for(var i=0;i<cards.length;i++){
						var tempval=ai.get.value(cards[i]);
						if(tempval>maxval){
							maxval=tempval;
						}
					}
					maxval+=cards.length-1;
					var next=player.chooseToDiscard('he',{suit:suits},dialog);
					next.ai=function(card){
						return maxval-ai.get.value(card);
					};
					next.logSkill=event.name;
					event.cards=cards;
				}
				"step 2"
				if(result.bool){
					game.log(player,'获得了',event.cards);
					player.gain(event.cards,'gain2');
				}
			},
			ai:{
				threaten:1.3
			}
		},
		zuixiang:{
			audio:true,
			unique:true,
			mark:true,
			trigger:{player:'phaseBegin'},
			priority:10,
			filter:function(event,player){
				if(player.storage.zuixiang) return false;
				return true;
			},
			check:function(event,player){
				return player.num('h')<player.hp&&player.hp==player.maxHp;
			},
			content:function(){
				"step 0"
				player.storage.zuixiang=get.cards(3);
				game.addVideo('storage',player,['zuixiang',get.cardsInfo(player.storage.zuixiang),'cards']);
				player.showCards(player.storage.zuixiang);
				"step 1"
				var cards=player.storage.zuixiang;
				if(cards[0].number==cards[1].number||
					cards[0].number==cards[2].number||
					cards[2].number==cards[1].number){
					player.gain(player.storage.zuixiang,'draw2');
					player.storage.zuixiang=[];
					player.unmarkSkill('zuixiang');
					delete player.storage.zuixiang2;
				}
				else{
					player.storage.zuixiang2=[];
					for(var i=0;i<cards.length;i++){
						player.storage.zuixiang2.add(get.type(cards[i],'trick'));
					}
				}
				player.storage.zuixiangtemp=true;
			},
			group:'zuixiang2',
			intro:{
				content:'cards'
			},
			mod:{
				targetEnabled:function(card,player,target){
					if(target.storage.zuixiang2&&target.storage.zuixiang2.contains(get.type(card,'trick'))){
						return false;
					}
				},
				cardEnabled:function(card,player){
					if(player.storage.zuixiang2&&player.storage.zuixiang2.contains(get.type(card,'trick'))){
						return false;
					}
				},
				cardUsable:function(card,player){
					if(player.storage.zuixiang2&&player.storage.zuixiang2.contains(get.type(card,'trick'))){
						return false;
					}
				},
				cardRespondable:function(card,player){
					if(player.storage.zuixiang2&&player.storage.zuixiang2.contains(get.type(card,'trick'))){
						return false;
					}
				},
				cardSavable:function(card,player){
					if(player.storage.zuixiang2&&player.storage.zuixiang2.contains(get.type(card,'trick'))){
						return false;
					}
				}
			}
		},
		zuixiang2:{
			unique:true,
			trigger:{player:'phaseBegin'},
			priority:9.5,
			filter:function(event,player){
				if(player.storage.zuixiang&&player.storage.zuixiang.length) return true;
				return false;
			},
			forced:true,
			popup:false,
			content:function(){
				"step 0"
				if(player.storage.zuixiangtemp){
					delete player.storage.zuixiangtemp;
					event.finish();
				}
				else{
					for(var i=0;i<player.storage.zuixiang.length;i++){
						ui.discardPile.appendChild(player.storage.zuixiang[i]);
					}
					player.storage.zuixiang=get.cards(3);
					game.addVideo('storage',player,['zuixiang',get.cardsInfo(player.storage.zuixiang),'cards']);
					player.showCards(player.storage.zuixiang);
				}
				"step 1"
				var cards=player.storage.zuixiang;
				if(cards[0].number==cards[1].number||
					cards[0].number==cards[2].number||
					cards[2].number==cards[1].number){
					player.gain(player.storage.zuixiang,'draw2');
					player.storage.zuixiang=[];
					player.unmarkSkill('zuixiang');
					delete player.storage.zuixiang2;
				}
				else{
					player.storage.zuixiang2=[];
					for(var i=0;i<cards.length;i++){
						player.storage.zuixiang2.add(get.type(cards[i]));
					}
				}
			},
		},
		naman:{
			audio:2,
			trigger:{global:'respondEnd'},
			filter:function(event,player){
				if(event.card.name!='sha') return false;
				if(event.player==player) return false;
				if(event.cards){
					for(var i=0;i<event.cards.length;i++){
						if(get.position(event.cards[i])=='d') return true;
					}
				}
				return false;
			},
			frequent:true,
			content:function(){
				var cards=trigger.cards.slice(0);
				for(var i=0;i<cards.length;i++){
					if(get.position(cards[i])!='d'){
						cards.splice(i--,1);
					}
				}
				game.delay(0.5);
				player.gain(cards,'gain2');
			},
		},
		xiemu:{
			audio:2,
			trigger:{target:'useCardToBegin'},
			filter:function(event,player){
				if(get.color(event.card)!='black') return false;
				if(!event.player) return false;
				if(event.player==player) return false;
				return player.num('h','sha')>0;
			},
			direct:true,
			content:function(){
				"step 0"
				var next=player.chooseToDiscard('协穆：是否弃置一张杀并摸两张牌？',{name:'sha'});
				next.ai=function(card){
					return 9-ai.get.value(card);
				};
				next.logSkill='xiemu';
				"step 1"
				if(result.bool){
					player.draw(2);
				}
			},
			ai:{
				effect:{
					target:function(card,player,target){
						if(get.color(card)=='black'&&target.num('h')>0){
							return [1,0.5];
						}
					}
				}
			}
		},
		spmengjin:{
			trigger:{player:'shaBegin'},
			filter:function(event,player){
				return event.target.num('he')>0;
			},
			direct:true,
			content:function(){
				"step 0"
				var att=ai.get.attitude(player,trigger.target);
				player.choosePlayerCard('是否发动【猛进】？','he',trigger.target).ai=function(button){
					var val=ai.get.buttonValue(button);
					if(att>0) return -val;
					return val;
				};
				"step 1"
				if(result.bool){
					trigger.target.discard(result.links);
					player.logSkill('spmengjin',trigger.target);
					trigger.target.addTempSkill('mengjin2','shaAfter');
				}
			},
			ai:{
				expose:0.2
			}
		},
		fenxun:{
			audio:2,
			trigger:{player:'shaBefore'},
			direct:true,
			filter:function(event,player){
				return event.targets.length==1;
			},
			position:'he',
			content:function(){
				"step 0"
				player.chooseCardTarget({
					filterCard:true,
					filterTarget:function(card,player,target){
						return lib.filter.targetEnabled(trigger.card,player,target)&&target!=trigger.targets[0];
					},
					ai1:function(card){
						return 6-ai.get.value(card);
					},
					ai2:function(target){
						return ai.get.effect(target,trigger.card,player,player);
					},
					prompt:'是否发动【奋迅】？'
				});
				"step 1"
				if(result.bool){
					player.discard(result.cards);
					trigger.targets.push(result.targets[0]);
					player.logSkill('fenxun',result.targets);
				}
			}
		},
		zhoufu:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			filterCard:true,
			filterTarget:function(card,player,target){
				return player!=target&&!target.skills.contains('zhoufu2');
			},
			prepare:function(cards,player){
				player.$throw(cards);
			},
			discard:false,
			content:function(){
				target.$gain2(cards);
				target.storage.zhoufu2=cards[0];
				target.addSkill('zhoufu2');
				target.storage.zhoufu3=player;
				ui.special.appendChild(cards[0]);
				game.addVideo('storage',target,['zhoufu2',get.cardInfo(cards[0]),'card']);
			},
			check:function(card){
				return 3-ai.get.value(card)
			},
			ai:{
				expose:0.1,
				order:1,
				result:{
					player:1
				}
			}
		},
		zhoufu2:{
			trigger:{player:'judge'},
			forced:true,
			priority:10,
			mark:'card',
			content:function(){
				"step 0"
				ui.discardPile.appendChild(player.storage.zhoufu2);
				player.$throw(player.storage.zhoufu2);
				if(player.storage.zhoufu3.isAlive()&&player.storage.zhoufu3.skills.contains('yingbin')){
					player.logSkill('yingbin');
					player.storage.zhoufu3.draw(2);
				}
				else{
					game.delay(1.5);
				}
				"step 1"
				player.judging[0]=player.storage.zhoufu2;
				trigger.position.appendChild(player.storage.zhoufu2);
				// trigger.untrigger();
				game.log(player,'的判定牌改为',player.storage.zhoufu2);
				player.removeSkill('zhoufu2');
				delete player.storage.zhoufu2;
				delete player.storage.zhoufu3;
			},
			intro:{
				content:'card'
			},
			group:'zhoufu3'
		},
		zhoufu3:{
			trigger:{player:'phaseEnd'},
			forced:true,
			content:function(){
				if(player.storage.zhoufu2){
					player.unmark(player.storage.zhoufu2.name);
					if(player.storage.zhoufu3.isAlive()){
						player.storage.zhoufu3.gain(player.storage.zhoufu2);
						player.$give(player.storage.zhoufu2,player.storage.zhoufu3);
						game.delay();
					}
					else{
						ui.discardPile.appendChild(player.storage.zhoufu2);
					}
				}
				player.removeSkill('zhoufu2');
				delete player.storage.zhoufu2;
				delete player.storage.zhoufu3;
			},
		},
		yingbin:{
			audio:2,
		},
		kuiwei:{
			audio:2,
			trigger:{player:'phaseEnd'},
			check:function(event,player){
				if(player.isTurnedOver()) return true;
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].get('e','1')) num++;
				}
				return num>1;
			},
			content:function(){
				"step 0"
				player.turnOver();
				"step 1"
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].get('e','1')) num++;
				}
				player.draw(2+num);
				player.addSkill('kuiwei2');
			},
			ai:{
				effect:{
					target:function(card){
						if(card.name=='guiyoujie') return [0,2];
					}
				}
			}
		},
		kuiwei2:{
			trigger:{player:'phaseDrawBegin'},
			forced:true,
			audio:false,
			content:function(){
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].get('e','1')) num++;
				}
				if(num>=player.num('he')){
					player.discard(player.get('he'));
				}
				else if(num){
					player.chooseToDiscard(num,true);
				}
				player.removeSkill('kuiwei2');
			}
		},
		yanzheng:{
			enable:'chooseToUse',
			audio:2,
			filter:function(event,player){
				return player.hp<player.num('h')&&player.num('e')>0;
			},
			viewAsFilter:function(player){
				return player.hp<player.num('h')&&player.num('e')>0;
			},
			filterCard:true,
			position:'e',
			viewAs:{name:'wuxie'},
			prompt:'将一张装备区内的牌当无懈可击使用',
			check:function(card){return 8-ai.get.equipValue(card)},
			threaten:1.2
		},
		tongji:{
			global:'tongji_disable',
			unique:true,
			gainnable:true,
			subSkill:{
				disable:{
					mod:{
						targetEnabled:function(card,player,target){
							if(player.skills.contains('tongji')) return;
							if(card.name=='sha'){
								if(target.skills.contains('tongji')) return;
								for(var i=0;i<game.players.length;i++){
									if(game.players[i].skills.contains('tongji')){
										if(game.players[i].hp<game.players[i].num('h')&&
											get.distance(player,game.players[i],'attack')<=1){
											return false;
										}
									}
								}
							}
						}
					}
				}
			}
		},
		wangzun:{
			audio:2,
			trigger:{global:'phaseBegin'},
			check:function(event,player){
				var att=ai.get.attitude(player,event.player);
				for(var i=0;i<game.players.length;i++){
					if(ai.get.attitude(player,game.players[i])<att) return false;
				}
				return true;
			},
			filter:function(event,player){
				return event.player!=player&&!player.storage.wangzun;
			},
			prompt:function(event,player){
				return '是否对'+get.translation(event.player)+'发动【妄尊】？';
			},
			content:function(){
				player.draw();
				player.markSkill('wangzun');
				player.storage.wangzun=trigger.player;
				trigger.player.addTempSkill('wangzun3','phaseAfter');
			},
			ai:{
				expose:0.2
			},
			intro:{
				content:'player'
			},
			group:'wangzun2'
		},
		wangzun2:{
			trigger:{player:'phaseBegin'},
			forced:true,
			popup:false,
			silent:true,
			content:function(){
				player.unmarkSkill('wangzun');
				player.storage.wangzun=null;
			}
		},
		wangzun3:{
			mod:{
				maxHandcard:function(player,num){
					return num-1;
				}
			}
		},
		kaikang:{
			audio:2,
			trigger:{global:'shaBegin'},
			filter:function(event,player){
				return get.distance(player,event.target)<=1;
			},
			check:function(event,player){
				return ai.get.attitude(player,event.target)>=0;
			},
			content:function(){
				"step 0"
				player.draw();
				if(trigger.target!=player){
					player.chooseCard(true,'he','交给'+get.translation(trigger.target)+'一张牌').ai=function(card){
						if(card.name=='shan') return 1;
					};
				}
				else{
					event.finish();
				}
				"step 1"
				trigger.target.gain(result.cards);
				player.$give(result.cards,trigger.target);
				game.delay();
				event.card=result.cards[0];
				if(get.type(event.card)!='equip') event.finish();
				"step 2"
				trigger.target.chooseBool('是否装备'+get.translation(event.card)+'？').ai=function(){
					var current=trigger.target.get('e',{subtype:get.subtype(event.card)});
					if(current&&current.length){
						return ai.get.equipValue(event.card)>ai.get.equipValue(current[0]);
					}
					return true;
				};
				"step 3"
				if(result.bool){
					trigger.target.equip(event.card);
				}
			},
			ai:{
				threaten:1.1
			}
		},
		liangzhu:{
			audio:2,
			trigger:{global:'recoverAfter'},
			check:function(event,player){
				return ai.get.attitude(player,event.player)>=0;
			},
			filter:function(event,player){
				return event.player!=player&&_status.currentPhase==event.player;
			},
			content:function(){
				game.asyncDraw([trigger.player,player]);
			},
			ai:{
				expose:0.2
			}
		},
		mingshi:{
			audio:2,
			trigger:{player:'damageBegin'},
			direct:true,
			filter:function(event,player){
				return event.source&&event.source.hp>player.hp;
			},
			content:function(){
				"step 0"
				var next=player.chooseToDiscard('是否发动【名士】？',{color:'black'});
				next.ai=function(card){
					return 9-ai.get.value(card);
				}
				next.logSkill='mingshi';
				"step 1"
				if(result.bool){
					trigger.num--;
					player.logSkill('mingshi');
				}
			},
			ai:{
				threaten:0.8
			}
		},
		lirang:{
			audio:2,
			trigger:{player:'discardAfter'},
			filter:function(event,player){
				for(var i=0;i<event.cards.length;i++){
					if(get.position(event.cards[i])=='d'){
						return true;
					}
				}
				return false;
			},
			direct:true,
			popup:false,
			content:function(){
				"step 0"
				if(trigger.delay==false) game.delay();
				"step 1"
				player.chooseTarget('是否发动【礼让】？',function(card,player,target){
					return player!=target
				}).ai=function(target){
					return ai.get.attitude(player,target);
				};
				"step 2"
				if(result.bool){
					var target=result.targets[0];
					player.logSkill('lirang',target);
					var cards=[];
					for(var i=0;i<trigger.cards.length;i++){
						if(get.position(trigger.cards[i])=='d'){
							cards.push(trigger.cards[i]);
						}
					}
					target.gain(cards);
					if(event.isMine()){
						target.$draw(cards);
					}
					else{
						target.$gain2(cards);
					}
					if(target==game.me){
						game.delay();
					}
				}
			},
			ai:{
				threaten:0.9,
				expose:0.1
			}
		},
		moukui:{
			trigger:{player:'shaBegin'},
			direct:true,
			audio:2,
			content:function(){
				"step 0"
				var controls=['draw_card'];
				if(trigger.target.num('he')){
					controls.push('discard_card');
				}
				controls.push('cancel');
				player.chooseControl(controls).ai=function(){
					if(trigger.target.num('he')&&ai.get.attitude(player,trigger.target)<0){
						return 'discard_card';
					}
					else{
						return 'draw_card';
					}
				}
				"step 1"
				if(result.control=='draw_card'){
					player.draw();
				}
				else if(result.control=='discard_card'&&trigger.target.num('he')){
					player.discardPlayerCard(trigger.target,'he',true);
				}
				else event.finish();
				"step 2"
				player.logSkill('moukui',trigger.target);
				player.addTempSkill('moukui2','shaEnd');
			},
			ai:{
				expose:0.1
			}
		},
		moukui2:{
			audio:false,
			trigger:{player:'shaMiss'},
			forced:true,
			filter:function(event,player){
				return player.num('he')>0;
			},
			content:function(){
				trigger.target.discardPlayerCard(player,true);
			}
		},
		shenxian:{
			audio:2,
			trigger:{global:'discardAfter'},
			filter:function(event,player){
				if(event.player==player||_status.currentPhase==player) return false;
				if(player.skills.contains('shenxian2')) return false;
				for(var i=0;i<event.cards.length;i++){
					if(get.type(event.cards[i])=='basic'){
						return true;
					}
				}
				return false;
			},
			frequent:true,
			content:function(){
				"step 0"
				if(trigger.delay==false) game.delay();
				"step 1"
				player.draw();
				player.addTempSkill('shenxian2','phaseAfter');
			},
			ai:{
				threaten:1.5
			}
		},
		shenxian2:{},
		qiangwu:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			content:function(){
				"step 0"
				player.judge();
				"step 1"
				player.storage.qiangwu=result.number;
			},
			ai:{
				result:{
					player:1
				},
				order:11
			},
			mod:{
				targetInRange:function(card,player){
					if(_status.currentPhase==player&&card.name=='sha'&&card.number<player.storage.qiangwu) return true;
				},
				cardUsable:function(card,player){
					if(_status.currentPhase==player&&card.name=='sha'&&card.number>player.storage.qiangwu) return Infinity;
				}
			},
			group:'qiangwu2'
		},
		qiangwu2:{
			trigger:{player:'phaseUseBegin'},
			forced:true,
			popup:false,
			content:function(){
				delete player.storage.qiangwu;
			}
		},
		zhendu:{
			audio:2,
			trigger:{global:'phaseUseBegin'},
			filter:function(event,player){
				return event.player!=player&&player.num('h')>0;
			},
			direct:true,
			content:function(){
				"step 0"
				var nono=(Math.abs(ai.get.attitude(player,trigger.player))<3);
				var next=player.chooseToDiscard('是否对'+get.translation(trigger.player)+'发动【鸩毒】？');
				next.ai=function(card){
					if(nono) return -1;
					if(ai.get.damageEffect(trigger.player,player,player)>0){
						return 7-ai.get.useful(card);
					}
					return -1;
				}
				next.logSkill=['zhendu',trigger.player];
				"step 1"
				if(result.bool){
					trigger.player.damage();
				}
				else{
					event.finish();
				}
				"step 2"
				trigger.player.useCard({name:'jiu'},trigger.player);
			},
			ai:{
				threaten:2,
				expose:0.3
			}
		},
		qiluan:{
			trigger:{source:'dieAfter'},
			forced:true,
			priority:-10,
			silent:true,
			popup:false,
			filter:function(event){
				return _status.currentPhase!=event.player;
			},
			content:function(){
				player.storage.qiluan=true;
			},
			group:['qiluan2','qiluan3']
		},
		qiluan2:{
			audio:2,
			trigger:{global:'phaseAfter'},
			forced:true,
			filter:function(event,player){
				return player.storage.qiluan?true:false;
			},
			content:function(){
				player.draw(3);
				player.storage.qiluan=false;
			}
		},
		qiluan3:{
			trigger:{source:'dieAfter'},
			forced:true,
			priority:-10,
			filter:function(event){
				return _status.currentPhase==event.player;
			},
			content:function(){
				player.draw(3);
			},
		},
		shangyi:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return player!=target&&target.num('h');
			},
			content:function(){
				"step 0"
				player.chooseCardButton(target,target.get('h')).filterButton=function(button){
					return get.color(button.link)=='black';
				}
				"step 1"
				if(result.bool){
					target.discard(result.links[0]);
				}
			},
			ai:{
				order:11,
				result:{
					target:function(player,target){
						return -target.num('h');
					}
				},
				threaten:1.1
			},
		},
		shengxi:{
			trigger:{player:'phaseDiscardBegin'},
			frequent:true,
			filter:function(event,player){
				return !player.getStat('damage');
			},
			content:function(){
				player.draw(2);
			},
			// audio:2,
		},
		shoucheng:{
			trigger:{global:'loseEnd'},
			audio:2,
			check:function(event,player){
				return ai.get.attitude(player,event.player)>0;
			},
			filter:function(event,player){
				if(event.player.num('h')) return false;
				if(_status.currentPhase==event.player) return false;
				for(var i=0;i<event.cards.length;i++){
					if(event.cards[i].original=='h') return true;
				}
				return false;
			},
			content:function(){
				trigger.player.draw();
			},
			ai:{
				threaten:1.3,
				expose:0.2
			}
		},
		hengzheng:{
			audio:2,
			trigger:{player:'phaseDrawBefore'},
			filter:function(event,player){
				return player.hp==1||player.num('h')==0;
			},
			check:function(event,player){
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].num('he')&&game.players[i]!=player&&
						ai.get.attitude(player,game.players[i])<=0){
						num++;
					}
					if(game.players[i].num('j')&&game.players[i]!=player&&
						ai.get.attitude(player,game.players[i])>0){
						num+=2;
					}
					if(num>1) return true;
				}
				return false;
			},
			content:function(){
				"step 0"
				var targets=game.players.slice(0);
				targets.remove(player);
				targets.sort(lib.sort.seat);
				event.targets=targets;
				event.num=0;
				trigger.untrigger();
				trigger.finish();
				"step 1"
				if(num<event.targets.length){
					if(event.targets[num].num('hej')){
						player.gainPlayerCard(event.targets[num],'hej',true);
					}
					event.num++;
					event.redo();
				}
			},
			ai:{
				threaten:function(player,target){
					if(target.hp==1) return 2.5;
					return 1;
				},
			}
		},
		yongjue:{
			audio:2,
			trigger:{global:'useCardEnd'},
			filter:function(event,player){
				if(event.card.name!='sha') return false;
				if(event.player==player) return false;
				if(event.targets.contains(player)) return false;
				if(player.tempSkills.yongjue2) return false;
				if(event.cards){
					for(var i=0;i<event.cards.length;i++){
						if(get.position(event.cards[i])=='d') return true;
					}
				}
				return false;
			},
			frequent:true,
			content:function(){
				var cards=trigger.cards.slice(0);
				for(var i=0;i<cards.length;i++){
					if(get.position(cards[i])!='d'){
						cards.splice(i--,1);
					}
				}
				player.gain(cards,'gain2');
				player.addTempSkill('yongjue2','phaseAfter');
			},
		},
		yongjue2:{},
		guixiu:{
			audio:2,
			trigger:{target:'shaBegin'},
			frequent:true,
			filter:function(event,player){
				return player.num('h')<player.hp;
			},
			content:function(){
				player.draw();
			}
		},
		cunsi:{
			audio:2,
			unique:true,
			enable:'phaseUse',
			mark:true,
			filter:function(event,player){
				return !player.storage.cunsi&&player.num('h')&&!player.isTurnedOver();
			},
			init:function(player){
				player.storage.cunsi=false;
			},
			filterTarget:function(card,player,target){
				return player!=target&&target.sex=='male';
			},
			content:function(){
				"step 0"
				player.unmarkSkill('cunsi');
				var cards=player.get('h');
				target.gain(cards);
				player.$give(cards.length,target);
				player.storage.cunsi=true;
				game.delay();
				target.addSkill('yongjue');
				target.marks.yongjue=target.markCharacter(player,{
					name:'存嗣',
					content:'$<div><div class="skill">【勇决】</div><div>每当其他角色于回合内使用一张杀，若目标不是你，你可以获得之（每回合最多能以此法获得一张杀）</div></div>'
				})
				game.addVideo('markCharacter',target,{
					name:'存嗣',
					content:'$<div><div class="skill">【勇决】</div><div>每当其他角色于回合内使用一张杀，若目标不是你，你可以获得之（每回合最多能以此法获得一张杀）',
					id:'yongjue',
					target:player.dataset.position
				});
				"step 1"
				player.turnOver();
				player.removeSkill('guixiu');
			},
			intro:{
				content:'limited'
			},
			ai:{
				order:4,
				result:{
					target:function(player,target){
						if(target.isMin()) return 0;
						if(player.hp>1){
							if(game.phaseNumber<game.players.length) return 0;
							if(target.hp==1&&target.maxHp>2) return 0;
							if(ai.get.attitude(player,target)<5) return 0;
						}
						if(ai.get.attitude(player,target)<5) return 0;
						if(target.hp==1&&target.maxHp>2) return 0.2;
						if(target==game.me) return 1.2;
						return 1;
					}
				},
				expose:0.5,
				threaten:1.5
			}
		},
		fenming:{
			audio:2,
			trigger:{player:'phaseEnd'},
			check:function(event,player){
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].isLinked()&&game.players[i].num('he')){
						num+=ai.get.attitude(player,game.players[i]);
					}
				}
				return num<0;
			},
			filter:function(event,player){
				return player.isLinked();
			},
			content:function(){
				"step 0"
				event.targets=[];
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].isLinked()&&game.players[i].num('he')){
						event.targets.push(game.players[i]);
					}
				}
				event.num=0;
				event.targets.sort(lib.sort.seat);
				"step 1"
				if(event.num<event.targets.length){
					var target=event.targets[event.num];
					if(player==target){
						player.chooseToDiscard(true,'he');
					}
					else{
						player.discardPlayerCard(true,'he',target);
					}
					event.num++;
					event.redo();
				}
			}
		},
		duanxie:{
			enable:'phaseUse',
			usable:1,
			audio:2,
			filterTarget:function(card,player,target){
				return player!=target&&!target.isLinked();
			},
			content:function(){
				"step 0"
				if(!target.isLinked()) target.link();
				"step 1"
				if(!player.isLinked()) player.link();
			},
			ai:{
				result:{
					target:-1,
					player:function(player){
						return player.isLinked()?0:-0.8;
					}
				},
				order:2,
				expose:0.3,
				effect:{
					target:function(card){
						if(card.name=='tiesuo'){
							return 0.5;
						}
					}
				}
			}
		},
		xiaoguo:{
			audio:2,
			trigger:{global:'phaseEnd'},
			check:function(event,player){
				return ai.get.damageEffect(event.player,player,player)>0;
			},
			filter:function(event,player){
				return event.player!=player&&player.num('h',{type:'basic'});
			},
			direct:true,
			content:function(){
				"step 0"
				var nono=(Math.abs(ai.get.attitude(player,trigger.player))<3);
				var next=player.chooseToDiscard('是否发动【骁果】？',{type:'basic'});
				next.ai=function(card){
					if(nono) return 0;
					if(ai.get.damageEffect(trigger.player,player,player)>0){
						return 8-ai.get.useful(card);
					}
					return 0;
				}
				next.logSkill=['xiaoguo',trigger.player];
				"step 1"
				if(result.bool){
					var nono=(ai.get.damageEffect(trigger.player,player,trigger.player)>=0);
					trigger.player.chooseToDiscard('he',{type:'equip'}).ai=function(card){
						if(nono){
							return 0;
						}
						if(trigger.player.hp==1) return 10-ai.get.value(card);
						return 9-ai.get.value(card);
					}
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.bool){
					player.draw();
				}
				else{
					trigger.player.damage();
				}
			},
			ai:{
				expose:0.3,
				threaten:1.3
			}
		},
		suishi:{
			trigger:{global:'dying'},
			forced:true,
			priority:6,
			filter:function(event,player){
				return event.player!=player;
			},
			content:function(){
				player.draw();
			},
			group:'suishi2'
		},
		suishi2:{
			trigger:{global:'dieAfter'},
			forced:true,
			check:function(){
				return false;
			},
			filter:function(event,player){
				return event.player!=player;
			},
			content:function(){
				player.loseHp();
			},
		},
		sijian:{
			trigger:{player:'loseEnd'},
			direct:true,
			audio:2,
			filter:function(event,player){
				if(player.num('h')) return false;
				for(var i=0;i<event.cards.length;i++){
					if(event.cards[i].original=='h') return true;
				}
				return false;
			},
			content:function(){
				"step 0"
				player.chooseTarget('是否发动【死谏】？',function(card,player,target){
					return player!=target&&target.num('he')>0;
				}).ai=function(target){
					return -ai.get.attitude(player,target);
				}
				"step 1"
				if(result.bool){
					player.logSkill('sijian');
					event.target=result.targets[0];
					player.discardPlayerCard(event.target,true);
				}
				else{
					event.finish();
				}
			},
			ai:{
				expose:0.2,
			}
		},
		quji:{
			enable:'phaseUse',
			usable:1,
			position:'he',
			filterCard:true,
			selectCard:function(){
				var player=_status.event.player;
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].hp<game.players[i].maxHp){
						num++;
					}
				}
				return [1,Math.min(num,player.maxHp-player.hp)];
			},
			filterTarget:function(card,player,target){
				return target.hp<target.maxHp;
			},
			filter:function(event,player){
				return player.hp<player.maxHp;
			},
			selectTarget:function(){
				return ui.selected.cards.length;
			},
			check:function(card){
				if(get.color(card)=='black') return -1;
				return 9-ai.get.value(card);
			},
			content:function(){
				"step 0"
				target.recover();
				"step 1"
				if(target==player){
					for(var i=0;i<cards.length;i++){
						if(get.color(cards[i])=='black'){
							player.loseHp();
							break;
						}
					}
				}
			},
			ai:{
				result:{
					target:1
				},
				order:6
			}
		},
		junbing2:{
			trigger:{player:'phaseEnd'},
			filter:function(event,player){
				if(player.skills.contains('junbing')||player.num('h')>1) return false;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].skills.contains('junbing')){
						return true;
					}
				}
				return false;
			},
			check:function(event,player){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].skills.contains('junbing')){
						var num=game.players[i].num('h');
						var att=ai.get.attitude(player,game.players[i]);
						if(num==0) return true;
						if(num==1) return att>-1;
						if(num==2) return att>0;
						return att>1;
					}
				}
				return false;
			},
			content:function(){
				"step 0"
				player.draw();
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].skills.contains('junbing')){
						event.target=game.players[i];break;
					}
				}
				"step 1"
				var cards=player.get('h');
				target.gain(cards);
				event.num=cards.length;
				player.$give(event.num,target);
				game.delay();
				"step 2"
				target.chooseCard('选择还给'+get.translation(player)+'的牌',true,event.num);
				if(target==game.me&&_status.auto) game.delay(0.2);
				"step 3"
				player.gain(result.cards);
				target.$give(result.cards.length,player);
				game.delay();
			}
		},
		junbing:{
			global:'junbing2',
			unique:true
		},
		xiongyi:{
			unique:true,
			enable:'phaseUse',
			audio:2,
			mark:true,
			filter:function(event,player){
				return !player.storage.xiongyi;
			},
			init:function(player){
				player.storage.xiongyi=false;
			},
			filterTarget:function(card,player,target){
				if(_status.auto||player!=game.me){
					if(ai.get.attitude(player,target)<=0) return false;
				}
				return player!=target;
			},
			multitarget:true,
			multiline:true,
			selectTarget:[0,2],
			content:function(){
				"step 0"
				player.storage.xiongyi=true;
				player.unmarkSkill('xiongyi');
				game.asyncDraw([player].concat(targets),3);
				"step 1"
				if(targets.length<=1){
					player.recover();
				}
			},
			intro:{
				content:'limited'
			},
			ai:{
				order:1,
				result:{
					player:function(player){
						var num=player.num('h');
						if(player.hp==1) return 1;
						if(player.hp==2&&num<=1) return 1;
						if(player.hp==3&&num==0) return 1;
						if(player.hp>=3&&num>=3) return -10;
						if(lib.config.mode=='identity'||lib.config.mode=='guozhan'){
							for(var i=0;i<game.players.length;i++){
								if(lib.config.mode=='identity'){
									if(game.players[i].ai.shown<=0) return -10;
								}
								else if(lib.config.mode=='guozhan'){
									if(game.players[i].identity=='unknown') return -10;
								}
							}
						}
						if(game.phaseNumber<game.players.length*2) return -10;
						return 1;
					},
					target:1
				}
			}
		},
		shushen:{
			audio:2,
			trigger:{player:'recoverAfter'},
			direct:true,
			content:function(){
				"step 0"
				player.chooseTarget('是否发动【淑慎】？',function(card,player,target){
					return target!=player;
				}).ai=function(target){
					return ai.get.attitude(player,target);
				}
				"step 1"
				if(result.bool){
					player.logSkill('shushen');
					event.target=result.targets[0];
					if(event.target.hp==event.target.maxHp){
						event.target.draw(2);
						event.finish();
					}
					else{
						event.target.chooseControl('draw_card','recover_hp',function(event,target){
							if(target.hp>=2||target.hp>=target.maxHp-1) return 'draw_card';
							if(target.hp==2&&target.num('h')==0) return 'draw_card';
							return 'recover_hp';
						});
					}
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.control=='draw_card'){
					target.draw(2);
				}
				else{
					target.recover();
				}
			},
			ai:{
				threaten:0.8,
				expose:0.1
			}
		},
		shenzhi:{
			audio:2,
			trigger:{player:'phaseBegin'},
			check:function(event,player){
				if(player.hp>2) return false;
				var cards=player.get('h');
				if(cards.length<player.hp) return false;
				if(cards.length>3) return false;
				for(var i=0;i<cards.length;i++){
					if(ai.get.value(cards[i])>7||get.tag(cards[i],'recover')>=1) return false;
				}
				return true;
			},
			filter:function(event,player){
				return player.num('h')>0;
			},
			content:function(){
				"step 0"
				var cards=player.get('h');
				event.bool=cards.length>=player.hp;
				player.discard(cards);
				"step 1"
				if(event.bool){
					player.recover();
				}
			}
		},
		wuji:{
			audio:2,
			trigger:{player:'phaseEnd'},
			forced:true,
			filter:function(event,player){
				return player.getStat('damage')>=3&&player.skills.contains('huxiao');
			},
			content:function(){
				"step 0"
				player.removeSkill('huxiao');
				player.gainMaxHp();
				"step 1"
				player.recover();
			}
		},
		xueji:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			filter:function(event,player){
				return player.hp<player.maxHp&&player.num('he',{color:'red'})>0;
			},
			filterTarget:function(card,player,target){
				return player!=target&&get.distance(player,target,'attack')<=1;
			},
			selectTarget:function(){
				return [1,_status.event.player.maxHp-_status.event.player.hp];
			},
			position:'he',
			filterCard:function(card){
				return get.color(card)=='red';
			},
			check:function(card){
				return 8-ai.get.useful(card);
			},
			content:function(){
				"step 0"
				target.damage();
				"step 1"
				target.draw();
			},
			ai:{
				order:7,
				result:{
					target:function(player,target){
						return ai.get.damageEffect(target,player);
					}
				},
				threaten:function(player,target){
					if(target.hp==1) return 2;
					if(target.hp==2) return 1.5;
					return 0.5;
				},
				maixie:true,
				effect:{
					target:function(card,player,target){
						if(get.tag(card,'damage')){
							if(target.hp==target.maxHp&&target.hasFriend()) return [0,1];
						}
						if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
					}
				}
			}
		},
		huxiao:{
			audio:2,
			trigger:{player:'shaMiss'},
			forced:true,
			content:function(){
				player.storage.huxiao++;
			},
			check:function(event,player){
				return player.num('h','sha')>0;
			},
			mod:{
				cardUsable:function(card,player,num){
					if(card.name=='sha') return num+player.storage.huxiao;
				}
			},
			group:'huxiao2'
		},
		huxiao2:{
			trigger:{player:'phaseUseBegin'},
			forced:true,
			popup:false,
			silent:true,
			content:function(){
				player.storage.huxiao=0;
			},
		},
		aocai:{
			audio:2,
			trigger:{player:'chooseToRespondBegin'},
			frequent:true,
			filter:function(event,player){
				if(event.responded) return false;
				return _status.currentPhase!==player;
			},
			content:function(){
				"step 0"
				var cards=[];
				if(ui.cardPile.childNodes.length<2){
					var discardcards=get.cards(2);
					for(var i=0;i<discardcards.length;i++){
						ui.discardPile.appendChild(discardcards[i]);
					}
				}
				for(var i=0;i<2;i++){
					cards.push(ui.cardPile.childNodes[i]);
				}
				player.chooseCardButton('傲才：选择一张卡牌打出',cards).filterButton=function(button){
					return get.type(button.link)=='basic'&&trigger.filterCard(button.link);
				}
				"step 1"
				if(result.bool){
					game.log(player,'傲才发动成功');
					trigger.untrigger();
					trigger.responded=true;
					result.buttons[0].link.remove();
					trigger.result={bool:true,card:result.buttons[0].link}
				}
			},
			ai:{
				effect:{
					target:function(card,player,target,effect){
						if(get.tag(card,'respondShan')) return 0.7;
						if(get.tag(card,'respondSha')) return 0.7;
					}
				}
			},
			group:'aocai2',
		},
		aocai2:{
			enable:'chooseToUse',
			direct:true,
			filter:function(event,player){
				return _status.currentPhase!==player&&
				event.parent.name!='_wuxie1'&&event.parent.name!='_wuxie2'&&
				event.parent.name!='_chenhuodajie';
			},
			delay:0,
			content:function(){
				"step 0"
				var cards=[];
				if(ui.cardPile.childNodes.length<2){
					var discardcards=get.cards(2);
					for(var i=0;i<discardcards.length;i++){
						ui.discardPile.appendChild(discardcards[i]);
					}
				}
				for(var i=0;i<2;i++){
					cards.push(ui.cardPile.childNodes[i]);
				}
				var dialog=ui.create.dialog('傲才：选择一张卡牌使用',cards);
				var trigger=event.parent.parent;
				player.chooseButton(dialog,function(){return 1}).filterButton=function(button){
					return get.type(button.link)=='basic'&&trigger.filterCard(button.link,player,trigger);
				};
				player.addTempSkill('aocai4',['useCardAfter','phaseAfter']);
				player.popup('aocai');
				"step 1"
				if(result.bool){
					game.log(player,'发动了傲才')
					lib.skill.aocai3.viewAs=result.buttons[0].link;
					event.parent.parent.backup('aocai3');
					event.parent.parent.step=0;
					if(event.isMine()){
						event.parent.parent.openskilldialog='选择'+get.translation(result.buttons[0].link)+'的目标';
					}
				}
				else{
					event.parent.parent.step=0;
				}
			},
			ai:{
				order:11,
				save:true,
				result:{
					player:function(player){
						if(player.tempSkills.aocai4) return 0;
						if(_status.dying) return ai.get.attitude(player,_status.dying);
						return 1;
					}
				}
			}
		},
		aocai3:{
			filterCard:function(){return false},
			selectCard:-1
		},
		aocai4:{},
		hongyuan:{
			trigger:{player:'phaseDrawBegin'},
			direct:true,
			audio:2,
			content:function(){
				"step 0"
				var check;
				if(player.num('h')==0){
					check=false;
				}
				else{
					var i,num=0;
					for(i=0;i<game.players.length;i++){
						if(player!=game.players[i]){
							if(ai.get.attitude(player,game.players[i])>1){
								num++;
							}
						}
					}
					check=(num>=2);
				}
				player.chooseTarget('是否发动【弘援】？',[1,2],function(card,player,target){
					return player!=target;
				},
				function(target){
					if(!check) return 0;
					return ai.get.attitude(_status.event.player,target);
				});
				"step 1"
				if(result.bool){
					player.logSkill('hongyuan',result.targets);
					// for(var i=0;i<result.targets.length;i++){
					// 	result.targets[i].draw();
					// }
					game.asyncDraw(result.targets);
					trigger.num--;
				}
			},
		},
		huanshi:{
			audio:2,
			trigger:{global:'judge'},
			filter:function(event,player){
				return player.num('he')>0;
			},
			check:function(event,player){
				if(ai.get.attitude(player,event.player)<=0) return false;
				var cards=player.get('he');
				var judge=event.judge(event.player.judging[0]);
				for(var i=0;i<cards.length;i++){
					// console.log(event.judge(cards[i]),judge,ai.get.useful(cards[i]));
					var judge2=event.judge(cards[i]);
					if(_status.currentPhase!=player&&judge2==judge&&get.color(cards[i])=='red'&&ai.get.useful(cards[i])<5) return true;
					if(judge2>judge) return true;
				}
				return false;
			},
			content:function(){
				"step 0"
				var target=trigger.player;
				var judge=trigger.judge(target.judging[0]);
				var attitude=ai.get.attitude(target,player);
				target.choosePlayerCard('请选择代替判定的牌','he','visible',true,player).ai=function(button){
					var card=button.link;
					var result=trigger.judge(card)-judge;
					if(result>0){
						return 20+result;
					}
					if(result==0){
						if(_status.currentPhase==player) return 0;
						if(attitude>=0){
							return get.color(card)=='red'?7:0-ai.get.value(card);
						}
						else{
							return get.color(card)=='black'?10:0+ai.get.value(card);
						}
					}
					if(attitude>=0){
						return get.color(card)=='red'?0:-10+result;
					}
					else{
						return get.color(card)=='black'?0:-10+result;
					}
				};
				"step 1"
				if(result.bool){
					event.card=result.buttons[0].link;
					player.respond(event.card,'highlight');
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.bool){
					if(trigger.player.judging[0].clone){
						trigger.player.judging[0].clone.delete();
						game.addVideo('deletenode',player,get.cardsInfo([trigger.player.judging[[0]].clone]));
					}
					ui.discardPile.appendChild(trigger.player.judging[0]);
					trigger.player.judging[0]=event.card;
					game.delay(2);
				}
			},
			ai:{
				tag:{
					rejudge:1,
				}
			}
		},
		mingzhe:{
			audio:2,
			trigger:{player:['useCardAfter','respondAfter','discardAfter']},
			frequent:true,
			filter:function(event,player){
				if(player==_status.currentPhase) return false;
				if(event.cards){
					for(var i=0;i<event.cards.length;i++){
						if(get.color(event.cards[i])=='red'&&
						event.cards[i].original!='j') return true;
					}
				}
				return false;
			},
			content:function(){
				player.draw();
			},
			ai:{
				threaten:0.7
			}
		},
		duwu:{
			audio:2,
			enable:'phaseUse',
			filter:function(event,player){
				return player.skills.contains('duwu2')==false;
			},
			filterCard:true,
			position:'he',
			selectCard:[1,Infinity],
			filterTarget:function(card,player,target){
				return get.distance(player,target,'attack')<=1&&ui.selected.cards.length==target.hp;
			},
			check:function(card){
				switch(ui.selected.cards.length){
					case 0:return 7-ai.get.value(card);
					case 1:return 6-ai.get.value(card);
					case 2:return 3-ai.get.value(card);
					default:return 0;
				}
			},
			content:function(){
				"step 0"
				target.damage();
				if(target.hp>1){
					event.finish();
				}
				"step 1"
				player.addSkill('duwu2');
				player.loseHp();
			},
			ai:{
				order:2,
				result:{
					target:function(player,target){
						return ai.get.damageEffect(target,player);
					}
				},
				threaten:1.5,
				expose:0.3
			}
		},
		duwu2:{
			trigger:{player:'phaseBegin'},
			forced:true,
			popup:false,
			audio:false,
			content:function(){
				player.removeSkill('duwu2');
			}
		},
		yicong:{
			mod:{
				globalFrom:function(from,to,current){
					if(from.hp>2) return current-1;
				},
				globalTo:function(from,to,current){
					if(to.hp<=2) return current+1;
				},
			},
			ai:{
				threaten:0.8
			}
		},
		yongsi:{
			group:['yongsi1','yongsi2'],
			ai:{
				threaten:2.2
			}
		},
		yongsi1:{
			audio:2,
			trigger:{player:'phaseDrawBegin'},
			forced:true,
			content:function(){
				var list=['wei','shu','wu','qun'],num=0;
				for(var i=0;i<game.players.length&&list.length;i++){
					if(list.contains(game.players[i].group)){
						list.remove(game.players[i].group);
						num++;
					}
				}
				trigger.num+=num;
			}
		},
		yongsi2:{
			audio:2,
			trigger:{player:'phaseDiscardBegin'},
			forced:true,
			content:function(){
				var list=['wei','shu','wu','qun'],num=0;
				for(var i=0;i<game.players.length&&list.length;i++){
					if(list.contains(game.players[i].group)){
						list.remove(game.players[i].group);
						num++;
					}
				}
				player.chooseToDiscard(num,'he',true);
			}
		},
		bifa:{
			trigger:{player:'phaseEnd'},
			direct:true,
			audio:2,
			filter:function(event,player){
				return player.num('h')>0;
			},
			content:function(){
				"step 0"
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].storage.bifa){
						game.players[i].addSkill('bifa2');
					}
				}
				player.chooseCardTarget({
					filterCard:true,
					filterTarget:function(card,player,target){
						return player!=target&&!target.storage.bifa;
					},
					ai1:function(card){
						return 7-ai.get.value(card);
					},
					ai2:function(target){
						var num=target.hasSkillTag('maixie')?2:0;
						return -ai.get.attitude(_status.event.player,target)-num;
					},
					prompt:'是否发动笔伐？'
				});
				"step 1"
				if(result.bool){
					player.logSkill('bifa',result.targets[0]);
					result.targets[0].addSkill('bifa2');
					result.targets[0].storage.bifa=[result.cards[0],player];
					player.lose(result.cards[0],result.targets[0].node.special);
					player.$give(1,result.targets[0]);
				}
			},
			ai:{
				threaten:1.7,
				expose:0.3
			}
		},
		bifa2:{
			trigger:{player:'phaseBegin'},
			forced:true,
			mark:true,
			audio:false,
			content:function(){
				"step 0"
				if(player.storage.bifa[1].isAlive()){
					player.chooseCard(get.translation(player.storage.bifa[1])+
						'的笔伐牌为'+get.translation(player.storage.bifa[0]),function(card){
						if(get.type(card)=='trick'||get.type(card)=='delay'){
							return get.type(player.storage.bifa[0])=='trick'||
							get.type(player.storage.bifa[0])=='delay'
						}
						else{
							return get.type(card)==get.type(player.storage.bifa[0]);
						}
					}).ai=function(card){
						return 8-ai.get.value(card);
					};
				}
				else{
					event.directfalse=true;
				}
				"step 1"
				if(result.bool&&!event.directfalse){
					player.storage.bifa[1].gain(result.cards);
					player.$give(result.cards,player.storage.bifa[1]);
					player.gain(player.storage.bifa[0],'draw2');
				}
				else{
					ui.discardPile.appendChild(player.storage.bifa[0]);
					game.log(player.storage.bifa[0],'进入弃牌堆');
					player.$throw(player.storage.bifa[0]);
					player.loseHp();
				}
				player.removeSkill('bifa2');
				delete player.storage.bifa;
			},
			intro:{
				name:'笔伐',
				content:'已成为笔伐目标'
			}
		},
		songci:{
			audio:2,
			enable:'phaseUse',
			filter:function(){
				for(var i=0;i<game.players.length;i++){
					if(!game.players[i].storage.songci) return true;
				}
				return false;
			},
			init:function(player){
				player.storage.songci=false;
			},
			filterTarget:function(card,player,target){
				return (!target.storage.songci&&target.num('h')!=target.hp);
			},
			content:function(){
				if(target.num('h')>target.hp){
					target.chooseToDiscard(2,'he',true);
				}
				else{
					target.draw(2);
				}
				target.storage.songci=true;
				target.mark('songci',{
					name:'颂词',
					content:'已发动'
				});
				game.addVideo('mark',target,{
					name:'颂词',
					content:'已发动',
					id:'songci'
				});
			},
			ai:{
				order:7,
				threaten:1.5,
				expose:0.2,
				result:{
					target:function(player,target){
						if(target.num('h')<target.hp){
							if(target.num('h')<=2) return 1;
						}
						else if(target.num('h')>target.hp){
							if(target.num('h')<=3) return -1;
						}
					}
				}
			}
		},
		baobian:{
			trigger:{player:['phaseBefore','changeHp']},
			forced:true,
			popup:false,
			unique:true,
			content:function(){
				if(!player.storage.baobian){
					player.storage.baobian=[];
					if(player.skills.contains('tiaoxin')){
						player.storage.baobian.push('tiaoxin');
					}
					if(player.skills.contains('paoxiao')){
						player.storage.baobian.push('paoxiao');
					}
					if(player.skills.contains('shensu')){
						player.storage.baobian.push('shensu');
					}
				}
				if(player.storage.baobian.contains('tiaoxin')==false){
					player.removeSkill('tiaoxin');
				}
				if(player.storage.baobian.contains('paoxiao')==false){
					player.removeSkill('paoxiao');
				}
				if(player.storage.baobian.contains('shensu')==false){
					player.removeSkill('shensu');
				}
				if(player.hp<=3){
					player.addSkill('tiaoxin');
				}
				if(player.hp<=2){
					player.addSkill('paoxiao');
				}
				if(player.hp==1){
					player.addSkill('shensu');
				}
			},
			ai:{
				maixie:true,
				effect:{
					target:function(card,player,target){
						if(get.tag(card,'damage')){
							if(!target.hasFriend()) return;
							if(target.hp>=4) return [0,1];
						}
						if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
					}
				}
			}
		},
		chongzhen:{
			group:['chongzhen1','chongzhen2'],
			ai:{
				mingzhi:false,
				effect:{
					target:function(card,player,target,current){
						if(get.tag(card,'respondShan')||get.tag(card,'respondSha')){
							if(ai.get.attitude(target,player)<=0){
								if(current>0) return;
								if(target.num('h')==0) return 1.6;
								if(target.num('h')==1) return 1.2;
								if(target.num('h')==2) return [0.8,0.2,0,-0.2];
								return [0.4,0.7,0,-0.7];
							}
						}
					},
				},
			}
		},
		chongzhen1:{
			audio:2,
			trigger:{player:'shaBefore'},
			filter:function(event,player){
				if(event.skill!='longdan_sha') return false;
				return event.target.num('h')>0;
			},
			content:function(){
				player.gain(trigger.target.get('h').randomGet());
				trigger.target.$give(1,player);
				game.delay();
			}
		},
		chongzhen2:{
			audio:2,
			trigger:{player:'respond'},
			filter:function(event,player){
				if(event.skill!='longdan_shan'&&event.skill!='longdan_sha') return false;
				return event.source&&event.source.num('h')>0;
			},
			content:function(){
				player.gain(trigger.source.get('h').randomGet());
				trigger.source.$give(1,player);
				game.delay();
			}
		},
		lihun:{
			audio:2,
			enable:'phaseUse',
			usable:1,
			filterTarget:function(card,player,target){
				return player!=target&&target.sex=='male';
			},
			filterCard:true,
			position:'he',
			content:function(){
				player.gain(target.get('h'));
				target.$give(target.num('h'),player);
				player.turnOver();
				player.addSkill('lihun2');
				player.storage.lihun=target;
			},
			check:function(card){return 8-ai.get.value(card)},
			ai:{
				order:10,
				result:{
					player:function(player){
						if(player.classList.contains('turnedover')) return 10;
						return 0;
					},
					target:function(player,target){
						if(target.num('h')>target.hp) return target.hp-target.num('h');
						return 0;
					}
				},
				threaten:1.5,
				effect:{
					target:function(card){
						if(card.name=='guiyoujie') return [0,2];
					}
				}
			},
		},
		lihun2:{
			trigger:{player:'phaseUseEnd'},
			forced:true,
			popup:false,
			audio:false,
			content:function(){
				"step 0"
				player.removeSkill('lihun2');
				if(player.storage.lihun.classList.contains('dead')){
					event.finish();
				}
				else{
					player.chooseCard('he',true,player.storage.lihun.hp);
				}
				"step 1"
				player.storage.lihun.gain(result.cards);
				player.$give(result.cards.length,player.storage.lihun);
			}
		},
		yuanhu:{
			audio:3,
			trigger:{player:'phaseEnd'},
			direct:true,
			filter:function(event,player){
				return player.num('he',{type:'equip'})>0;
			},
			content:function(){
				"step 0"
				player.chooseCardTarget({
					filterCard:function(card){
						return get.type(card)=='equip';
					},
					position:'he',
					filterTarget:function(card,player,target){
						return !target.get('e',get.subtype(card)[5]);
					},
					ai1:function(card){
						return 6-ai.get.value(card);
					},
					ai2:function(target){
						return ai.get.attitude(player,target)-3;
					},
					prompt:'是否发动援护？'
				});
				"step 1"
				if(result.bool){
					player.logSkill('yuanhu',result.targets);
					var thisTarget=result.targets[0];
					var thisCard=result.cards[0];
					thisTarget.equip(thisCard);
					event.target=thisTarget;
					if(thisTarget!=player){
						player.$give(thisCard,thisTarget);
					}
					switch(get.subtype(thisCard)){
						case 'equip1':
						for(var i=0;i<game.players.length;i++){
							if(get.distance(thisTarget,game.players[i])==1) break;
						}
						if(i==game.players.length) return;
						game.delay();
						player.chooseTarget(true,function(card,player,target){
							return get.distance(thisTarget,target)==1&&target.num('hej');
						}).ai=function(target){
							var attitude=ai.get.attitude(player,target);
							if(attitude>0&&target.num('j')){
								return attitude;
							}
							return -attitude;
						};return;
						case 'equip2':thisTarget.draw();event.finish();return;
						default:thisTarget.recover();event.finish();return;
					}
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.targets.length){
					player.discardPlayerCard(true,result.targets[0],'hej');
				}
			},
			ai:{
				threaten:1.2
			}
		},
		tianming:{
			audio:true,
			trigger:{target:'shaBegin'},
			check:function(event,player){
				var cards=player.get('h');
				if(cards.length<=2){
					for(var i=0;i<cards.length;i++){
						if(cards[i].name=='shan'||cards[i].name=='tao') return false;
					}
				}
				return true;
			},
			content:function(){
				"step 0"
				player.chooseToDiscard(2,true,'he');
				player.draw(2);
				var players=game.players.slice(0);
				players.sort(function(a,b){
					return b.hp-a.hp;
				});
				if(players[0].hp>players[1].hp&&players[0]!=player){
					players[0].chooseBool('是否发动天命？');
					event.player=players[0];
				}
				else{
					event.finish();
				}
				"step 1"
				if(result.bool){
					player.chooseToDiscard(2,true,'he');
					player.draw(2);
				}
			},
			ai:{
				effect:{
					target:function(card,player,target,current){
						if(card.name=='sha') return [1,0.5];
					}
				}
			}
		},
		mizhao:{
			enable:'phaseUse',
			usable:1,
			audio:2,
			filter:function(event,player){
				return player.num('h')>0;
			},
			filterCard:true,
			selectCard:-1,
			filterTarget:function(card,player,target){
				return player!=target;
			},
			discard:false,
			prepare:function(cards,player,targets){
				player.$give(cards.length,targets[0]);
				player.line(targets[0]);
			},
			ai:{
				order:1,
				result:{
					player:0,
					target:function(player,target){
						if(player.num('h')>1){
							return 1;
						}
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].num('h')&&game.players[i]!=target&&game.players[i]!=player&&ai.get.attitude(player,game.players[i])<0){
								break;
							}
						}
						if(i==game.players.length){
							return 1;
						}
						return -2/(target.num('h')+1);
					}
				}
			},
			content:function(){
				"step 0"
				event.target1=targets[0];
				targets[0].gain(cards);
				game.delay();
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].num('h')&&game.players[i]!=event.target1&&game.players[i]!=player){
						break;
					}
				}
				if(i==game.players.length){
					event.finish();
				}
				"step 1"
				player.chooseTarget(true,'选择拼点目标',function(card,player,target){
					return target.num('h')&&target!=event.target1&&target!=player;
				}).ai=function(target){
					var eff=ai.get.effect(target,{name:'sha'},event.target1,player);
					var att=ai.get.attitude(player,target);
					if(att>0){
						return eff-10;
					}
					return eff;
				};
				"step 2"
				if(result.targets.length){
					event.target2=result.targets[0];
					event.target1.line(event.target2);
					event.target1.chooseToCompare(event.target2);
				}
				else{
					event.finish();
				}
				"step 3"
				if(result.bool){
					event.target1.useCard({name:'sha'},event.target2);
				}
				else{
					event.target2.useCard({name:'sha'},event.target1);
				}
			}
		},
		gongao:{
			audio:2,
			trigger:{global:'dieAfter'},
			forced:true,
			unique:true,
			content:function(){
				player.gainMaxHp();
				player.recover();
			},
			ai:{
				threaten:1.5
			}
		},
		juyi:{
			audio:true,
			trigger:{player:'phaseBegin'},
			filter:function(event,player){
				return player.maxHp>game.players.length&&player.hp<player.maxHp&&!player.storage.juyi;
			},
			forced:true,
			unique:true,
			content:function(){
				var num=player.maxHp-player.num('h');
				if(num>0){
					player.draw(num);
				}
				player.addSkill('benghuai');
				player.addSkill('weizhong');
				player.storage.juyi=true;
			}
		},
		weizhong:{
			audio:true,
			trigger:{player:['gainMaxHpEnd','loseMaxHpEnd']},
			forced:true,
			content:function(){
				player.draw();
			}
		},
		chixin:{
			group:['chixin1','chixin2'],
			mod:{
				cardUsable:function(card,player,num){
					if(card.name=='sha'){
						return num+20;
					}
				},
			},
			trigger:{player:'shaBefore'},
			forced:true,
			popup:false,
			check:function(event,player){
				return player.num('h','sha')>0;
			},
			filter:function(event,player){
				return _status.currentPhase==player;
			},
			content:function(){
				var target=trigger.target;
				if(target.skills.contains('chixin3')){
					target.storage.chixin++;
				}
				else{
					target.storage.chixin=1;
					target.addTempSkill('chixin3','phaseUseEnd');
				}
			}
		},
		chixin1:{
			enable:['chooseToRespond','chooseToUse'],
			filterCard:{suit:'diamond'},
			position:'he',
			viewAs:{name:'sha'},
			prompt:'将一张♦牌当杀使用或打出',
			check:function(card){return 5-ai.get.value(card)},
			ai:{
				respondSha:true,
			}
		},
		chixin2:{
			enable:['chooseToRespond'],
			filterCard:{suit:'diamond'},
			viewAs:{name:'shan'},
			position:'he',
			prompt:'将一张♦牌当闪打出',
			check:function(card){return 5-ai.get.value(card)},
			ai:{
				respondShan:true,
				effect:{
					target:function(card,player,target,current){
						if(get.tag(card,'respondShan')&&current<0) return 0.8
					}
				},
			}
		},
		chixin3:{
			mod:{
				targetEnabled:function(card,player,target){
					if(card.name!='sha') return;
					if(player==_status.currentPhase&&player.get('s').contains('chixin')){
						var num=game.checkMod(card,player,1,'cardUsable',player.get('s'))-20;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].skills.contains('chixin3')){
								num+=1-game.players[i].storage.chixin;
							}
						}
						return num>1;
					}
				}
			}
		},
		suiren:{
			trigger:{player:'phaseBegin'},
			check:function(event,player){
				return player.hp==1||(player.hp==2&&player.num('h')<=1);
			},
			filter:function(event,player){
				return !player.storage.suiren;
			},
			intro:{
				content:'limited',
			},
			mark:true,
			direct:true,
			unique:true,
			content:function(){
				"step 0"
				var check=(player.hp==1||(player.hp==2&&player.num('h')<=1));
				player.chooseTarget('是否发动【随仁】？').ai=function(target){
					if(!check) return 0;
					return ai.get.attitude(player,target);
				}
				"step 1"
				if(result.bool){
					player.storage.suiren=true;
					player.unmarkSkill('suiren');
					player.logSkill('suiren',result.targets);
					player.removeSkill('yicong');
					player.gainMaxHp();
					player.recover();
					result.targets[0].draw(3);
				}
			}
		}
	},
	translate:{
		chenlin:'陈琳',
		yuanshu:'袁术',
		re_yuanshu:'新袁术',
		gongsunzan:'公孙瓒',
		sp_diaochan:'sp貂蝉',
		yangxiu:'杨修',
		sp_zhaoyun:'sp赵云',
		jsp_zhaoyun:'界sp赵云',
		caohong:'曹洪',
		liuxie:'刘协',
		xiahouba:'夏侯霸',
		zhugejin:'诸葛谨',
		zhugeke:'诸葛恪',
		guanyinping:'关银屏',
		ganfuren:'甘夫人',
		sunhao:'孙皓',
		chengyu:'程昱',
		simalang:'司马朗',
		zhangliang:'张梁',
		tianfeng:'田丰',
		sp_pangtong:'sp庞统',
		maliang:'马良',
		sp_caoren:'sp曹仁',
		yuejin:'乐进',
		mifuren:'糜夫人',
		sp_dongzhuo:'sp董卓',
		chendong:'陈武董袭',
		jiangfei:'蒋琬费祎',
		jiangqing:'蒋钦',
		hetaihou:'何太后',
		dingfeng:'丁奉',
		zhangxingcai:'张星彩',
		caoang:'曹昂',
		kongrong:'孔融',
		fuwan:'伏完',
		sp_pangde:'庞德',
		sp_sunshangxiang:'孙尚香',
		zhugedan:'诸葛诞',
		sp_machao:'sp马超',
		sp_jiangwei:'sp姜维',
		zhangbao:'张宝',
		yangxiou:'杨修',
		shixie:'士燮',
		mayunlu:'马云騄',
		zhanglu:'张鲁',
		wutugu:'兀突骨',
		mateng:'马腾',
		sp_caiwenji:'sp蔡文姬',
		zhugeguo:'诸葛果',
		liuzan:'留赞',
		lingcao:'凌操',
		sunru:'孙茹',
		lingju:'灵雎',
		lifeng:'李丰',

		tunchu:'屯储',
		tunchu_info:'摸牌阶段摸牌时，你可以额外摸两张牌，若如此做，将一张手牌置于你的武将上，称为“粮”，只要你的武将牌上有“粮”，你便不能使用【杀】和【决斗】',
		shuliang:'输粮',
		shuliang_info:'每当一名角色的结束阶段开始时，若其没有手牌，你可以将一张“粮”置入弃牌堆，然后该角色摸两张牌',
		jieyuan:'竭缘',
		jieyuan_more:'竭缘',
		jieyuan_less:'竭缘',
		jieyuan_info:'当你对一名其他角色造成伤害时，若其体力值大于或等于你的体力值，你可弃置一张黑色手牌令此伤害+1；当你受到一名其他角色造成的伤害时，若其体力值大于或等于你的体力值，你可弃置一张红色手牌令此伤害-1。',
		fenxin:'焚心',
		fenxin_info:'限定技，当你杀死一名非主公角色时，在其翻开身份牌之前，你可以与该角色交换身份牌。（你的身份为主公时不能发动此技能）',
		shixin:'释衅',
		shixin_info:'锁定技，当你受到火属性伤害时，你防止此伤害',
		qingyi:'轻逸',
		qingyi_info:'你可以跳过摸牌阶段，或跳过出牌阶段并弃置一张装备牌，若如此则视为对任意一名使用一张【杀】',
		dujin:'独进',
		dujin_info:'摸牌阶段，你可以额外摸X+1张牌（X为你装备区里牌数的一半且向下取整）',
		yuhua:'羽化',
		yuhua_info:'锁定技，弃牌阶段内，你的非基本牌不计入手牌数，且你不能弃置你的非基本牌',
		qirang:'祈禳',
		qirang_info:'当有装备牌进入你的装备区时，你可以获得牌堆中的一张锦囊牌',
		biluan:'避乱',
		biluan_info:'摸牌阶段开始时，若有其他角色与你距离不大于1，则你可以放弃摸牌。若如此做，其他角色与你距离+X（X为势力数）',
		lixia:'礼下',
		lixia_info:'锁定技，其他角色结束阶段开始时，若你不在其攻击范围内，你摸一张牌或令其摸一张牌。若如此做，其他角色与你的距离-1',
		yishe:'义舍',
		yishe_bg:'米',
		yishe_info:'结束阶段开始时，若你的武将牌上没有牌，你可以摸两张牌。若如此做，你将两张牌置于武将牌上，称为“米”；当“米”移至其他区域后，若你的武将牌上没有“米”，你回复1点体力',
		bushi:'布施',
		midao:'米道',
		bushi_info:'当你受到1点伤害后，或其他角色受到你造成的1点伤害后，受到伤害的角色可以获得一张“米”',
		midao_info:'当一张判定牌生效前，你可以打出一张“米”代替之',
		fengpo:'凤魄',
		fengpo_info:'当你于出牌阶段内使用第一张【杀】或【决斗】指定目标后，若目标角色数为1，你可以选择一项：1.摸X张牌；2.此牌造成的伤害+X（X为其手牌中方牌的数量）',
		chenqing:'陈情',
		chenqing_info:'每轮限一次，当一名角色处于濒死状态时，你可以令另一名其他角色摸四张牌，然后弃置四张牌。若其以此法弃置的四张牌花色各不相同，则视为该角色对濒死的角色使用一张【桃】',
		mozhi:'默识',
		mozhi_info:'结束阶段开始时，你可以将一张手牌当你本回合出牌阶段使用的第一张基本或非延时类锦囊牌使用。然后，你可以将一张手牌当你本回合出牌阶段使用的第二张基本或非延时类锦囊牌使用',
		ranshang:'燃殇',
		ranshang2:'燃殇',
		ranshang_info:'锁定技，当你受到1点火焰伤害后，你获得1枚“燃”标记；结束阶段开始时，你失去X点体力（X为“燃”标记的数量）',
		hanyong:'悍勇',
		hanyong_info:'当你使用【南蛮入侵】或【万箭齐发】时，若你的体力值小于游戏轮数，你可以令此牌造成的伤害+1',

		yicong:'义从',
		yongsi:'庸肆',
		yongsi1:'庸肆',
		yongsi2:'庸肆',
		bifa:'笔伐',
		bifa2:'笔伐',
		songci:'颂词',
		baobian:'豹变',
		lihun:'离魂',
		chongzhen:'冲阵',
		chongzhen1:'冲阵',
		chongzhen2:'冲阵',
		yuanhu:'援护',
		tianming:'天命',
		mizhao:'密诏',
		duwu:'黩武',
		mingzhe:'明哲',
		huanshi:'缓释',
		hongyuan:'弘援',
		aocai:'傲才',
		aocai2:'傲才',
		aocai3:'傲才',
		huxiao:'虎啸',
		xueji:'血祭',
		wuji:'武继',
		shushen:'淑慎',
		shenzhi:'神智',
		xiongyi:'雄异',
		shefu:'设伏',
		junbing:'郡兵',
		junbing2:'郡兵',
		quji:'去疾',
		sijian:'死谏',
		suishi:'随势',
		suishi2:'随势',
		xiaoguo:'骁果',
		duanxie:'断绁',
		fenming:'奋命',
		guixiu:'闺秀',
		cunsi:'存嗣',
		yongjue:'勇决',
		hengzheng:'横征',
		shengxi:'生息',
		shoucheng:'守成',
		shangyi:'尚义',
		zhendu:'鸩毒',
		qiluan:'戚乱',
		qiluan2:'戚乱',
		qiluan3:'戚乱',
		shenxian:'甚贤',
		qiangwu:'枪舞',
		moukui:'谋溃',
		moukui2:'谋溃',
		lirang:'礼让',
		mingshi:'名士',
		liangzhu:'良助',
		kaikang:'慷忾',
		wangzun:'妄尊',
		tongji:'同疾',
		kuiwei:'溃围',
		kuiwei2:'溃围',
		yanzheng:'严整',
		zhoufu:'咒缚',
		zhoufu2:'咒缚',
		zhoufu3:'咒缚',
		yingbin:'影兵',
		fenxun:'奋迅',
		spmengjin:'猛进',
		xiemu:'协穆',
		naman:'纳蛮',
		zuixiang:'醉乡',
		manjuan:'漫卷',
		taichen:'抬榇',
		jilei:'鸡肋',
		jilei2:'鸡肋',
		fulu:'符箓',
		fuji:'助祭',
		fenyin:'奋音',
		fenyin_info:'你的回合内，当你使用牌时，若此牌与你于此回合内使用的上一张牌颜色不同，则你可以摸一张牌',
		fuji_info:'当一名角色造成雷电伤害时，你可以令其进行一次判定，若结果为黑色，此伤害+1；若结果为红色，该角色获得此牌。',
		fulu_info:'你可以将【杀】当雷【杀】使用。',
		jilei_info:'每当你受到一次伤害，可以令伤害来源不能使用或打出其手牌直到回合结束',
		danlao:'啖酪',
		danlao_info:'当你成为一张指定了多个目标的锦囊牌的目标时，你可以取消之，并摸一张牌。',
		gongao:'功獒',
		zhuiji:'追击',
		chouhai:'仇海',
		chouhai_info:'锁定技，当你每次受到伤害时，若你没有手牌，此伤害+1。',
		guiming:'归命',
		guiming_info:'主公技，其他吴势力角色于你的回合内视为已受伤的角色。',
		chixin:'赤心',
		chixin1:'赤心',
		chixin2:'赤心',
		chixin_info:'你可以将♦牌当【杀】或【闪】使用或打出。出牌阶段，你对你攻击范围内的每名角色均可使用一张【杀】。',
		suiren:'随仁',
		suiren_info:'限定技，准备阶段开始时，你可以失去技能“义从”，然后加1点体力上限并回复1点体力，再令一名角色摸三张牌。',
		canshi:'残蚀',
		canshi2:'残蚀',
		canshi_info:'摸牌阶段开始时，你可以放弃摸牌，改为摸x张牌（x为已受伤的角色数），若如此做，当你与此回合内使用基本牌或锦囊牌时，你弃置一张牌。',
		zhuiji_info:'锁定技，你与体力值低于你的角色距离为1。',
		kunfen:'困奋',
		kunfen_info:'锁定技，回合结束阶段开始时，你失去１点体力，然后摸两张牌',
		fengliang:'逢亮',
		fengliang_info:'觉醒技，当你进入濒死状态时，你减１点体力上限并将体力值回复至２点，然后获得技能挑衅，将困奋改为非锁定技',
		cihuai:'刺槐',
		cihuai_info:'出牌阶段开始时，若你手牌中没有杀，你可以展示你的手牌，视为对一名角色使用一张杀',
		gongao_info:'锁定技，每当一名角色死亡后，你增加一点体力上限，回复一点体力。',
		juyi:'举义',
		juyi_info:'觉醒技，准备阶段开始时，若你已受伤且体力上限大于存活角色数，你须将手牌摸至体力上限，然后获得技能“崩坏”和“威重”。',
		weizhong:'威重',
		weizhong_info:'锁定技，每当你的体力上限增加或减少时，你摸一张牌。',
		taichen_info:'出牌阶段限一次，你可以自减一点体力，视为对一名角色使用一张杀（不计入回合内出杀限制）',
		manjuan_info:'其他角色的卡牌因弃置而进入弃牌堆后，你可以弃置一张花色与之不同的牌，然后获得之',
		zuixiang_info:'限定技，回合开始阶段开始时，你可以展示牌库顶的3张牌并置于你的武将牌上，你不可使用或打出与该些牌同类的牌，所有同类牌对你无效。之后每个你的回合开始阶段，你须重复展示一次，直至该些牌中任意两张点数相同时，将你武将牌上的全部牌置于你的手上。',
		naman_info:'你可以获得其他角色打出的杀',
		xiemu_info:'每当你成为其他角色的黑色牌的目标，可以弃置一张杀并摸两张牌',
		spmengjin_info:'每当你使用一张杀，可以弃置目标一张牌',
		fenxun_info:'每当你使用杀且仅指定了一个目标，你可以弃置一张牌并额外指定一个无视距离的目标',
		yingbin_info:'受到“咒缚”技能影响的角色进行判定时，你可以摸两张牌。',
		zhoufu_info:'出牌阶段限一次，你可以指定一名其他角色并将一张手牌移出游戏(将此牌置于该角色的武将牌旁)。若如此做，该角色进行判定时，改为将此牌作为判定牌。该角色的回合结束时，若此牌仍在该角色旁，你将此牌收入手牌。',
		yanzheng_info:'若你的手牌数大于你的体力值，你可以将你装备区内的牌当【无懈可击】使用',
		kuiwei_info:'回合结束阶段开始时，你可以摸2+X张牌，然后将你的武将牌翻面。在你的下个摸牌阶段开始时，你须弃置X张牌。（X等于当时场上装备区内的武器牌的数量）',
		tongji_info:'锁定技。若你的手牌数大于你的体力值，则只要你在任一其他角色的攻击范围内，该角色使用【杀】时便不能指定你以外的角色为目标',
		wangzun_info:'其他角色的回合开始时，你可以摸一张牌，然后令该角色此回合的手牌上限-1；直到你的回合开始，你不能再次发动此技',
		kaikang_info:'每当你距离1以内的角色成为杀的目标后，你可以摸一张牌。若如此做，你交给其一张牌并展示之，若该牌为装备牌，该角色可以使用此牌。',
		liangzhu_info:'其他角色在其回合内回复体力时，你可以与其各摸一张牌 ',
		mingshi_info:'当你即将受到伤害时，若伤害来源的体力值大于你，你可以弃置一张黑色手牌令伤害-1 ',
		lirang_info:'你可以将你弃置的卡牌交给一名其他角色 ',
		moukui_info:'当你使用【杀】指定一名角色为目标后，你可以选择一项：摸一张牌，或弃置其一张牌。若如此做，此【杀】被【闪】抵消时，该角色弃置你的一张牌。 ',
		qiangwu_info:'出牌阶段，你可以进行一次判定。若如此做，则直到回合结束，你使用点数小于判定牌的 【杀】时不受距离限制，且你使用点数大于判定牌的【杀】时不计入出牌阶段的使用次数。',
		shenxian_info:'每名角色的回合限一次，你的回合外，每当有其他角色因弃置而失去牌时，若其中有基本牌，你可以摸一张牌。',
		qiluan_info:'每当你杀死一名角色后，可以在回合结束时摸三张牌。',
		zhendu_info:'其他角色的出牌阶段开始时，你可以弃置一张手牌，视为该角色使用一张【酒】，然后你对其造成一点伤害。',
		shangyi_info:'出牌阶段限一次，你可以观看一名其他角色的手牌，然后弃置其中的一张黑色牌',
		shoucheng_info:'每当一名其他角色在其回合外失去最后的手牌时，你可令该角色摸一张牌。',
		shengxi_info:'若你于出牌阶段未造成伤害，你可在弃牌阶段开始时摸两张牌。',
		hengzheng_info:'摸牌阶段开始时，若你的体力值为1或你没有手牌，你可以放弃摸牌，获得每名其他角色区域里的一张牌。',
		cunsi_info:'限定技，出牌阶段，你可以将所有手牌交给一名男性角色，令该角色获得技能【勇决】，然后翻面并失去技能【闺秀】',
		guixiu_info:'每当你成为杀的目标，若你的手牌数小于体力值，可以摸一张牌',
		fenming_info:'结束阶段开始时，若你处于连环状态，你可以弃置处于连环状态的每名角色的一张牌。',
		duanxie_info:'出牌阶段限一次，你可以令一名其他角色横置武将牌，若如此做，你横置武将牌。',
		xiaoguo_info:'其他角色的结束阶段开始时，你可以弃置一张基本牌，令该角色选择一项：1.弃置一张装备牌并令你摸一张牌；2.受到你对其造成的1点伤害。',
		sijian_info:'当你失去最后的手牌时，你可以弃置一名其他角色的一张牌。',
		suishi_info:'锁定技。当一名其他角色进入濒死状态时，你摸一张牌；当一名其他角色死亡时，你失去1点体力。',
		quji_info:'出牌阶段限一次，你可以弃置X张牌（X为你已损失的体力值），然后令至多X名已受伤的角色各回复1点体力。若你以此法弃置的牌中有黑色牌，你失去一点体力。',
		junbing_info:'一名角色的结束阶段开始时，若其手牌数少于或者等于1，该角色可以摸一张牌。若如此做，该角色须将所有手牌交给你，然后你交给其等量的牌。',
		shefu_info:'结束阶段开始时，你可以将一张手牌移出游戏，称为“伏兵”。然后为“伏兵”记录一个基本牌或锦囊牌名称(须与其他“伏兵”记录的名称均不同)。你的回合外，当有其他角色使用与你记录的“伏兵”牌名相同的牌时，你可以令此牌无效，然后将该“伏兵”置入弃牌堆。',
		xiongyi_info:'限定技，出牌阶段，你可以令至多两名角色与你各摸3张牌，若你指定的角色数不超过1，你回复1点体力',
		shenzhi_info:'回合开始阶段开始时，你可以弃置所有手牌，若你以此法弃置的牌的张数不小于X，你回复1点体力（X为你当前的体力值）。',
		shushen_info:'当你回复1点体力时，你可以令一名其他角色回复1点体力或摸两张牌',
		wuji_info:'觉醒技，回合结束阶段开始时，若你于此回合内已造成3点或更多伤害，你加1点体力上限，回复1点体力，然后失去技能“虎啸”。',
		xueji_info:'出牌阶段，你可弃置一张红色牌并选择你攻击范围内的至多X名其他角色，对这些角色各造成1点伤害（X为你已损失的体力值），然后这些角色各摸一张牌。每阶段限一次。',
		huxiao_info:'锁定技，你于出牌阶段内每使用一张【杀】被【闪】抵消，你于此阶段内可以额外使用一张【杀】。',
		aocai_info:'当你于回合外需要使用或打出一张基本牌时，你可以观看牌堆顶的两张牌。若你观看的牌中有此牌，你可以使用打出之。',
		hongyuan_info:'摸牌阶段摸牌时，你可以少摸一张牌，然后指定至多两名其他角色各摸一张牌。',
		huanshi_info:'一名角色的判定牌生效前，你可令其观看你的手牌。若如此做，该角色选择你的一张牌，令你打出此牌代替之。',
		mingzhe_info:'你的回合外，每当你因使用、打出或弃置而失去一张红色牌时，你可以摸一张牌。',
		duwu_info:'出牌阶段，你可以弃置X张牌对你攻击范围内的一名其他角色造成1点伤害(X为该角色的体力值)。若你以此法令该角色进入濒死状态，则濒死状态结算后你失去1点体力，且本回合不能再发动黩武。',
		tianming_info:'当你成为【杀】的目标时，你可以弃置两张牌(不足则全弃，无牌则不弃)，然后摸两张牌;若此时全场体力值最多的角色仅有一名(且不是你)，该角色也可以如此做。',
		mizhao_info:'出牌阶段，你可以将所有手牌(至少一张)交给一名其他角色。若如此做，你令该角色与你指定的另一名有手牌的角色拼点。视为拼点赢的角色对没赢的角色使用一张【杀】。每阶段限一次。',
		yuanhu_info:'回合结束阶段开始时，你可以将一张装备牌置于一名角色的装备区里，然后根据此装备牌的种类执行以下效果。武器牌：弃置与该角色距离为1的一名角色区域中的一张牌；防具牌：该角色摸一张牌；坐骑牌：该角色回复1点体力。',
		lihun_info:'出牌阶段，你可以弃置一张牌并将你的武将牌翻面，若如此做，制定一名男性角色，获得其所有手牌。出牌阶段结束时，你需为该角色每一点体力分配给其一张牌。每回合限一次。',
		chongzhen_info:'每当你发动“龙胆”使用或打出一张手牌时，你可以立即获得对方的一张手牌。',
		bifa_info:'回合结束阶段开始时，你可以将一张手牌移出游戏并指定一名其他角色。该角色的回合开始时，其观看你移出游戏的牌并选择一项：交给你一张与此牌同类型的手牌并获得此牌；或将此牌置入弃牌堆，然后失去1点体力。',
		songci_info:'出牌阶段，你可以选择一项：令一名手牌数小于其体力值的角色摸两张牌；或令一名手牌数大于其体力值的角色弃置两张牌。此技能对每名角色只能使用一次。',
		yongsi_info:'锁定技，摸牌阶段，你额外摸X张牌，X为场上现存势力数。弃牌阶段，你至少须弃置等同于场上现存势力数的牌（不足则全弃）。',
		yicong_info:'锁定技，只要你的体力值大于2点，你计算与其他角色的距离时，始终-1；只要你的体力值为2点或更低，其他角色计算与你的距离时，始终+1。',
		baobian_info:'锁定技，若你的体力值为3或更少，你视为拥有技能“挑衅”；若你的体力值为2或更少；你视为拥有技能“咆哮”；若你的体力值为1，你视为拥有技能“神速”。',
	},
}
